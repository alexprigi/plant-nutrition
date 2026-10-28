import { describe, it, expect, vi, beforeEach } from 'vitest'

const captured = vi.hoisted(() => ({ config: undefined as any, credentialsOpts: undefined as any }))

vi.mock('next-auth', () => ({
  default: vi.fn((config: unknown) => {
    captured.config = config
    return { handlers: { GET: vi.fn(), POST: vi.fn() }, auth: vi.fn(), signIn: vi.fn(), signOut: vi.fn() }
  }),
}))
vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((opts: unknown) => {
    captured.credentialsOpts = opts
    return { id: 'credentials' }
  }),
}))
vi.mock('bcryptjs', () => ({ default: { compare: vi.fn() } }))
vi.unmock('@/lib/auth')

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const mockPrisma = vi.mocked(prisma, { deep: true })
const mockCompare = vi.mocked(bcrypt.compare) as unknown as ReturnType<typeof vi.fn>

describe('lib/auth', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await import('@/lib/auth')
  })

  const authorize = (c: any) => captured.credentialsOpts.authorize(c)

  it('exposes handlers and config', async () => {
    const mod = await import('@/lib/auth')
    expect(mod.handlers.GET).toBeDefined()
    expect(captured.config.pages.signIn).toBe('/admin/login')
  })

  it('authorize returns null for missing credentials', async () => {
    expect(await authorize(undefined)).toBeNull()
    expect(await authorize({ email: 'a@t.com' })).toBeNull()
    expect(await authorize({ password: 'x' })).toBeNull()
  })

  it('authorize returns null when user missing', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)
    expect(await authorize({ email: 'a@t.com', password: 'x' })).toBeNull()
  })

  it('authorize returns null on wrong password', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: 'a@t.com', password: 'h', name: 'A', role: 'ADMIN' } as any)
    mockCompare.mockResolvedValue(false)
    expect(await authorize({ email: 'a@t.com', password: 'x' })).toBeNull()
  })

  it('authorize returns user on success', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: 'a@t.com', password: 'h', name: 'A', role: 'ADMIN' } as any)
    mockCompare.mockResolvedValue(true)
    expect(await authorize({ email: 'a@t.com', password: 'x' })).toEqual({
      id: '1', email: 'a@t.com', name: 'A', role: 'ADMIN',
    })
  })

  it('jwt callback copies role only when user present', () => {
    const { jwt } = captured.config.callbacks
    expect(jwt({ token: {}, user: { role: 'ADMIN' } }).role).toBe('ADMIN')
    expect(jwt({ token: { a: 1 } }).role).toBeUndefined()
  })

  it('session callback sets role only when session.user exists', () => {
    const { session } = captured.config.callbacks
    expect(session({ session: { user: {} }, token: { role: 'ADMIN' } }).user.role).toBe('ADMIN')
    expect(session({ session: {}, token: { role: 'ADMIN' } })).toEqual({})
  })
})
