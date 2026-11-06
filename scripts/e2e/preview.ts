import { readFileSync } from 'fs'
import type { Page } from 'playwright-core'
import { withPage, rejectCookies } from './browser'
import { getT } from '../../src/lib/email-templates/email-i18n'
import {
  BASE_URL, Mailbox, adminSession, api, assertSafeTarget, bookingPayload, dateIn, expect,
  requireSecret, secret, SkipTest, stripeSignature, type BookingInput,
} from './lib'

// Test end-to-end sulla PREVIEW: creano prenotazioni di prova, mandano email vere a caselle temporanee
// (tempmail.plus) e ne verificano lingua, oggetto, allegati e contenuto.
//
//   npm run e2e:preview                  # tutti i test (circa 35 email: una sola corsa prima di un rilascio)
//   npm run e2e:preview:fast             # senza email: salta i test di consegna e blocca le email nel browser
//   npm run e2e:preview -- --only admin  # solo i test il cui nome contiene "admin"
//
// Resend gratuito: 100 email al giorno. Con --no-mail i test non ne mandano nessuna.
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
const DEFAULT_LOCALE: Locale = 'de'

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
  mail?: boolean
  run: () => Promise<void>
}

// Con --no-mail non parte nessuna email: i test di consegna si saltano e quelli del browser bloccano le chiamate di invio
const NO_MAIL = process.argv.includes('--no-mail')

const tests: TestCase[] = []
const test = (name: string, run: () => Promise<void>, needs: string[] = []) => tests.push({ name, run, needs })
// Test il cui scopo è la consegna delle email (o che le fanno partire): saltati con --no-mail
const mailTest = (name: string, run: () => Promise<void>, needs: string[] = []) => tests.push({ name, run, needs, mail: true })

// ---------- Prenotazioni pubbliche ----------

