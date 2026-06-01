import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/follow-up/route'
import { prisma } from '@/lib/prisma'

const mockPrisma = vi.mocked(prisma)

const makeRequest = (token?: string) =>
  new NextRequest(`http://localhost/api/follow-up${token ? `?token=${token}` : ''}`)

const baseSubscription = (overrides = {}) => ({
  id: 'sub_1',
  type: 'BUNDLE_3_MONTHS',
  status: 'ACTIVE',
  totalSessions: 3,
  usedSessions: 1,
  expiresAt: null,
  followUpToken: 'valid-token',
  client: {
    name: 'Mario',
    surname: 'Rossi',
    email: 'mario@test.com',
    phone: '+39 333 1234567',
    address: 'Via Roma',
    civicNumber: '1',
    city: 'Milano',
    zipCode: '20100',
    country: 'Italia',
    fiscalCode: 'RSSMRA80A01F205X',
  },
  ...overrides,
})

describe('GET /api/follow-up', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 400 when token is missing', async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(400)
  })

  it('returns 404 when token is invalid', async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue(null)
    const res = await GET(makeRequest('invalid-token'))
    expect(res.status).toBe(404)
  })

  it('returns 410 when subscription is not ACTIVE', async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue(
      baseSubscription({ status: 'EXHAUSTED' }) as any
    )
    const res = await GET(makeRequest('valid-token'))
    expect(res.status).toBe(410)
    const data = await res.json()
    expect(data.error).toContain('attivo')
  })

  it('returns 410 when subscription is expired', async () => {
    const pastDate = new Date()
    pastDate.setMonth(pastDate.getMonth() - 1)
    mockPrisma.subscription.findUnique.mockResolvedValue(
      baseSubscription({ expiresAt: pastDate }) as any
    )
    const res = await GET(makeRequest('valid-token'))
    expect(res.status).toBe(410)
    const data = await res.json()
    expect(data.error).toContain('scadute')
  })

  it('returns 410 when all sessions are used', async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue(
      baseSubscription({ totalSessions: 3, usedSessions: 3 }) as any
    )
    const res = await GET(makeRequest('valid-token'))
    expect(res.status).toBe(410)
    const data = await res.json()
    expect(data.error).toContain('sessioni')
  })

  it('returns valid data with sessions remaining', async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue(
      baseSubscription() as any
    )
    const res = await GET(makeRequest('valid-token'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.valid).toBe(true)
    expect(data.sessionsRemaining).toBe(2)
    expect(data.subscriptionId).toBe('sub_1')
    expect(data.client.email).toBe('mario@test.com')
  })

  it('returns correct serviceType for bundle', async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue(
      baseSubscription({ type: 'BUNDLE_6_MONTHS' }) as any
    )
    const res = await GET(makeRequest('valid-token'))
    const data = await res.json()
    expect(data.serviceType).toBe('follow-up')
  })

  it('does not expire when expiresAt is in the future', async () => {
    const futureDate = new Date()
    futureDate.setMonth(futureDate.getMonth() + 3)
    mockPrisma.subscription.findUnique.mockResolvedValue(
      baseSubscription({ expiresAt: futureDate }) as any
    )
    const res = await GET(makeRequest('valid-token'))
    expect(res.status).toBe(200)
  })
})
