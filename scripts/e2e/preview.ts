import { readFileSync } from 'fs'
import { getT } from '../../src/lib/email-templates/email-i18n'
import { DEFAULT_LOCALE } from '../../src/i18n/locales'
import {
  BASE_URL, Mailbox, adminSession, api, assertSafeTarget, bookingPayload, dateIn, expect,
  requireSecret, secret, stripeSignature, type BookingInput,
} from './lib'

// Test end-to-end sulla PREVIEW: creano prenotazioni di prova, mandano email vere a caselle temporanee
// (tempmail.plus) e ne verificano lingua, oggetto, allegati e contenuto.
//
//   npm run e2e:preview                  # tutti i test
//   npm run e2e:preview -- --only admin  # solo i test il cui nome contiene "admin"
//
// Segreti in .env.e2e.local (ignorato da git), accettati con o senza prefisso E2E_:
//   BASE_URL (opzionale), ADMIN_EMAIL, ADMIN_PASSWORD   -> npx tsx scripts/e2e/admin-user.ts
//   CRON_SECRET, STRIPE_SECRET_KEY (sk_test_), STRIPE_WEBHOOK_SECRET
// Un test a cui manca un segreto viene saltato, non fallisce.
//
// Attenzione: il cron agisce su TUTTA la preview (promemoria e annullamento dei bonifici scaduti).
// Dopo i test si puo' ripulire con scripts/cleanup-preview-db.ts.

type Locale = 'it' | 'de' | 'en'
const LOCALES: Locale[] = ['it', 'de', 'en']

interface Created {
  appointment: { id: string; managementToken: string; locale: string }
  subscription: { id: string; followUpToken: string | null }
}

async function createBooking(box: Mailbox, input: Omit<BookingInput, 'email'>): Promise<Created> {
  const res = await api('/api/bookings', { json: bookingPayload({ ...input, email: box.address }) })
  expect(res.status === 201, `POST /api/bookings -> ${res.status} ${JSON.stringify(res.body)}`)
  return res.body
}

// Come fa la pagina di prenotazione dopo aver creato l'appuntamento
async function sendBookingEmails(
  box: Mailbox,
  created: Created,
  o: { locale: string; serviceName: string; price: number; paymentMethod: string; isPaid: boolean; date: string; time: string; isFollowUp?: boolean },
): Promise<void> {
  const res = await api('/api/send-booking-emails', {
    json: {
      clientName: 'Test E2E', clientEmail: box.address, clientPhone: '+39 333 0000000',
      serviceName: o.serviceName, price: o.price, date: o.date, time: o.time, notes: '',
      paymentMethod: o.paymentMethod, isPaid: o.isPaid, managementToken: created.appointment.managementToken,
      durationMinutes: 60, locale: o.locale, ...(o.isFollowUp && { isFollowUp: true }),
    },
  })
  expect(res.status === 200, `POST /api/send-booking-emails -> ${res.status} ${JSON.stringify(res.body)}`)
}

const hasSubject = (fragment: string) => (m: { subject: string }) => m.subject.includes(fragment)

interface TestCase {
  name: string
  needs?: string[]
  run: () => Promise<void>
}

const tests: TestCase[] = []
const test = (name: string, run: () => Promise<void>, needs: string[] = []) => tests.push({ name, run, needs })

// ---------- Prenotazioni pubbliche ----------

for (const locale of LOCALES) {
  test(`prenotazione gratuita (${locale}): email, lingua e allegato .ics`, async () => {
    const t = getT(locale)
    const box = new Mailbox(`free${locale}`)
    const date = dateIn(30), time = '10:00'
    const created = await createBooking(box, { locale, commercialType: 'free-consultation', paymentMethod: 'none', date, time, isPaid: true })
    expect(created.appointment.locale === locale, `locale salvato: ${created.appointment.locale}`)
    await sendBookingEmails(box, created, { locale, serviceName: t.svcFree, price: 0, paymentMethod: 'none', isPaid: true, date, time })

    const mail = await box.waitFor('conferma', hasSubject(t.subjConfirm(t.svcFree)))
    const content = await box.read(mail)
    expect(content.html.includes(`<html lang="${locale}">`), 'attributo lang errato')
    expect(content.text.includes(t.bodyFree), 'testo della consulenza gratuita mancante')
    expect(content.attachments.includes('appuntamento.ics'), `allegato .ics mancante (allegati: ${JSON.stringify(content.attachments)})`)
  })
}

test('locale non valido: ripiega su de', async () => {
  const box = new Mailbox('badloc')
  const created = await createBooking(box, { locale: 'fr', commercialType: 'free-consultation', paymentMethod: 'none', date: dateIn(31), time: '10:00', isPaid: true })
  expect(created.appointment.locale === 'de', `locale salvato: ${created.appointment.locale}`)
})