for (const locale of LOCALES) {
  mailTest(`prenotazione gratuita (${locale}): email, lingua e allegato .ics`, async () => {
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

mailTest('locale non valido: ripiega su de', async () => {
  const box = new Mailbox('badloc')
  const created = await createBooking(box, { locale: 'fr', commercialType: 'free-consultation', paymentMethod: 'none', date: dateIn(31), time: '10:00', isPaid: true })
  expect(created.appointment.locale === 'de', `locale salvato: ${created.appointment.locale}`)
})

mailTest('bonifico (en): richiesta di prenotazione senza .ics', async () => {
  const t = getT('en')
  const box = new Mailbox('bank')
  const date = dateIn(32), time = '10:00'
  const created = await createBooking(box, { locale: 'en', commercialType: 'plan-3-months', paymentMethod: 'bank_transfer', date, time })
  await sendBookingEmails(box, created, { locale: 'en', serviceName: t.svcBundle3, price: 237, paymentMethod: 'bank_transfer', isPaid: false, date, time })
  const mail = await box.waitFor('richiesta', hasSubject(t.subjBankRequest(t.svcBundle3)))
  expect((await box.read(mail)).attachments.length === 0, 'la richiesta di bonifico non deve avere il .ics')
})

mailTest('cancellazione dal link (en): email al cliente', async () => {
  const t = getT('en')
  const box = new Mailbox('cancel')
  const created = await createBooking(box, { locale: 'en', commercialType: 'free-consultation', paymentMethod: 'none', date: dateIn(33), time: '11:00', isPaid: true })
  const res = await api('/api/appointments/manage', { json: { token: created.appointment.managementToken, action: 'cancel' } })
  expect(res.status === 200, `manage cancel -> ${res.status} ${JSON.stringify(res.body)}`)
  await box.waitFor('cancellazione', hasSubject(t.subjCancelConfirmed), 40_000)
})

mailTest('spostamento dal link (de)', async () => {
  const box = new Mailbox('resched')
  const created = await createBooking(box, { locale: 'de', commercialType: 'free-consultation', paymentMethod: 'none', date: dateIn(34), time: '11:00', isPaid: true })
  const res = await api('/api/appointments/manage', { json: { token: created.appointment.managementToken, action: 'reschedule', date: dateIn(35), time: '12:00' } })
  expect(res.status === 200 && res.body.action === 'rescheduled', `manage reschedule -> ${res.status} ${JSON.stringify(res.body)}`)
})

mailTest('follow-up da link (en): locale salvato e testo dedicato', async () => {
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
  test(`pagina manage (${locale}): servita nella lingua giusta`, async () => {
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'))
    const res = await api(`/${locale}/manage/token-inesistente`)
    expect(res.status === 200, `GET /${locale}/manage/... -> ${res.status}`)
    const html = String(res.body)
    // Il rendering sul server mostra lo stato iniziale, che e' tradotto
    expect(decodeEntities(html).includes(messages.gestisci.caricamento), `testo "${messages.gestisci.caricamento}" assente nella pagina`)
  })
}

// Screen reader, motori di ricerca e traduzione automatica del browser si basano su <html lang>
test('ogni pagina dichiara la propria lingua in <html lang>', async () => {
  const wrong: string[] = []
  for (const locale of LOCALES) {
    for (const path of ['manage/token-inesistente', 'booking']) {
      const html = String((await api(`/${locale}/${path}`)).body)
      const lang = html.match(/<html[^>]*\blang="([^"]*)"/)?.[1]
      if (lang !== locale) wrong.push(`/${locale}/${path} -> lang="${lang}"`)
    }
  }
  expect(wrong.length === 0, `lang errato: ${wrong.join('; ')}`)
})

// Titolo e descrizione devono essere nella lingua della pagina (SEO e anteprime nei risultati di ricerca)
const decodeAll = (s: string) => decodeEntities(s).replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
const PAGES: [path: string, namespace: string][] = [
  ['', 'sito'], ['about', 'chi-sono'], ['contact', 'contatti'], ['booking', 'prenota'],
  ['services', 'servizi'], ['cookie-policy', 'cookie-policy'], ['privacy-policy', 'privacy-policy'], ['manage/token-inesistente', 'gestisci'],
]
for (const locale of LOCALES) {
  test(`metadati (${locale}): titolo e descrizione tradotti in ogni pagina`, async () => {
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'))
    const problems: string[] = []
    for (const [path, ns] of PAGES) {
      const html = decodeAll(String((await api(`/${locale}${path ? `/${path}` : ''}`)).body))
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
      const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]
      if (title !== messages[ns]['meta-titolo']) problems.push(`/${locale}/${path}: title "${title}"`)
      if (description !== messages[ns]['meta-descrizione']) problems.push(`/${locale}/${path}: description "${description?.slice(0, 40)}..."`)
    }
    expect(problems.length === 0, problems.join(' | '))
  })
}

test('sitemap con hreflang in tutte le lingue; robots.txt chiuso fuori produzione', async () => {
  const sitemap = String((await api('/sitemap.xml')).body)
  for (const locale of LOCALES) {
    expect(new RegExp(`<loc>[^<]*/${locale}/about</loc>`).test(sitemap), `sitemap senza /${locale}/about`)
    expect(new RegExp(`hreflang="${locale}" href="[^"]*/${locale}/about"`).test(sitemap), `hreflang ${locale} mancante per /about`)
  }
  expect(/hreflang="x-default" href="[^"]*\/de\/about"/.test(sitemap), 'x-default mancante')
  for (const hidden of ['/manage', '/admin', '/blog', '/recipes']) expect(!sitemap.includes(hidden), `${hidden} non dovrebbe essere in sitemap`)
  const robots = String((await api('/robots.txt')).body)
  // Preview e sviluppo non devono comparire nei motori di ricerca: robots.txt chiude tutto
  expect(/Disallow: \/(\s|$)/.test(robots) && !/Allow: \//.test(robots), `robots.txt: ${robots.replace(/\n/g, ' | ')}`)
})

// Ogni pagina pubblica dichiara se stessa come canonica e le altre lingue con hreflang (più x-default);
// le pagine private non devono avere né canonical né hreflang
const HREFLANG_PATHS = ['', '/about', '/services', '/contact', '/booking', '/privacy-policy', '/cookie-policy', '/cancellation-policy']
for (const locale of LOCALES) {
  test(`hreflang e canonical (${locale}): presenti in ogni pagina pubblica`, async () => {
    const wrong: string[] = []
    for (const path of HREFLANG_PATHS) {
      const html = String((await api(`/${locale}${path}`)).body)
      const links = [...html.matchAll(/<link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/gi)].map((m) => [m[1], new URL(m[2]).pathname] as const)
      const found = Object.fromEntries(links)
      for (const l of LOCALES) if (found[l] !== `/${l}${path}`) wrong.push(`${locale}${path}: hreflang ${l} = ${found[l]}`)
      if (found['x-default'] !== `/${DEFAULT_LOCALE}${path}`) wrong.push(`${locale}${path}: x-default = ${found['x-default']}`)
      const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1]
      if (!canonical || new URL(canonical).pathname !== `/${locale}${path}`) wrong.push(`${locale}${path}: canonical = ${canonical}`)
    }
    expect(wrong.length === 0, wrong.join('; '))
  })
}

test('pagine private: nessun canonical né hreflang', async () => {
  const wrong: string[] = []
  for (const path of ['/en/manage/token-inesistente', '/en/booking/success?session_id=x', '/en/booking/follow-up/token-inesistente']) {
    const html = String((await api(path)).body)
    if (/<link[^>]*(rel="canonical"|hreflang=)/i.test(html)) wrong.push(`${path}: ha canonical o hreflang`)
    if (!/<meta name="robots" content="noindex/.test(html)) wrong.push(`${path}: noindex assente`)
  }
  expect(wrong.length === 0, wrong.join('; '))
})

test('pagina manage: non indicizzabile (noindex)', async () => {
  const html = String((await api('/en/manage/token-inesistente')).body)
  expect(/<meta name="robots" content="noindex/.test(html), 'meta robots noindex assente')
})

mailTest('API manage: locale dell\'appuntamento e codici di errore', async () => {
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

// ---------- Browser (Chrome) ----------
// Servono per cio' che il server non mostra: navigazione dentro il sito e codice che gira nel browser.

test('browser: il selettore di lingua tiene allineato <html lang>', async () => {
  const messages = JSON.parse(readFileSync('messages/it.json', 'utf8'))
  await withPage(async (page) => {
    await page.goto(`${BASE_URL}/it`)
    await rejectCookies(page, messages.cookie.rifiuta)
    expect((await page.getAttribute('html', 'lang')) === 'it', 'lang iniziale diverso da it')
    for (const [label, locale] of [['DE', 'de'], ['EN', 'en'], ['IT', 'it'], ['DE', 'de']] as const) {
      await page.getByRole('button', { name: new RegExp(`\\b${label}\\b`) }).first().click()
      await page.waitForURL(new RegExp(`/${locale}$`))
      await page.waitForFunction((l) => document.documentElement.lang === l, locale, { timeout: 5000 }).catch(() => undefined)
      const lang = await page.getAttribute('html', 'lang')
      expect(lang === locale, `dopo il clic su ${label}: lang="${lang}", atteso "${locale}"`)
    }
  })
})

// ---------- Browser: flussi dell'interfaccia (prenotazione, banner cookie, selettori, chat) ----------

// Percorre i passi 1-3 della prenotazione (servizio, dati, data e ora) e si ferma al riepilogo.
// Restituisce le richieste POST verso /api/ fatte dal browser, per controllare cosa arriva al server.
async function fillBookingSteps(page: Page, serviceKey: string, email: string, nextMonth: boolean, dayFromEnd = 1, stopAtDateStep = false) {
  const messages = JSON.parse(readFileSync('messages/en.json', 'utf8'))
  const pren = messages.prenota
  const posted: { url: string; body: any }[] = []
  page.on('request', (r) => {
    if (r.method() === 'POST' && r.url().includes('/api/')) {
      let body: any = r.postData()
      try { body = JSON.parse(body) } catch { /* resta testo */ }
      posted.push({ url: new URL(r.url()).pathname, body })
    }
  })

  // E2E_SLOW_SLOTS_MS ritarda la risposta con gli orari disponibili: serve a verificare che il test non scelga prima del caricamento
  if (process.env.E2E_SLOW_SLOTS_MS) {
    await page.route(/\/api\/bookings\?date=/, async (route) => {
      await new Promise((r) => setTimeout(r, Number(process.env.E2E_SLOW_SLOTS_MS)))
      await route.continue()
    })
  }
  // Con --no-mail la pagina non può far partire le email: la chiamata di invio riceve una risposta finta
  if (NO_MAIL) await page.route('**/api/send-booking-emails', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }))

  await page.goto(`${BASE_URL}/en/booking`)
  await rejectCookies(page, messages.cookie.rifiuta)

  // Passo 1: servizio (con l'avviso sulle lingue delle consulenze)
  await page.getByText(pren.step1['lingua-consulenze']).first().waitFor({ timeout: 15_000 }).catch(() => { throw new Error('avviso sulle lingue delle consulenze non mostrato') })
  await page.getByRole('button', { name: new RegExp(pren.servizi[serviceKey]) }).first().click()
  await page.getByRole('button', { name: pren.step1.continua, exact: true }).last().click()

  // Passo 2: dati (prefisso telefonico di default per l'inglese: +44)
  await page.getByText(pren.step2.titolo).first().waitFor({ timeout: 15_000 })
  await page.locator('input[name="given-name"]').fill('Test')
  await page.locator('input[name="family-name"]').fill('E2E')
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="tel-national"]').fill('3330000000')
  await page.locator('input[name="street-address"]').fill('Via Test')
  await page.locator('input[name="address-line2"]').fill('1')
  await page.locator('input[name="postal-code"]').fill('20100')
  await page.locator('input[name="address-level2"]').fill('Milano')
  await page.locator('input[name="fiscal-code"]').fill('RSSMRA80A01F205X')
  await page.locator('input[type="checkbox"]').first().check()
  await page.getByRole('button', { name: pren.step2.continua, exact: true }).last().click()

  // Passo 3: ultimo giorno libero del mese mostrato (o del successivo), primo orario libero
  await page.getByText(/Choose the date/).first().waitFor({ timeout: 15_000 })
  if (stopAtDateStep) return { posted, messages, pren }
  if (nextMonth) await page.locator('span.capitalize.font-bold + button').click()
  const days = page.locator('button.rounded-full:not([disabled])').filter({ hasText: /^\d{1,2}$/ })
  await days.first().waitFor({ timeout: 15_000 })
  // Il pulsante per proseguire si abilita solo con data e ora scelte
  const proceed = page.getByRole('button', { name: new RegExp(`^(${pren.step3['continua-pagamento']}|${pren.step3.conferma})$`) }).last()
  // Dopo il clic sul giorno la pagina mostra tutti gli orari abilitati e li aggiorna solo quando arriva la disponibilità:
  // scegliere prima farebbe cadere il clic su un orario che poi si disabilita. Si aspetta quindi la risposta del server.
  const availability = page.waitForResponse((r) => /\/api\/bookings\?date=/.test(r.url()), { timeout: 15_000 })
  await days.nth(-dayFromEnd).click()
  await availability
  await page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))))
  const slot = page.locator('button:not([disabled])').filter({ hasText: /^\d{2}:\d{2}$/ }).first()
  await slot.waitFor({ timeout: 15_000 })
  await slot.click()
  // Se il pulsante per proseguire non si abilita si dice cosa mostra la pagina
  const enabled = await (async () => {
    for (let i = 0; i < 30; i++) {
      if (await proceed.isEnabled()) return true
      await page.waitForTimeout(100)
    }
    return false
  })()
  if (!enabled) {
    const slots = await page.locator('button').filter({ hasText: /^\d{2}:\d{2}$/ }).evaluateAll((els) => els.map((e) => `${e.textContent}${(e as HTMLButtonElement).disabled ? '(x)' : ''}`).join(' '))
    throw new Error(`data e ora non selezionate (${page.url()}); orari: ${slots}`)
  }
  return { posted, messages, pren }
}

