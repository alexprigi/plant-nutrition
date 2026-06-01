import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/appointments/manage/route'
import { prisma } from '@/lib/prisma'

const mockPrisma = vi.mocked(prisma)

// Helper: data relativa a oggi + N giorni
function dateInDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

const makeGetRequest = (token: string) =>
  new NextRequest(`http://localhost/api/appointments/manage?token=${token}`)

const makePostRequest = (body: object) =>
  new NextRequest('http://localhost/api/appointments/manage', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

const baseAppointment = (overrides = {}) => ({
  id: 'appt_1',
  date: dateInDays(10),
  time: '10:00',
  status: 'CONFIRMED',
  notes: '',
  managementToken: 'test-token',
  rescheduleCount: 0,
  rescheduleCountRestricted: 0,
  client: { name: 'Mario', surname: 'Rossi', email: 'mario@test.com' },
  subscription: {
    paymentMethod: 'STRIPE',
    isPaid: true,
    price: 85,
    type: 'SINGLE_SESSION',
  },
  isDeleted: false,
  ...overrides,
})

describe('GET /api/appointments/manage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 400 when token is missing', async () => {
    const res = await GET(new NextRequest('http://localhost/api/appointments/manage'))
    expect(res.status).toBe(400)
  })

  it('returns 404 when appointment not found', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(null)
    const res = await GET(makeGetRequest('invalid-token'))
    expect(res.status).toBe(404)
  })

  it('returns 410 for cancelled appointment', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ status: 'CANCELLED' }) as any
    )
    const res = await GET(makeGetRequest('test-token'))
    expect(res.status).toBe(410)
  })

  it('returns 410 for completed appointment', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ status: 'COMPLETED' }) as any
    )
    const res = await GET(makeGetRequest('test-token'))
    expect(res.status).toBe(410)
  })

  it('returns canReschedule=true for confirmed appointment >24h away', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(10) }) as any
    )
    const res = await GET(makeGetRequest('test-token'))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.canReschedule).toBe(true)
  })

  it('returns canReschedule=false for pending appointment', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ status: 'PENDING', date: dateInDays(10) }) as any
    )
    const res = await GET(makeGetRequest('test-token'))
    const data = await res.json()
    expect(data.canReschedule).toBe(false)
  })

  it('returns canReschedule=false when rescheduleCount >= 3', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(10), rescheduleCount: 3 }) as any
    )
    const res = await GET(makeGetRequest('test-token'))
    const data = await res.json()
    expect(data.canReschedule).toBe(false)
  })

  it('returns canReschedule=false in 2-7 day zone after 1 reschedule', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(4), rescheduleCountRestricted: 1 }) as any
    )
    const res = await GET(makeGetRequest('test-token'))
    const data = await res.json()
    expect(data.canReschedule).toBe(false)
    expect(data.contactRequired).toBe(true)
  })

  it('returns canCancel=true for free appointment', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ subscription: { paymentMethod: 'NONE', isPaid: true, price: 0, type: 'FREE_CONSULTATION' } }) as any
    )
    const res = await GET(makeGetRequest('test-token'))
    const data = await res.json()
    expect(data.canCancel).toBe(true)
  })

  it('returns canCancel=true for paid appointment >7 days away', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(10) }) as any
    )
    const res = await GET(makeGetRequest('test-token'))
    const data = await res.json()
    expect(data.canCancel).toBe(true)
  })

  it('returns canCancel=false for paid appointment 2-7 days away', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(4) }) as any
    )
    const res = await GET(makeGetRequest('test-token'))
    const data = await res.json()
    expect(data.canCancel).toBe(false)
  })
})

describe('POST /api/appointments/manage — cancel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('cancels a pending appointment', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ status: 'PENDING', subscription: { paymentMethod: 'BANK_TRANSFER', isPaid: false, price: 85, type: 'SINGLE_SESSION' } }) as any
    )
    mockPrisma.appointment.update.mockResolvedValue({} as any)

    const res = await POST(makePostRequest({ token: 'test-token', action: 'cancel' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.action).toBe('cancelled')
    expect(mockPrisma.appointment.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'CANCELLED' } })
    )
  })

  it('blocks cancellation for paid appointment within 7 days', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(4) }) as any
    )
    const res = await POST(makePostRequest({ token: 'test-token', action: 'cancel' }))
    expect(res.status).toBe(403)
  })

  it('allows cancellation for paid appointment >7 days', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(10) }) as any
    )
    mockPrisma.appointment.update.mockResolvedValue({} as any)

    const res = await POST(makePostRequest({ token: 'test-token', action: 'cancel' }))
    expect(res.status).toBe(200)
  })

  it('returns 409 for already cancelled appointment', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ status: 'CANCELLED' }) as any
    )
    const res = await POST(makePostRequest({ token: 'test-token', action: 'cancel' }))
    expect(res.status).toBe(409)
  })
})

describe('POST /api/appointments/manage — reschedule', () => {
  beforeEach(() => vi.clearAllMocks())

  it('reschedules appointment successfully', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(10) }) as any
    )
    mockPrisma.appointment.update.mockResolvedValue({} as any)

    const res = await POST(makePostRequest({
      token: 'test-token',
      action: 'reschedule',
      date: dateInDays(15),
      time: '14:00',
    }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.action).toBe('rescheduled')
  })

  it('blocks reschedule within 24 hours', async () => {
    const tomorrow = new Date()
    tomorrow.setHours(tomorrow.getHours() + 10)
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: tomorrow.toISOString().split('T')[0], time: tomorrow.toTimeString().slice(0, 5) }) as any
    )
    const res = await POST(makePostRequest({
      token: 'test-token', action: 'reschedule',
      date: dateInDays(5), time: '10:00',
    }))
    expect(res.status).toBe(403)
  })

  it('blocks reschedule in 2-7 day zone after 1 reschedule', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(4), rescheduleCountRestricted: 1 }) as any
    )
    const res = await POST(makePostRequest({
      token: 'test-token', action: 'reschedule',
      date: dateInDays(6), time: '10:00',
    }))
    expect(res.status).toBe(403)
  })

  it('increments rescheduleCountRestricted when in 2-7 day zone', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(4), rescheduleCountRestricted: 0 }) as any
    )
    mockPrisma.appointment.update.mockResolvedValue({} as any)

    await POST(makePostRequest({
      token: 'test-token', action: 'reschedule',
      date: dateInDays(6), time: '10:00',
    }))

    expect(mockPrisma.appointment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ rescheduleCountRestricted: { increment: 1 } }),
      })
    )
  })

  it('blocks reschedule when rescheduleCount >= 3', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(10), rescheduleCount: 3 }) as any
    )
    const res = await POST(makePostRequest({
      token: 'test-token', action: 'reschedule',
      date: dateInDays(15), time: '10:00',
    }))
    expect(res.status).toBe(403)
  })

  it('does NOT increment rescheduleCountRestricted when >7 days away', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(10) }) as any
    )
    mockPrisma.appointment.update.mockResolvedValue({} as any)

    await POST(makePostRequest({
      token: 'test-token', action: 'reschedule',
      date: dateInDays(15), time: '10:00',
    }))

    const updateCall = (mockPrisma.appointment.update as any).mock.calls[0][0]
    expect(updateCall.data).not.toHaveProperty('rescheduleCountRestricted')
  })

  it('returns 400 when date or time is missing', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(10) }) as any
    )
    const res = await POST(makePostRequest({ token: 'test-token', action: 'reschedule' }))
    expect(res.status).toBe(400)
  })
})