test('bonifico (en): richiesta di prenotazione senza .ics', async () => {
  const t = getT('en')
  const box = new Mailbox('bank')
  const date = dateIn(32), time = '10:00'
  const created = await createBooking(box, { locale: 'en', commercialType: 'plan-3-months', paymentMethod: 'bank_transfer', date, time })
  await sendBookingEmails(box, created, { locale: 'en', serviceName: t.svcBundle3, price: 237, paymentMethod: 'bank_transfer', isPaid: false, date, time })
  const mail = await box.waitFor('richiesta', hasSubject(t.subjBankRequest(t.svcBundle3)))
  expect((await box.read(mail)).attachments.length === 0, 'la richiesta di bonifico non deve avere il .ics')
})

test('cancellazione dal link (en): email al cliente', async () => {
  const t = getT('en')
  const box = new Mailbox('cancel')
  const created = await createBooking(box, { locale: 'en', commercialType: 'free-consultation', paymentMethod: 'none', date: dateIn(33), time: '11:00', isPaid: true })
  const res = await api('/api/appointments/manage', { json: { token: created.appointment.managementToken, action: 'cancel' } })
  expect(res.status === 200, `manage cancel -> ${res.status} ${JSON.stringify(res.body)}`)
  await box.waitFor('cancellazione', hasSubject(t.subjCancelConfirmed), 40_000)
})

test('spostamento dal link (de)', async () => {
  const box = new Mailbox('resched')
  const created = await createBooking(box, { locale: 'de', commercialType: 'free-consultation', paymentMethod: 'none', date: dateIn(34), time: '11:00', isPaid: true })
  const res = await api('/api/appointments/manage', { json: { token: created.appointment.managementToken, action: 'reschedule', date: dateIn(35), time: '12:00' } })
  expect(res.status === 200 && res.body.action === 'rescheduled', `manage reschedule -> ${res.status} ${JSON.stringify(res.body)}`)
})

test('follow-up da link (en): locale salvato e testo dedicato', async () => {
  const t = getT('en')
  const box = new Mailbox('fup')
  const first = await createBooking(box, { locale: 'it', commercialType: 'plan-3-months', paymentMethod: 'bank_transfer', date: dateIn(36), time: '10:00' })
  expect(first.subscription.followUpToken, 'followUpToken assente')
  const info = await api(`/api/follow-up?token=${first.subscription.followUpToken}`)
  expect(info.status === 200 && info.body.valid, `GET /api/follow-up -> ${info.status}`)

  const date = dateIn(37), time = '10:00'
  const res = await api('/api/bookings', {
    json: { ...bookingPayload({ email: box.address, locale: 'en', commercialType: 'follow-up', paymentMethod: 'none', date, time, isPaid: true, existingSubscriptionId: info.body.subscriptionId }) },
  })
  expect(res.status === 201, `follow-up booking -> ${res.status}`)
  expect(res.body.appointment.locale === 'en', `locale salvato: ${res.body.appointment.locale}`)

  await sendBookingEmails(box, res.body, { locale: 'en', serviceName: t.svcFollowUp, price: 0, paymentMethod: 'none', isPaid: true, date, time, isFollowUp: true })
  const mail = await box.waitFor('conferma follow-up', hasSubject(t.subjConfirm(t.svcFollowUp)))
  const content = await box.read(mail)
  expect(content.text.includes(t.bodyFollowUp), 'testo del follow-up mancante')
  expect(!content.text.includes(t.bodyFree), 'il follow-up non deve dire "consulenza gratuita"')
})

// ---------- Pagina "Gestisci appuntamento" ----------

const decodeEntities = (html: string) =>
  html.replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')

for (const locale of LOCALES) {
  test(`pagina gestisci (${locale}): servita nella lingua giusta`, async () => {
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'))
    const res = await api(`/${locale}/gestisci/token-inesistente`)
    expect(res.status === 200, `GET /${locale}/gestisci/... -> ${res.status}`)
    const html = String(res.body)
    // Il rendering sul server mostra lo stato iniziale, che e' tradotto
    expect(decodeEntities(html).includes(messages.gestisci.caricamento), `testo "${messages.gestisci.caricamento}" assente nella pagina`)
  })
}

// Screen reader, motori di ricerca e traduzione automatica del browser si basano su <html lang>
test('ogni pagina dichiara la propria lingua in <html lang>', async () => {
  const wrong: string[] = []
  for (const locale of LOCALES) {
    for (const path of ['gestisci/token-inesistente', 'booking']) {
      const html = String((await api(`/${locale}/${path}`)).body)
      const lang = html.match(/<html[^>]*\blang="([^"]*)"/)?.[1]
      if (lang !== locale) wrong.push(`/${locale}/${path} -> lang="${lang}"`)
    }
  }
  expect(wrong.length === 0, `lang errato: ${wrong.join('; ')}`)
})