// Il telefono arriva al server come "prefisso numero": se manca la prenotazione viene rifiutata
function expectPhoneSent(posted: { url: string; body: any }[], bookingUrl = '/api/bookings') {
  const validate = posted.find((p) => p.url === '/api/validate-booking')
  expect(validate?.body?.phone === '+44 3330000000', `validate-booking: phone = ${JSON.stringify(validate?.body?.phone)}`)
  const booking = posted.find((p) => p.url === bookingUrl)
  expect(booking?.body?.phone === '+44 3330000000', `${bookingUrl}: phone = ${JSON.stringify(booking?.body?.phone)}`)
}

test('browser: prenotazione gratuita completa dal sito (en)', async () => {
  const box = new Mailbox('ui')
  await withPage(async (page) => {
    const { posted, pren } = await fillBookingSteps(page, 'colloquio-gratuito-titolo', box.address, false)
    await page.getByRole('button', { name: pren.step3.conferma, exact: true }).last().click()

    // Passo 4: riepilogo e conferma
    await page.getByText(pren.step4['titolo-gratuito']).first().waitFor({ timeout: 15_000 })
    await page.locator('input[type="checkbox"]').last().check()
    await page.getByRole('button', { name: pren.step4.conferma, exact: true }).last().click()
    await page.getByText(pren.successo['titolo-confermato']).first().waitFor({ timeout: 30_000 })
    expect((await page.innerText('body')).includes('Thank you Test'), 'saluto con il nome non mostrato')
    expectPhoneSent(posted)
  })
  if (!NO_MAIL) await box.waitFor('conferma prenotazione', (m) => /confirm/i.test(m.subject), 90_000)
})

