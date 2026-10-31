import { config } from 'dotenv'
import { createHmac, randomBytes } from 'crypto'

// Utility per i test end-to-end sulla preview (vedi preview.ts).
// I segreti si leggono da .env.e2e.local (ignorato da git): non vanno mai scritti nel codice.

config({ path: '.env.e2e.local', quiet: true })

const DEFAULT_BASE_URL = 'https://preview.vivaplantnutrition.com'
const PRODUCTION_HOSTS = ['www.vivaplantnutrition.com', 'vivaplantnutrition.com']

// Accetta sia E2E_NOME sia NOME, perché i segreti si copiano spesso da .env.local
export function secret(name: string): string | undefined {
  return process.env[`E2E_${name}`] ?? process.env[name]
}

export function requireSecret(name: string): string {
  const value = secret(name)
  if (!value) throw new Error(`Manca ${name} in .env.e2e.local`)
  return value
}

export const BASE_URL = (secret('BASE_URL') ?? DEFAULT_BASE_URL).replace(/\/$/, '')

// Sicurezza: questi test creano prenotazioni vere e mandano email, non devono mai girare in produzione
export function assertSafeTarget(): void {
  const host = new URL(BASE_URL).host
  if (PRODUCTION_HOSTS.includes(host)) throw new Error(`Rifiuto di girare contro la produzione (${host})`)
  const stripeKey = secret('STRIPE_SECRET_KEY')
  if (stripeKey && !stripeKey.startsWith('sk_test_')) throw new Error('STRIPE_SECRET_KEY non è una chiave di test')
}

// ---------- HTTP ----------

export interface ApiResponse {
  status: number
  ok: boolean
  headers: Headers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
}

interface ApiOptions {
  method?: string
  json?: unknown
  rawBody?: string
  form?: Record<string, string>
  headers?: Record<string, string>
  cookies?: Map<string, string>
  url?: string
}

export async function api(path: string, options: ApiOptions = {}): Promise<ApiResponse> {
  const headers: Record<string, string> = { ...options.headers }
  let body: string | undefined
  if (options.json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(options.json)
  } else if (options.form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    body = new URLSearchParams(options.form).toString()
  } else if (options.rawBody !== undefined) {
    body = options.rawBody
  }
  if (options.cookies?.size) {
    headers.Cookie = [...options.cookies].map(([k, v]) => `${k}=${v}`).join('; ')
  }

  const res = await fetch(options.url ?? BASE_URL + path, {
    method: options.method ?? (body ? 'POST' : 'GET'),
    headers,
    body,
    redirect: 'manual',
    signal: AbortSignal.timeout(45_000),
  })

  if (options.cookies) {
    for (const line of res.headers.getSetCookie()) {
      const [pair] = line.split(';')
      const i = pair.indexOf('=')
      options.cookies.set(pair.slice(0, i), pair.slice(i + 1))
    }
  }

  const text = await res.text()
  let parsed: unknown = text
  try { parsed = JSON.parse(text) } catch { /* resta testo */ }
  return { status: res.status, ok: res.ok, headers: res.headers, body: parsed }
}

// Sessione admin (NextAuth, credentials)
export async function adminSession(): Promise<Map<string, string>> {
  const cookies = new Map<string, string>()
  const csrf = await api('/api/auth/csrf', { cookies })
  const login = await api('/api/auth/callback/credentials', {
    cookies,
    form: {
      csrfToken: csrf.body.csrfToken,
      email: requireSecret('ADMIN_EMAIL'),
      password: requireSecret('ADMIN_PASSWORD'),
      json: 'true',
    },
  })
  const check = await api('/api/admin/appointments', { cookies })
  if (login.status >= 400 || check.status !== 200) {
    throw new Error(
      `Login admin fallito (${login.status}/${check.status}). L'utente di prova esiste? Crealo con ` +
        '`npx tsx scripts/e2e/admin-user.ts` e incolla lo SQL nell\'SQL Editor di Supabase (progetto preview).',
    )
  }
  return cookies
}

