import { describe, it, expect, afterEach, vi } from 'vitest'
import sitemap from '@/app/sitemap'
import { LOCALES, DEFAULT_LOCALE } from '@/i18n/locales'
import { PUBLIC_PATHS, SITE_URL } from '@/lib/site'

describe('sitemap', () => {
  const entries = sitemap()

  it('lists every public page once per language', () => {
    expect(entries).toHaveLength(PUBLIC_PATHS.length * LOCALES.length)
    for (const locale of LOCALES) expect(entries.map((e) => e.url)).toContain(`${SITE_URL}/${locale}/about`)
  })

  it('links every page to all its language versions and to x-default', () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages as Record<string, string>
      expect(Object.keys(languages).sort()).toEqual([...LOCALES, 'x-default'].sort())
      expect(languages['x-default']).toContain(`/${DEFAULT_LOCALE}`)
      expect(Object.values(languages)).toContain(entry.url)
    }
  })

  it('leaves out private and unfinished pages', () => {
    const urls = entries.map((e) => e.url).join('\n')
    for (const hidden of ['/manage', '/admin', '/blog', '/recipes']) expect(urls).not.toContain(hidden)
  })
})

describe('robots', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  // Il sito dipende da AUTH_URL letto all'import: si ricarica il modulo per ogni caso
  const load = async (authUrl: string) => {
    vi.resetModules()
    vi.stubEnv('AUTH_URL', authUrl)
    return (await import('@/app/robots')).default()
  }

  it('on the production site blocks the admin area and the API and points to the sitemap', async () => {
    const result = await load('https://www.vivaplantnutrition.com')
    expect(result.rules).toMatchObject({ allow: '/', disallow: ['/admin', '/api/'] })
    expect(result.sitemap).toBe('https://www.vivaplantnutrition.com/sitemap.xml')
  })

  it('keeps preview and local sites out of search engines', async () => {
    expect(await load('https://preview.vivaplantnutrition.com')).toEqual({ rules: { userAgent: '*', disallow: '/' } })
    expect(await load('http://localhost:3000')).toEqual({ rules: { userAgent: '*', disallow: '/' } })
  })
})