test('browser: prenotazione con bonifico dal sito (en): richiesta e istruzioni', async () => {
  const t = getT('en')
  const box = new Mailbox('uibank')
  await withPage(async (page) => {
    const { posted, pren } = await fillBookingSteps(page, 'prima-visita-titolo', box.address, true, 1)
    await page.getByRole('button', { name: pren.step3['continua-pagamento'], exact: true }).last().click()

    // Passo 4: pagamento con bonifico (disponibile solo oltre 5 giorni dalla data scelta)
    await page.getByText(pren.step4['titolo-pagamento']).first().waitFor({ timeout: 15_000 })
    await page.getByText(pren.step4['bonifico-label']).first().click()
    await page.locator('input[type="checkbox"]').last().check()
    await page.getByRole('button', { name: pren.step4['prenota-bonifico'], exact: true }).last().click()
    await page.getByText(pren.successo['titolo-bonifico']).first().waitFor({ timeout: 30_000 })
    const body = await page.innerText('body')
    expect(body.includes(pren.successo['bonifico-titolo'].replace(/^\S+\s/, '')), 'istruzioni del bonifico non mostrate')
    expectPhoneSent(posted)
    expect(posted.every((p) => p.url !== '/api/create-checkout-session'), 'con il bonifico non deve partire il pagamento con carta')
  })
  if (NO_MAIL) return
  const mail = await box.waitFor('richiesta di bonifico', hasSubject(t.subjBankRequest(t.svcFirstVisit)), 90_000)
  expect((await box.read(mail)).attachments.length === 0, 'la richiesta di bonifico non deve avere il .ics')
})

