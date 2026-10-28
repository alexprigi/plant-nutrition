import { describe, it, expect, afterEach } from 'vitest'
import {
  getClientConfirmationEmailHTML,
  getClientConfirmationEmailText,
} from '@/lib/email-templates/client-confirmation'
import {
  getReminderEmailHTML,
  getReminderEmailText,
  getExpiredBankTransferEmailHTML,
  getExpiredBankTransferEmailText,
} from '@/lib/email-templates/cron-emails'
import {
  getAdminCancellationEmailHTML,
  getAdminRescheduleEmailHTML,
  getClientCancellationEmailHTML,
  getClientCancellationEmailText,
  getAdminNotificationEmailHTML,
  getAdminNotificationEmailText,
  getAdminExpiredBankTransferEmailHTML,
  getAdminExpiredBankTransferEmailText,
} from '@/lib/email-templates/admin-notification'
import { getT, getEmailLocale } from '@/lib/email-templates/email-i18n'
import { COUNTRIES, COUNTRY_FLAGS, COUNTRY_PREFIXES } from '@/lib/constants'

const LOCALES = [undefined, 'it', 'de', 'en'] as const
const BOOL = [true, false] as const
const OPT = [true, false, undefined] as const

afterEach(() => {
  delete process.env.AUTH_URL
})

describe('constants', () => {
  it('exports non-empty lists', () => {
    expect(COUNTRIES.length).toBeGreaterThan(100)
    expect(Object.keys(COUNTRY_FLAGS).length).toBeGreaterThan(100)
    expect(COUNTRY_PREFIXES.length).toBeGreaterThan(0)
  })
})

describe('email-i18n', () => {
  it('invokes every function-valued string in every locale', () => {
    for (const l of ['it', 'de', 'en']) {
      const t = getT(l) as Record<string, unknown>
      for (const v of Object.values(t)) {
        if (typeof v === 'function') {
          for (const n of [0, 1, 2]) {
            expect(typeof (v as any)(n === 0 ? 'a' : n, n === 1 ? 'b' : 'c', 'd', 'e')).toBe('string')
          }
          expect(typeof (v as any)('a', 'b', 'c', 'd')).toBe('string')
        }
      }
    }
    expect(getEmailLocale(null)).toBe('de')
    expect(getT(null)).toBe(getT('de'))
  })
})

describe('client-confirmation', () => {
  it('renders every flag combination', () => {
    for (const locale of LOCALES) for (const isTest of BOOL) for (const isFree of BOOL)
      for (const isBankTransfer of BOOL) for (const notes of [undefined, 'Note']) for (const token of [undefined, 'tok'])
        for (const url of [undefined, 'http://x']) {
          if (url) process.env.AUTH_URL = url; else delete process.env.AUTH_URL
          const d = { clientName: 'M', serviceName: 'S', price: 85, date: '2026-06-15', time: '10:00',
            isFree, isBankTransfer, isTest, notes, managementToken: token, locale }
          const html = getClientConfirmationEmailHTML(d)
          const text = getClientConfirmationEmailText(d)
          expect(html).toContain('M')
          expect(text).toContain('M')
          if (token) expect(text).toContain(`/gestisci/tok`)
          if (notes) expect(html).toContain('Note')
        }
  })
})

describe('client-confirmation follow-up', () => {
  const base = { clientName: 'M', serviceName: 'S', price: 0, date: '2026-06-15', time: '10:00', isFree: true, isBankTransfer: false }

  it.each(['it', 'de', 'en'])('uses the follow-up body instead of the free consultation body (%s)', (locale) => {
    const t = getT(locale)
    const html = getClientConfirmationEmailHTML({ ...base, isFollowUp: true, locale })
    const text = getClientConfirmationEmailText({ ...base, isFollowUp: true, locale })
    expect(html).toContain(t.bodyFollowUp)
    expect(html).not.toContain(t.bodyFree)
    expect(text).toContain(t.bodyFollowUp)
    expect(text).not.toContain(t.bodyFree)
  })

  it('still uses the free consultation body without the flag', () => {
    expect(getClientConfirmationEmailText({ ...base, locale: 'en' })).toContain(getT('en').bodyFree)
  })
})

