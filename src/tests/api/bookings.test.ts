import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/bookings/route'
import { prisma } from '@/lib/prisma'

const mockPrisma = vi.mocked(prisma)

const baseDTO = {
  name: 'Mario', surname: 'Rossi', email: 'mario@test.com',
  phone: '+39 333 1234567', address: 'Via Roma', civicNumber: '1',
  city: 'Milano', zipCode: '20100', country: 'Italia', fiscalCode: 'RSSMRA80A01F205X',
  commercialType: 'first-visit', paymentMethod: 'stripe',
  selectedDate: '2026-05-01', selectedTime: '10:00',
  notes: '', isPaid: true, status: 'confirmed',
}

const makePostRequest = (body: object) =>
  new NextRequest('http://localhost/api/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

const makeGetRequest = (date?: string) =>
  new NextRequest(`http://localhost/api/bookings${date ? `?date=${date}` : ''}`)

describe('POST /api/bookings', () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates booking and returns 201', async () => {
    const fakeClient = { id: 'cli_1', email: 'mario@test.com' }
    const fakeSub = { id: 'sub_1', clientId: 'cli_1' }
    const fakeAppt = { id: 'appt_1', subscriptionId: 'sub_1', clientId: 'cli_1' }

    mockPrisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        client: { upsert: vi.fn().mockResolvedValue(fakeClient) },
        subscription: { create: vi.fn().mockResolvedValue(fakeSub) },
        appointment: { create: vi.fn().mockResolvedValue(fakeAppt) },
      }),
    )

    const res = await POST(makePostRequest(baseDTO))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data).toHaveProperty('client')
    expect(data).toHaveProperty('subscription')
    expect(data).toHaveProperty('appointment')
  })

  it('maps free-consultation to FREE_CONSULTATION type', async () => {
    let capturedSubData: any

    mockPrisma.$transaction.mockImplementation(async (fn: any) => {
      const mockSub = { create: vi.fn().mockImplementation(async ({ data }: any) => { capturedSubData = data; return { id: 'sub_1' } }) }
      return fn({
        client: { upsert: vi.fn().mockResolvedValue({ id: 'cli_1' }) },
        subscription: mockSub,
        appointment: { create: vi.fn().mockResolvedValue({ id: 'appt_1' }) },
      })
    })

    await POST(makePostRequest({ ...baseDTO, commercialType: 'free-consultation', paymentMethod: 'none', isPaid: false, price: 0 }))

    expect(capturedSubData.type).toBe('FREE_CONSULTATION')
    expect(capturedSubData.price).toBe(0)
    expect(capturedSubData.usedSessions).toBe(0)
  })

  it('creates subscription with usedSessions=0', async () => {
    let capturedSubData: any

    mockPrisma.$transaction.mockImplementation(async (fn: any) => {
      const mockSub = { create: vi.fn().mockImplementation(async ({ data }: any) => { capturedSubData = data; return { id: 'sub_1' } }) }
      return fn({
        client: { upsert: vi.fn().mockResolvedValue({ id: 'cli_1' }) },
        subscription: mockSub,
        appointment: { create: vi.fn().mockResolvedValue({ id: 'appt_1' }) },
      })
    })

    await POST(makePostRequest(baseDTO))
    expect(capturedSubData.usedSessions).toBe(0)
  })

  it('does not increment usedSessions on follow-up booking', async () => {
    mockPrisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        client: { upsert: vi.fn().mockResolvedValue({ id: 'cli_1' }) },
        subscription: {
          findUnique: vi.fn().mockResolvedValue({ id: 'sub_existing', usedSessions: 1, totalSessions: 3 }),
          update: vi.fn(),
        },
        appointment: { create: vi.fn().mockResolvedValue({ id: 'appt_1' }) },
      })
    )

    const res = await POST(makePostRequest({ ...baseDTO, existingSubscriptionId: 'sub_existing' }))
    expect(res.status).toBe(201)

    // update non deve essere chiamato sulla subscription (no incremento)
    const txCall = (mockPrisma.$transaction as any).mock.calls[0][0]
    const fakeTx = { client: { upsert: vi.fn().mockResolvedValue({ id: 'cli_1' }) }, subscription: { findUnique: vi.fn().mockResolvedValue({ id: 'sub_existing' }), update: vi.fn() }, appointment: { create: vi.fn().mockResolvedValue({ id: 'appt_1' }) } }
    await txCall(fakeTx)
    expect(fakeTx.subscription.update).not.toHaveBeenCalled()
  })

  it('returns 500 on database error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockPrisma.$transaction.mockRejectedValue(new Error('DB error'))

    const res = await POST(makePostRequest(baseDTO))
    expect(res.status).toBe(500)
    consoleSpy.mockRestore()
  })
})

describe('GET /api/bookings', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 400 when date is missing', async () => {
    const res = await GET(makeGetRequest())
    expect(res.status).toBe(400)
  })

  it('returns available slots for a date', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([])

    const res = await GET(makeGetRequest('2026-05-01'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.date).toBe('2026-05-01')
    expect(data.slots).toHaveLength(14)
    expect(data.slots[0]).toHaveProperty('available', true)
  })

  it('marks booked slots as unavailable', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([{ time: '09:00' } as any])

    const res = await GET(makeGetRequest('2026-05-01'))
    const data = await res.json()
    const slot = data.slots.find((s: any) => s.time === '09:00')

    expect(slot.available).toBe(false)
  })
})
