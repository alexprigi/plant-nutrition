import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReactElement } from 'react'

const headerValue = vi.hoisted(() => ({ locale: null as string | null }))

vi.mock('next/headers', () => ({
  headers: async () => ({ get: (name: string) => (name === 'x-next-intl-locale' ? headerValue.locale : null) }),
}))
vi.mock('next/font/google', () => ({ Nunito: () => ({ variable: 'font-nunito' }) }))
vi.mock('@/app/globals.css', () => ({}))
vi.mock('@/components/Providers', () => ({ default: () => null }))

import RootLayout from '@/app/layout'

const langOf = async () => {
  const html = (await RootLayout({ children: null })) as ReactElement<{ lang: string }>
  return html.props.lang
}

// <html lang> deve seguire la lingua della pagina: lo usano screen reader, motori di ricerca e traduttori del browser
describe('RootLayout <html lang>', () => {
  beforeEach(() => { headerValue.locale = null })

  it.each(['it', 'de', 'en'])('uses the locale set by next-intl (%s)', async (locale) => {
    headerValue.locale = locale
    expect(await langOf()).toBe(locale)
  })

  it('falls back to Italian for pages without a locale (admin, previews)', async () => {
    expect(await langOf()).toBe('it')
  })

  it('ignores unsupported values', async () => {
    headerValue.locale = 'fr'
    expect(await langOf()).toBe('it')
  })
})
