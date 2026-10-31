import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LOCALE } from '@/i18n/locales'

// next-intl non si carica sotto vitest e qui si testano solo i nostri reindirizzamenti
const intl = vi.hoisted(() => vi.fn())
vi.mock('next-intl/middleware', () => ({ default: () => intl }))

import middleware from '@/proxy'

const run = (path: string) => middleware(new NextRequest(`http://localhost${path}`))

describe('proxy', () => {
  beforeEach(() => intl.mockReset())

  // I link nelle email inviate prima dell'aggiunta della lingua non hanno il prefisso /{locale}
  describe('legacy management links', () => {
    it('redirects /gestisci/<token> to the default locale with ?auto=1', () => {
      const res = run('/gestisci/abc123')
      expect(res.status).toBe(307)
      const location = new URL(res.headers.get('location')!)
      expect(location.pathname).toBe(`/${DEFAULT_LOCALE}/gestisci/abc123`)
      expect(location.searchParams.get('auto')).toBe('1')
    })

    it('accepts a trailing slash', () => {
      expect(new URL(run('/gestisci/abc123/').headers.get('location')!).pathname.replace(/\/$/, '')).toBe(`/${DEFAULT_LOCALE}/gestisci/abc123`)
    })

    it('does not touch links that already have a locale', () => {
      intl.mockReturnValue(NextResponse.next())
      run('/en/gestisci/abc123')
      expect(intl).toHaveBeenCalledTimes(1)
    })
  })

  it('redirects renamed Italian paths permanently', () => {
    const res = run('/en/prenota')
    expect(res.status).toBe(301)
    expect(new URL(res.headers.get('location')!).pathname).toBe('/en/booking')
  })

  it('keeps the rest of the path when renaming', () => {
    expect(new URL(run('/it/servizi/abc').headers.get('location')!).pathname).toBe('/it/services/abc')
  })

  it('hands everything else to next-intl', () => {
    const passthrough = NextResponse.next()
    intl.mockReturnValue(passthrough)
    expect(run('/en/booking')).toBe(passthrough)
    expect(intl).toHaveBeenCalledTimes(1)
  })
})