test('vecchio link /gestisci/<token>: reindirizza alla lingua predefinita con ?auto=1', async () => {
  const res = await api('/gestisci/abc123')
  expect(res.status === 307, `redirect -> ${res.status}`)
  const location = new URL(res.headers.get('location') ?? '', BASE_URL)
  expect(location.pathname.replace(/\/$/, '') === `/${DEFAULT_LOCALE}/gestisci/abc123`, `Location: ${location.pathname}`)
  expect(location.searchParams.get('auto') === '1', 'manca ?auto=1')
})

test('API gestisci: locale dell\'appuntamento e codici di errore', async () => {
  const box = new Mailbox('manage')
  const created = await createBooking(box, { locale: 'it', commercialType: 'free-consultation', paymentMethod: 'none', date: dateIn(42), time: '10:00', isPaid: true })
  const token = created.appointment.managementToken

  const info = await api(`/api/appointments/manage?token=${token}`)
  expect(info.status === 200 && info.body.locale === 'it', `GET -> ${info.status} locale=${info.body?.locale}`)

  const noToken = await api('/api/appointments/manage')
  expect(noToken.status === 400 && noToken.body.code === 'missingToken', `senza token -> ${noToken.status} ${noToken.body?.code}`)

  const unknown = await api('/api/appointments/manage?token=non-esiste')
  expect(unknown.status === 404 && unknown.body.code === 'notFound', `token sconosciuto -> ${unknown.status} ${unknown.body?.code}`)

  const cancel = await api('/api/appointments/manage', { json: { token, action: 'cancel' } })
  expect(cancel.status === 200, `cancel -> ${cancel.status}`)

  const after = await api(`/api/appointments/manage?token=${token}`)
  expect(after.status === 410 && after.body.code === 'alreadyCancelled', `GET dopo cancel -> ${after.status} ${after.body?.code}`)
  const again = await api('/api/appointments/manage', { json: { token, action: 'cancel' } })
  expect(again.status === 409 && again.body.code === 'notAllowed', `secondo cancel -> ${again.status} ${again.body?.code}`)
})

// ---------- Azioni admin ----------

const ADMIN = ['ADMIN_EMAIL', 'ADMIN_PASSWORD']

test('admin: segna pagato -> conferma, sposta -> email (en, prima visita)', async () => {
  const t = getT('en')
  const cookies = await adminSession()
  const box = new Mailbox('adminen')
  const date = dateIn(38), time = '10:00'
  const created = await createBooking(box, { locale: 'en', commercialType: 'first-visit', paymentMethod: 'bank_transfer', date, time })
  await sendBookingEmails(box, created, { locale: 'en', serviceName: t.svcFirstVisit, price: 85, paymentMethod: 'bank_transfer', isPaid: false, date, time })
  await box.waitFor('richiesta', hasSubject(t.subjBankRequest(t.svcFirstVisit)))

  const pay = await api(`/api/admin/appointments/${created.appointment.id}`, { method: 'PATCH', json: { isPaid: true }, cookies })
  expect(pay.status === 200, `admin isPaid -> ${pay.status}`)
  const mail = await box.waitFor('conferma dopo pagamento', hasSubject(t.subjConfirm(t.svcFirstVisit)))
  expect((await box.read(mail)).html.includes('<html lang="en">'), 'lingua della conferma errata')

  const move = await api(`/api/admin/appointments/${created.appointment.id}`, { method: 'PATCH', json: { reschedule: true, date: dateIn(39), time: '15:00' }, cookies })
  expect(move.status === 200, `admin reschedule -> ${move.status}`)
  const moved = await box.waitFor('spostamento', hasSubject(t.subjRescheduled))
  const content = await box.read(moved)
  expect(content.text.includes(t.svcFirstVisit) && content.text.includes('15:00'), 'servizio o orario mancanti nell\'email di spostamento')
}, ADMIN)

test('admin: completa sessione -> follow-up (it, percorso 3 mesi)', async () => {
  const t = getT('it')
  const cookies = await adminSession()
  const box = new Mailbox('adminit')
  const date = dateIn(40), time = '10:00'
  const created = await createBooking(box, { locale: 'it', commercialType: 'plan-3-months', paymentMethod: 'bank_transfer', date, time })
  await sendBookingEmails(box, created, { locale: 'it', serviceName: t.svcBundle3, price: 237, paymentMethod: 'bank_transfer', isPaid: false, date, time })

  await api(`/api/admin/appointments/${created.appointment.id}`, { method: 'PATCH', json: { isPaid: true }, cookies })
  await box.waitFor('conferma dopo pagamento', hasSubject(t.subjConfirm(t.svcBundle3)))

  const done = await api(`/api/admin/appointments/${created.appointment.id}`, { method: 'PATCH', json: { status: 'completed' }, cookies })
  expect(done.status === 200, `admin completed -> ${done.status}`)
  const mail = await box.waitFor('follow-up', hasSubject(t.fuSubject(2)))
  const content = await box.read(mail)
  expect(content.html.includes('/it/booking/follow-up/'), 'link del follow-up senza locale')
}, ADMIN)

