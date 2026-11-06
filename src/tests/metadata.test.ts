import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'fs'
import { LOCALES } from '@/i18n/locales'

const getTranslations = vi.hoisted(() => vi.fn())
vi.mock('next-intl/server', () => ({ getTranslations }))

import { alternatesFor, localizedMetadata } from '@/lib/metadata'

describe('localizedMetadata', () => {
  beforeEach(() => {
    getTranslations.mockReset()
    getTranslations.mockResolvedValue((key: string) => `tradotto:${key}`)
  })

  it('reads title and description for the request locale and namespace', async () => {
    const meta = await localizedMetadata(Promise.resolve({ locale: 'de' }), 'prenota')
    expect(getTranslations).toHaveBeenCalledWith({ locale: 'de', namespace: 'prenota' })
    expect(meta).toEqual({ title: 'tradotto:meta-titolo', description: 'tradotto:meta-descrizione' })
  })

  it('adds canonical and hreflang alternates only when a path is given', async () => {
    const meta = await localizedMetadata(Promise.resolve({ locale: 'de' }), 'chi-sono', {}, '/about')
    expect(meta.alternates?.canonical).toMatch(/\/de\/about$/)
    const languages = meta.alternates?.languages as Record<string, string>
    expect(Object.keys(languages).sort()).toEqual(['de', 'en', 'it', 'x-default'])
    expect(languages.en).toMatch(/\/en\/about$/)
    expect(languages['x-default']).toMatch(/\/de\/about$/)
    expect((await localizedMetadata(Promise.resolve({ locale: 'de' }), 'sito')).alternates).toBeUndefined()
  })

  it('uses the bare locale as the address of the home page', () => {
    expect(alternatesFor('it', '').canonical).toMatch(/\/it$/)
  })

  it('merges extra metadata such as robots', async () => {
    const meta = await localizedMetadata(Promise.resolve({ locale: 'en' }), 'gestisci', { robots: { index: false } })
    expect(meta.robots).toEqual({ index: false })
    expect(meta.title).toBe('tradotto:meta-titolo')
  })
})

// Namespace usati da localizedMetadata nelle pagine: ognuno deve avere titolo e descrizione in ogni lingua
describe('page metadata in the message files', () => {
  const NAMESPACES = ['sito', 'chi-sono', 'contatti', 'prenota', 'cookie-policy', 'gestisci', 'servizi', 'privacy-policy', 'policy-cancellazione']

  it.each(LOCALES)('%s has a title and a description for every page', (locale) => {
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'))
    for (const ns of NAMESPACES) {
      expect(typeof messages[ns]?.['meta-titolo'], `${locale}.${ns}.meta-titolo`).toBe('string')
      expect(typeof messages[ns]?.['meta-descrizione'], `${locale}.${ns}.meta-descrizione`).toBe('string')
    }
  })

  it('does not reuse the Italian title in the other languages', () => {
    const titles = (l: string) => {
      const m = JSON.parse(readFileSync(`messages/${l}.json`, 'utf8'))
      // 'Cookie Policy' si scrive uguale in italiano e in inglese
      return ['sito', 'chi-sono', 'contatti', 'prenota', 'gestisci'].map((ns) => m[ns]['meta-titolo'])
    }
    for (const l of ['de', 'en']) {
      titles(l).forEach((t, i) => expect(t, `${l} #${i}`).not.toBe(titles('it')[i]))
    }
  })
})
