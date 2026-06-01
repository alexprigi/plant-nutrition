import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/cron/reminders/route'
import { prisma } from '@/lib/prisma'

const mockPrisma = vi.mocked(prisma)

// Mock resend
vi.mock('@/lib/email', () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: 'email_1' } }),
    },
  },
}))

const makeRequest = (secret = 'test-secret') =>
  new NextRequest('http://localhost/api/cron/reminders', {
    headers: { authorization: `Bearer ${secret}` },
  })

function dateInDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

const baseAppointment = (overrides = {}) => ({
  id: 'appt_1',
  date: dateInDays(3),
  time: '10:00',
  status: 'CONFIRMED',
  managementToken: 'token_1',
  client: { name: 'Mario', surname: 'Rossi', email: 'mario@test.com' },
  subscription: { type: 'SINGLE_SESSION', price: 85, isPaid: true, usedSessions: 0, totalSessions: 1 },
  ...overrides,
})

describe('GET /api/cron/reminders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('CRON_SECRET', 'test-secret')
    vi.stubEnv('AUTH_URL', 'http://localhost:3000')
  })

  it('returns 401 with invalid secret', async () => {
    const res = await GET(makeRequest('wrong-secret'))
    expect(res.status).toBe(401)
  })

  it('returns 401 with missing authorization header', async () => {
    const res = await GET(new NextRequest('http://localhost/api/cron/reminders'))
    expect(res.status).toBe(401)
  })

  it('sends reminder emails for appointments in 3 days', async () => {
    const { resend } = await import('@/lib/email')
    const mockSend = vi.mocked(resend.emails.send)

    mockPrisma.appointment.findMany
      .mockResolvedValueOnce([baseAppointment() as any]) // reminders
      .mockResolvedValueOnce([]) // expired

    mockPrisma.subscription.updateMany.mockResolvedValue({ count: 0 } as any)

    const res = await GET(makeRequest())
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.reminders).toBe(1)
    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'mario@test.com' })
    )
  })

  it('cancels expired PENDING appointments (>72h)', async () => {
    mockPrisma.appointment.findMany
      .mockResolvedValueOnce([]) // no reminders
      .mockResolvedValueOnce([baseAppointment({ status: 'PENDING' }) as any]) // expired

    mockPrisma.appointment.update.mockResolvedValue({} as any)
    mockPrisma.subscription.updateMany.mockResolvedValue({ count: 0 } as any)

    const { resend } = await import('@/lib/email')
    const mockSend = vi.mocked(resend.emails.send)

    const res = await GET(makeRequest())
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.expired).toBe(1)
    expect(mockPrisma.appointment.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'CANCELLED' } })
    )
    // 2 email: cliente + arianna
    expect(mockSend).toHaveBeenCalledTimes(2)
  })

  it('marks expired subscriptions as EXHAUSTED', async () => {
    mockPrisma.appointment.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])

    mockPrisma.subscription.updateMany.mockResolvedValue({ count: 2 } as any)

    const res = await GET(makeRequest())
    expect(res.status).toBe(200)
    expect(mockPrisma.subscription.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: 'EXHAUSTED' },
      })
    )
  })

  it('returns correct counts', async () => {
    mockPrisma.appointment.findMany
      .mockResolvedValueOnce([baseAppointment() as any, baseAppointment({ id: 'appt_2' }) as any])
      .mockResolvedValueOnce([])

    mockPrisma.subscription.updateMany.mockResolvedValue({ count: 0 } as any)

    const res = await GET(makeRequest())
    const data = await res.json()

    expect(data.reminders).toBe(2)
    expect(data.expired).toBe(0)
    expect(data.errors).toBe(0)
  })
})