// ---------- Cron e Stripe ----------

test('cron: secret errato -> 401', async () => {
  const res = await api('/api/cron/reminders', { headers: { Authorization: 'Bearer sbagliato' } })
  expect(res.status === 401, `cron -> ${res.status}`)
})

test('cron: promemoria a 3 giorni (en)', async () => {
  const t = getT('en')
  const box = new Mailbox('cron')
  await createBooking(box, { locale: 'en', commercialType: 'free-consultation', paymentMethod: 'none', date: dateIn(3), time: '09:30', isPaid: true })
  const res = await api('/api/cron/reminders', { headers: { Authorization: `Bearer ${requireSecret('CRON_SECRET')}` } })
  expect(res.status === 200 && res.body.reminders >= 1, `cron -> ${res.status} ${JSON.stringify(res.body)}`)
  await box.waitFor('promemoria', hasSubject(t.subjReminder('09:30')))
}, ['CRON_SECRET'])

test('webhook Stripe: firma errata -> 400', async () => {
  const res = await api('/api/stripe-webhook', { rawBody: '{}', headers: { 'Stripe-Signature': 't=1,v1=00' } })
  expect(res.status === 400, `webhook -> ${res.status}`)
})

test('webhook Stripe: pagamento completato (de) -> email di conferma', async () => {
  const t = getT('de')
  const key = requireSecret('STRIPE_SECRET_KEY')
  const box = new Mailbox('stripe')
  const checkout = await api('/api/create-checkout-session', {
    json: bookingPayload({ email: box.address, locale: 'de', commercialType: 'first-visit', paymentMethod: 'stripe', date: dateIn(41), time: '10:00' }),
  })
  expect(checkout.status === 201 && checkout.body.url, `create-checkout-session -> ${checkout.status}`)
  const sessionId = String(checkout.body.url).split('/pay/')[1]?.split('#')[0]
  expect(sessionId, 'id della sessione Stripe non trovato nell\'URL')

  // Metadata reali della sessione (test mode)
  const session = (await api('', { url: `https://api.stripe.com/v1/checkout/sessions/${sessionId}`, headers: { Authorization: `Bearer ${key}` } })).body
  expect(session.livemode === false, 'sessione Stripe non in test mode')
  expect(session.metadata?.locale === 'de', `locale nei metadata: ${session.metadata?.locale}`)
  expect(session.metadata?.serviceName === t.svcFirstVisit, `serviceName nei metadata: ${session.metadata?.serviceName}`)

  const payload = JSON.stringify({
    id: `evt_e2e_${Date.now()}`, object: 'event', type: 'checkout.session.completed',
    data: { object: { ...session, payment_status: 'paid', status: 'complete' } },
  })
  const hook = await api('/api/stripe-webhook', {
    rawBody: payload,
    headers: { 'Content-Type': 'application/json', 'Stripe-Signature': stripeSignature(payload, requireSecret('STRIPE_WEBHOOK_SECRET')) },
  })
  expect(hook.status === 200, `webhook -> ${hook.status} ${JSON.stringify(hook.body)}`)
  const mail = await box.waitFor('conferma pagamento', hasSubject(t.subjConfirm(t.svcFirstVisit)))
  expect((await box.read(mail)).html.includes('<html lang="de">'), 'lingua della conferma errata')
}, ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'])

// ---------- Esecuzione ----------

async function main() {
  assertSafeTarget()
  const onlyIdx = process.argv.indexOf('--only')
  const only = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : undefined
  const selected = tests.filter((t) => !only || t.name.includes(only))

  console.log(`E2E su ${BASE_URL} (${selected.length} test)\n`)
  let passed = 0, failed = 0, skipped = 0
  for (const t of selected) {
    const missing = (t.needs ?? []).filter((n) => !secret(n))
    if (missing.length) {
      skipped++
      console.log(`- SKIP  ${t.name}  (manca ${missing.join(', ')})`)
      continue
    }
    const started = Date.now()
    try {
      await t.run()
      passed++
      console.log(`✓ PASS  ${t.name}  (${Math.round((Date.now() - started) / 1000)}s)`)
    } catch (err) {
      failed++
      console.log(`✗ FAIL  ${t.name}\n        ${err instanceof Error ? err.message : err}`)
    }
  }
  console.log(`\n${passed} passati, ${failed} falliti, ${skipped} saltati`)
  process.exitCode = failed ? 1 : 0
}

void main()