test('browser: prenotazione con carta dal sito (en): pagamento Stripe di test e conferma', async () => {
  const t = getT('en')
  const box = new Mailbox('uicard')
  await withPage(async (page) => {
    const { posted, pren, messages } = await fillBookingSteps(page, 'prima-visita-titolo', box.address, true, 2)
    await page.getByRole('button', { name: pren.step3['continua-pagamento'], exact: true }).last().click()

    // Passo 4: la carta è il metodo di default
    await page.getByText(pren.step4['titolo-pagamento']).first().waitFor({ timeout: 15_000 })
    await page.locator('input[type="checkbox"]').last().check()
    await page.getByRole('button', { name: pren.step4['paga-prenota'], exact: true }).last().click()

    // Pagina di pagamento di Stripe (modalità test): carta 4242 4242 4242 4242, scadenza e CVC qualsiasi
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 45_000 })
    expectPhoneSent(posted, '/api/create-checkout-session')
    // Pagare farebbe partire la conferma dal webhook di Stripe (una email): con --no-mail ci si ferma qui
    if (NO_MAIL) return
    // Sulla riga c'è un pulsante trasparente che intercetta il clic: lo si preme alle coordinate della riga
    await page.locator('#payment-method-label-card').click({ force: true })
    await page.locator('#cardNumber').fill('4242424242424242')
    await page.locator('#cardExpiry').fill('1234')
    await page.locator('#cardCvc').fill('123')
    await page.locator('#billingName').fill('Test E2E')
    const postal = page.locator('#billingPostalCode')
    if (await postal.count()) await postal.fill('20100')
    await page.locator('[data-testid="hosted-payment-submit-button"]').click()

    // Ritorno sul sito: pagina di successo
    await page.waitForURL(/\/booking\/success\?session_id=/, { timeout: 90_000 })
    await page.getByText(messages['booking-success'].titolo).first().waitFor({ timeout: 15_000 })
  })
  // La conferma parte dal webhook di Stripe
  if (!NO_MAIL) await box.waitFor('conferma dopo il pagamento', hasSubject(t.subjConfirm(t.svcFirstVisit)), 120_000)
})

