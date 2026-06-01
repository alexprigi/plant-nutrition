import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/admin/subscriptions/[id]/cancel/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const mockPrisma = vi.mocked(prisma)
const mockAuth = vi.mocked(auth)

const makeRequest = () =>
  new NextRequest('http://localhost/api/admin/subscriptions/sub_1/cancel', { method: 'POST' })

const makeParams = () => ({ params: Promise.resolve({ id: 'sub_1' }) })

describe('POST /api/admin/subscriptions/[id]/cancel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { name: 'Arianna' } } as any)
  })

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await POST(makeRequest(), makeParams())
    expect(res.status).toBe(401)
  })

  it('returns 404 when subscription not found', async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue(null)
    const res = await POST(makeRequest(), makeParams())
    expect(res.status).toBe(404)
  })

  it('cancels all pending and confirmed appointments', async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue({
      id: 'sub_1',
      appointments: [
        { id: 'appt_1', status: 'CONFIRMED' },
        { id: 'appt_2', status: 'PENDING' },
        { id: 'appt_3', status: 'COMPLETED' },
      ],
    } as any)
    mockPrisma.appointment.updateMany.mockResolvedValue({ count: 2 } as any)
    mockPrisma.subscription.update.mockResolvedValue({} as any)

    const res = await POST(makeRequest(), makeParams())
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockPrisma.appointment.updateMany).toHaveBeenCalledWith({
      where: {
        subscriptionId: 'sub_1',
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      data: { status: 'CANCELLED' },
    })
  })

  it('marks subscription as CANCELLED', async () => {
    mockPrisma.subscription.findUnique.mockResolvedValue({
      id: 'sub_1',
      appointments: [],
    } as any)
    mockPrisma.appointment.updateMany.mockResolvedValue({ count: 0 } as any)
    mockPrisma.subscription.update.mockResolvedValue({} as any)

    await POST(makeRequest(), makeParams())

    expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
      where: { id: 'sub_1' },
      data: { status: 'CANCELLED' },
    })
  })
})