// ---------- Casella email temporanea (tempmail.plus, senza account) ----------

export interface MailItem {
  mail_id: number
  subject: string
  from_mail: string
}

export interface MailContent {
  subject: string
  text: string
  html: string
  attachments: string[]
}

export class Mailbox {
  readonly address: string

  constructor(tag: string) {
    this.address = `viva${tag}${randomBytes(3).toString('hex')}@mailto.plus`
  }

  async list(): Promise<MailItem[]> {
    try {
      const res = await api('', { url: `https://tempmail.plus/api/mails?limit=50&email=${encodeURIComponent(this.address)}` })
      return Array.isArray(res.body?.mail_list) ? res.body.mail_list : []
    } catch {
      return []
    }
  }

  async read(mail: MailItem): Promise<MailContent> {
    const res = await api('', { url: `https://tempmail.plus/api/mails/${mail.mail_id}?email=${encodeURIComponent(this.address)}` })
    // L'elenco di tempmail.plus riporta sempre 0 allegati: i nomi veri sono solo nel dettaglio
    const attachments: string[] = Array.isArray(res.body.attachments) ? res.body.attachments.map((a: { name: string }) => a.name) : []
    return { subject: res.body.subject ?? '', text: res.body.text ?? '', html: res.body.html ?? '', attachments }
  }

  // Attende un'email che soddisfi il filtro; lancia se non arriva entro il timeout
  async waitFor(description: string, match: (mail: MailItem) => boolean, timeoutMs = 60_000): Promise<MailItem> {
    const start = Date.now()
    for (;;) {
      const found = (await this.list()).find(match)
      if (found) return found
      if (Date.now() - start > timeoutMs) {
        const subjects = (await this.list()).map((m) => m.subject)
        throw new Error(`Email non arrivata entro ${timeoutMs / 1000}s: ${description} (ricevute: ${JSON.stringify(subjects)})`)
      }
      await sleep(4000)
    }
  }
}

// ---------- Varie ----------

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Data nel formato YYYY-MM-DD, `days` giorni da oggi (UTC, come il server)
export function dateIn(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// Un test lancia SkipTest quando manca un prerequisito (es. Chrome): viene saltato, non fallisce
export class SkipTest extends Error {}

export function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

// Firma di un evento come farebbe Stripe (stesso schema di stripe.webhooks.constructEvent)
export function stripeSignature(payload: string, webhookSecret: string): string {
  const t = Math.floor(Date.now() / 1000)
  const v1 = createHmac('sha256', webhookSecret).update(`${t}.${payload}`).digest('hex')
  return `t=${t},v1=${v1}`
}

export interface BookingInput {
  email: string
  locale: string
  commercialType: 'free-consultation' | 'first-visit' | 'follow-up' | 'plan-3-months' | 'plan-6-months'
  paymentMethod: 'none' | 'bank_transfer' | 'stripe'
  date: string
  time: string
  isPaid?: boolean
  existingSubscriptionId?: string
}

// Dati fittizi: nessun dato personale reale
export function bookingPayload(input: BookingInput) {
  return {
    name: 'Test', surname: 'E2E', email: input.email, phone: '+39 333 0000000',
    address: 'Via Test', civicNumber: '1', city: 'Milano', zipCode: '20100', country: 'Italia',
    fiscalCode: 'RSSMRA80A01F205X',
    commercialType: input.commercialType,
    paymentMethod: input.paymentMethod,
    selectedDate: input.date,
    selectedTime: input.time,
    notes: 'e2e test',
    isPaid: input.isPaid ?? false,
    status: input.isPaid ? 'confirmed' : 'pending',
    durationMinutes: 60,
    locale: input.locale,
    ...(input.existingSubscriptionId && { existingSubscriptionId: input.existingSubscriptionId }),
  }
}