test('browser: un orario scelto prima del caricamento e poi risultato occupato non resta selezionato', async () => {
  // Giorno feriale lontano con l'orario delle 10:00 già occupato (creato via API: non parte nessuna email)
  let n = 46
  while ([0, 6].includes(new Date(`${dateIn(n)}T12:00:00Z`).getUTCDay())) n++
  const date = dateIn(n)
  await createBooking(new Mailbox('late'), { locale: 'en', commercialType: 'first-visit', paymentMethod: 'bank_transfer', date, time: '10:00' })
  const monthsAhead = (Number(date.slice(0, 4)) - new Date().getUTCFullYear()) * 12 + Number(date.slice(5, 7)) - (new Date().getUTCMonth() + 1)

  await withPage(async (page) => {
    // La disponibilità arriva dopo 2 secondi: nel frattempo tutti gli orari risultano abilitati
    await page.route(/\/api\/bookings\?date=/, async (route) => {
      await new Promise((r) => setTimeout(r, 2000))
      await route.continue()
    })
    const { pren } = await fillBookingSteps(page, 'prima-visita-titolo', new Mailbox('late').address, false, 1, true)
    for (let i = 0; i < monthsAhead; i++) await page.locator('span.capitalize.font-bold + button').click()
    const proceed = page.getByRole('button', { name: pren.step3['continua-pagamento'], exact: true }).last()
    const availability = page.waitForResponse((r) => /\/api\/bookings\?date=/.test(r.url()), { timeout: 15_000 })
    await page.locator('button.rounded-full:not([disabled])').filter({ hasText: new RegExp(`^${Number(date.slice(8))}$`) }).click()

    // Prima della risposta l'orario occupato sembra libero: lo si sceglie, e il pulsante si abilita
    const slot = page.getByRole('button', { name: '10:00', exact: true })
    await slot.click()
    expect(await proceed.isEnabled(), 'prima della risposta il pulsante dovrebbe essere abilitato')

    // Con la disponibilità l'orario risulta occupato: la scelta decade e non si può proseguire
    await availability
    await page.waitForFunction(() => [...document.querySelectorAll('button')].some((b) => b.textContent === '10:00' && b.disabled), undefined, { timeout: 5000 })
    expect(!(await proceed.isEnabled()), 'dopo la risposta il pulsante deve disabilitarsi: orario occupato ancora selezionato')
  })
})

test('browser: banner cookie (rifiuto ricordato, accetta tutti)', async () => {
  const messages = JSON.parse(readFileSync('messages/en.json', 'utf8')).cookie
  await withPage(async (page) => {
    await page.goto(`${BASE_URL}/en`)
    const reject = page.getByRole('button', { name: messages.rifiuta })
    await reject.waitFor({ timeout: 10_000 })
    await reject.click()
    expect(await reject.count() === 0, 'il banner è ancora visibile dopo il rifiuto')
    const stored = await page.evaluate(() => localStorage.getItem('cookieConsent'))
    expect(JSON.parse(stored ?? '{}').analytics === false, `consenso salvato: ${stored}`)
    await page.reload()
    await page.waitForTimeout(2000)
    expect(await page.getByRole('button', { name: messages.rifiuta }).count() === 0, 'il banner riappare dopo il ricaricamento')

    await page.evaluate(() => localStorage.removeItem('cookieConsent'))
    await page.reload()
    await page.getByRole('button', { name: messages.accetta }).click()
    const accepted = await page.evaluate(() => localStorage.getItem('cookieConsent'))
    expect(JSON.parse(accepted ?? '{}').marketing === true, `consenso salvato: ${accepted}`)
  })
})

