import { describe, it, expect } from 'vitest'
import { getEmailLocale, getT, formatEmailDate } from '@/lib/email-templates/email-i18n'
import { getSubscriptionLabel } from '@/lib/bookingService'
import { getClientConfirmationEmailHTML } from '@/lib/email-templates/client-confirmation'
import { getReminderEmailHTML, getExpiredBankTransferEmailText } from '@/lib/email-templates/cron-emails'
import { getFollowUpEmailHTML, getFollowUpEmailText } from '@/lib/email-templates/follow-up'

const LOCALES = ['it', 'de', 'en'] as const

describe('getEmailLocale', () => {
  it.each(LOCALES)('accepts %s', (l) => expect(getEmailLocale(l)).toBe(l))

  it.each([undefined, null, '', 'fr', 'DE'])('falls back to de for %s', (l) => {
    expect(getEmailLocale(l as any)).toBe('de')
  })
})

describe('translation tables', () => {
  it('have the same keys in every locale', () => {
    const keys = (l: string) => Object.keys(getT(l)).sort()
    expect(keys('de')).toEqual(keys('it'))
    expect(keys('de')).toEqual(keys('en'))
  })

  it('have the same value kind and array length in every locale', () => {
    const de = getT('de') as Record<string, unknown>
    for (const l of ['it', 'en']) {
      const other = getT(l) as Record<string, unknown>
      for (const k of Object.keys(de)) {
        expect(typeof other[k], `${l}.${k}`).toBe(typeof de[k])
        if (Array.isArray(de[k])) expect((other[k] as unknown[]).length, `${l}.${k}`).toBe((de[k] as unknown[]).length)
      }
    }
  })

  it('have no empty strings', () => {
    for (const l of LOCALES) {
      for (const [k, v] of Object.entries(getT(l))) {
        if (typeof v === 'string') expect(v.trim(), `${l}.${k}`).not.toBe('')
      }
    }
  })
})

describe('formatEmailDate', () => {
  it('formats the date in the target language', () => {
    expect(formatEmailDate('2026-06-15', 'it')).toContain('giugno')
    expect(formatEmailDate('2026-06-15', 'de')).toContain('Juni')
    expect(formatEmailDate('2026-06-15', 'en')).toContain('June')
  })
})

describe('getSubscriptionLabel', () => {
  it('translates every subscription type', () => {
    expect(getSubscriptionLabel('bundle-3-months', 'it')).toBe('Percorso 3 Mesi')
    expect(getSubscriptionLabel('bundle-3-months', 'de')).toBe('3-Monats-Programm')
    expect(getSubscriptionLabel('bundle-3-months', 'en')).toBe('3-Month Program')
    expect(getSubscriptionLabel('free-consultation', 'en')).toBe('Free Consultation')
    expect(getSubscriptionLabel('bundle-6-months', 'de')).toBe('6-Monats-VIP-Programm')
  })

  it('falls back to de without locale', () => {
    expect(getSubscriptionLabel('single-session')).toBe(getSubscriptionLabel('single-session', 'de'))
  })
})

describe('email templates', () => {
  const client = {
    clientName: 'Mario Rossi', serviceName: 'X', price: 85, date: '2026-06-15', time: '10:00',
    isFree: false, isBankTransfer: false,
  }

  it.each(LOCALES)('client confirmation uses %s strings and lang attribute', (l) => {
    const html = getClientConfirmationEmailHTML({ ...client, locale: l })
    expect(html).toContain(`<html lang="${l}">`)
    expect(html).toContain(getT(l).confirmed)
  })

  it('client confirmation defaults to de', () => {
    expect(getClientConfirmationEmailHTML(client)).toContain(getT('de').confirmed)
  })

  it('reminder is localized', () => {
    const base = { clientName: 'Mario', serviceName: 'X', date: '2026-06-15', time: '10:00', isFree: false }
    expect(getReminderEmailHTML({ ...base, locale: 'en' } as any)).toContain('<html lang="en">')
    expect(getReminderEmailHTML({ ...base, locale: 'it' } as any)).toContain('<html lang="it">')
  })

  it('expired bank transfer text is localized', () => {
    const text = getExpiredBankTransferEmailText({
      clientName: 'Mario', serviceName: 'X', date: '2026-06-15', time: '10:00', locale: 'en',
    } as any)
    expect(text).toContain('72 hours')
  })

  describe('follow-up', () => {
    const data = { clientName: 'Mario', serviceName: 'Svc', sessionsRemaining: 2, followUpToken: 'tok' }

    it.each(LOCALES)('HTML and text use %s strings and a localized link', (l) => {
      const t = getT(l)
      const html = getFollowUpEmailHTML({ ...data, locale: l })
      const text = getFollowUpEmailText({ ...data, locale: l })
      expect(html).toContain(`<html lang="${l}">`)
      expect(html).toContain(t.fuCta)
      expect(html).toContain(`/${l}/booking/follow-up/tok`)
      expect(text).toContain(t.fuPersonalLink)
      expect(text).toContain(`/${l}/booking/follow-up/tok`)
    })

    it('handles singular and plural session counts', () => {
      expect(getT('en').fuSubject(1)).toContain('1 session remaining')
      expect(getT('en').fuSubject(2)).toContain('2 sessions remaining')
      expect(getT('it').fuSubject(1)).toContain('1 sessione rimasta')
      expect(getT('it').fuSubject(3)).toContain('3 sessioni rimaste')
    })
  })
})