describe('cron-emails', () => {
  it('renders reminder in every combination', () => {
    for (const locale of LOCALES) for (const isTest of BOOL) for (const isFree of OPT)
      for (const token of [undefined, 'tok']) for (const url of [undefined, 'http://x']) {
        if (url) process.env.AUTH_URL = url; else delete process.env.AUTH_URL
        const d = { clientName: 'M', serviceName: 'S', date: '2026-06-15', time: '10:00', isFree, isTest, managementToken: token, locale }
        const html = getReminderEmailHTML(d)
        const text = getReminderEmailText(d)
        if (token) { expect(html).toContain('/gestisci/tok'); expect(text).toContain('/gestisci/tok') }
        else expect(text).not.toContain('/gestisci/')
      }
  })

  it('renders expired bank transfer in every combination', () => {
    for (const locale of LOCALES) for (const isTest of OPT) for (const url of [undefined, 'http://x']) {
      if (url) process.env.AUTH_URL = url; else delete process.env.AUTH_URL
      const d = { clientName: 'M', serviceName: 'S', date: '2026-06-15', time: '10:00', isTest, locale }
      expect(getExpiredBankTransferEmailHTML(d)).toContain('M')
      expect(getExpiredBankTransferEmailText(d)).toContain('M')
    }
  })
})

describe('admin-notification', () => {
  it('renders admin cancellation', () => {
    for (const isRefundable of OPT) for (const isTest of OPT) for (const clientPhone of [undefined, '+39 1']) {
      const html = getAdminCancellationEmailHTML({ clientName: 'M', clientEmail: 'm@t.com', clientPhone, date: '2026-06-15', time: '10:00', isRefundable, isTest })
      expect(html).toContain('m@t.com')
      expect(html.includes('tel:+39 1')).toBe(!!clientPhone)
    }
  })

  it('renders admin reschedule', () => {
    for (const isTest of OPT) for (const clientPhone of [undefined, '+39 1']) {
      const html = getAdminRescheduleEmailHTML({ clientName: 'M', clientEmail: 'm@t.com', clientPhone, oldDate: '2026-06-15', oldTime: '10:00', newDate: '2026-06-16', newTime: '11:00', isTest })
      expect(html.includes('tel:+39 1')).toBe(!!clientPhone)
    }
  })

  it('renders client cancellation (html + text)', () => {
    for (const locale of LOCALES) for (const isRefundable of OPT) for (const isTest of OPT) {
      const d = { clientName: 'M', date: '2026-06-15', time: '10:00', isRefundable, isTest, locale }
      expect(getClientCancellationEmailHTML(d)).toContain('10:00')
      expect(getClientCancellationEmailText(d)).toContain('10:00')
    }
  })

  it('renders admin notification (html + text)', () => {
    for (const isPaid of BOOL) for (const price of [0, 85]) for (const notes of [undefined, 'Note']) for (const isTest of OPT) {
      const d = { clientName: 'M', clientEmail: 'm@t.com', clientPhone: '+39', serviceName: 'S', price, date: '2026-06-15', time: '10:00', notes, paymentMethod: 'PayPal', isPaid, isTest }
      const html = getAdminNotificationEmailHTML(d)
      const text = getAdminNotificationEmailText(d)
      expect(html.includes('ancora in sospeso')).toBe(!isPaid && price > 0)
      expect(text.includes('ATTENZIONE')).toBe(!isPaid && price > 0)
      expect(text.includes('Gratuito')).toBe(price === 0)
      expect(text.includes('Note del cliente')).toBe(!!notes)
    }
  })

  it('renders admin expired bank transfer (html + text)', () => {
    for (const clientPhone of [undefined, '+39 1']) for (const isTest of OPT) {
      const d = { clientName: 'M', clientEmail: 'm@t.com', clientPhone, serviceName: 'S', date: '2026-06-15', time: '10:00', isTest }
      expect(getAdminExpiredBankTransferEmailHTML(d).includes('tel:+39 1')).toBe(!!clientPhone)
      expect(getAdminExpiredBankTransferEmailText(d).includes('Telefono')).toBe(!!clientPhone)
    }
  })
})