test('browser: selettore paese e prefisso telefonico', async () => {
  const messages = JSON.parse(readFileSync('messages/en.json', 'utf8'))
  const pren = messages.prenota
  await withPage(async (page) => {
    await page.goto(`${BASE_URL}/en/booking`)
    await rejectCookies(page, messages.cookie.rifiuta)
    await page.getByRole('button', { name: new RegExp(pren.servizi['colloquio-gratuito-titolo']) }).first().click()
    await page.getByRole('button', { name: pren.step1.continua, exact: true }).last().click()
    await page.getByText(pren.step2.titolo).first().waitFor({ timeout: 15_000 })

    const [prefix, country] = await page.getByRole('combobox').all()
    await country.click()
    await page.keyboard.type('Germ')
    await page.getByRole('option', { name: /Germany/ }).first().click()
    expect((await country.innerText()).includes('Germany'), `paese selezionato: "${await country.innerText()}"`)
    expect(await page.getByRole('listbox').count() === 0, 'elenco paesi ancora aperto dopo la scelta')

    await prefix.click()
    await page.keyboard.type('Aust')
    await page.getByRole('option', { name: /Austria/ }).first().click()
    expect((await prefix.innerText()).includes('+43'), `prefisso selezionato: "${await prefix.innerText()}"`)
  })
})

test('browser: chat assistente (messaggio proattivo e risposta)', async () => {
  const messages = JSON.parse(readFileSync('messages/en.json', 'utf8'))
  await withPage(async (page) => {
    await page.goto(`${BASE_URL}/en`)
    await rejectCookies(page, messages.cookie.rifiuta)
    await page.getByRole('button', { name: 'Open chat assistant' }).click()
    const input = page.getByPlaceholder('Write a message...')
    await input.waitFor({ timeout: 10_000 })
    await page.waitForTimeout(1500) // messaggio proattivo dopo 400ms
    const before = (await page.innerText('body')).length
    await input.fill('prices')
    await page.getByRole('button', { name: 'Send message' }).click()
    // risposta del bot: oltre al messaggio dell'utente il testo deve crescere di una risposta intera
    await page.waitForFunction((n) => document.body.innerText.length > n + 60, before, { timeout: 10_000 })
    expect((await page.innerText('body')).includes('prices'), 'messaggio utente non mostrato')
  })
})

// ---------- Azioni admin ----------

const ADMIN = ['ADMIN_EMAIL', 'ADMIN_PASSWORD']

mailTest('admin: segna pagato -> conferma, sposta -> email (en, prima visita)', async () => {
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

mailTest('admin: completa sessione -> follow-up (it, percorso 3 mesi)', async () => {
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

mailTest('cron: promemoria a 3 giorni (en)', async () => {
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

mailTest('webhook Stripe: pagamento completato (de) -> email di conferma', async () => {
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
  const selected = tests.filter((t) => (!only || t.name.includes(only)) && !(NO_MAIL && t.mail))
  const withheld = tests.filter((t) => (!only || t.name.includes(only)) && NO_MAIL && t.mail).length

  console.log(`E2E su ${BASE_URL} (${selected.length} test${NO_MAIL ? `, senza email: ${withheld} test di consegna saltati` : ''})\n`)
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
      if (err instanceof SkipTest) {
        skipped++
        console.log(`- SKIP  ${t.name}  (${err.message})`)
        continue
      }
      failed++
      console.log(`✗ FAIL  ${t.name}\n        ${err instanceof Error ? err.message : err}`)
    }
  }
  console.log(`\n${passed} passati, ${failed} falliti, ${skipped} saltati`)
  process.exitCode = failed ? 1 : 0
}

void main()

