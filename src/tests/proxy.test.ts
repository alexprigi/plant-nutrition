import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

// next-intl non si carica sotto vitest e qui si testano solo i nostri reindirizzamenti
const intl = vi.hoisted(() => vi.fn())
vi.mock('next-intl/middleware', () => ({ default: () => intl }))

import middleware from '@/proxy'

const run = (path: string) => middleware(new NextRequest(`http://localhost${path}`))

describe('proxy', () => {
  beforeEach(() => intl.mockReset())

  it('does not redirect the manage page', () => {
    intl.mockReturnValue(NextResponse.next())
    run('/en/manage/abc123')
    expect(intl).toHaveBeenCalledTimes(1)
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
