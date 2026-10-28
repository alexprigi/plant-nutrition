import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/bookings/route'
import { prisma } from '@/lib/prisma'

const mockPrisma = vi.mocked(prisma, { deep: true })

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

  it.each([
    ['it', 'it'],
    ['en', 'en'],
    [undefined, 'de'],
    ['fr', 'de'],
  ])('stores locale %s as %s on the appointment', async (input, expected) => {
    let capturedApptData: any
    mockPrisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        client: { upsert: vi.fn().mockResolvedValue({ id: 'cli_1' }) },
        subscription: { create: vi.fn().mockResolvedValue({ id: 'sub_1' }) },
        appointment: { create: vi.fn().mockImplementation(async ({ data }: any) => { capturedApptData = data; return { id: 'appt_1' } }) },
      }),
    )

    await POST(makePostRequest({ ...baseDTO, locale: input }))
    expect(capturedApptData.locale).toBe(expected)
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

const makeGetRequestWithDuration = (date: string, duration: number) =>
  new NextRequest(`http://localhost/api/bookings?date=${date}&duration=${duration}`)

describe('GET /api/bookings — duration check', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([])
  })

  it('blocks slot if appointment occupies next slot within duration', async () => {
    // Appuntamento alle 10:00 — con durata 60min, lo slot delle 09:30 deve essere bloccato
    mockPrisma.appointment.findMany.mockResolvedValue([{ time: '10:00' } as any])
    const res = await GET(makeGetRequestWithDuration('2026-06-03', 60))
    const data = await res.json()
    const slot0930 = data.slots.find((s: any) => s.time === '09:30')
    const slot0900 = data.slots.find((s: any) => s.time === '09:00')
    expect(slot0930.available).toBe(false) // 09:30 + 60min = 10:30, copre 10:00
    expect(slot0900.available).toBe(true)  // 09:00 + 60min = 10:00, non copre 10:00 (end esclusivo)
  })

  it('blocks slot if availability block overlaps within duration', async () => {
    // Blocco 12:00-13:00 — con durata 60min, lo slot delle 11:30 deve essere bloccato
    mockPrisma.appointment.findMany.mockResolvedValue([])
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([
      { id: 'blk_1', date: '2026-06-03', type: 'BLOCK', startTime: '12:00', endTime: '13:00', note: '' },
    ] as any)
    const res = await GET(makeGetRequestWithDuration('2026-06-03', 60))
    const data = await res.json()
    const slot1130 = data.slots.find((s: any) => s.time === '11:30')
    const slot1300 = data.slots.find((s: any) => s.time === '13:00')
    expect(slot1130.available).toBe(false)
    expect(slot1300.available).toBe(true)
  })
})

describe('GET /api/bookings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([])
  })

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
    expect(data.slots).toHaveLength(25)
    expect(data.slots[0]).toHaveProperty('available', true)
  })

  it('marks booked slots as unavailable', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([{ time: '09:00' } as any])

    const res = await GET(makeGetRequest('2026-05-01'))
    const data = await res.json()
    const slot = data.slots.find((s: any) => s.time === '09:00')

    expect(slot.available).toBe(false)
  })

  it('marks availability-blocked slots as unavailable', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([])
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([
      { id: 'blk_1', date: '2026-05-01', type: 'BLOCK', startTime: '12:00', endTime: '14:00', note: '' },
    ] as any)

    const res = await GET(makeGetRequest('2026-05-01'))
    const data = await res.json()

    const blocked = data.slots.find((s: any) => s.time === '12:00')
    const free = data.slots.find((s: any) => s.time === '11:30')

    expect(blocked.available).toBe(false)
    expect(free.available).toBe(true)
  })

  it('marks all slots unavailable when full-day block exists', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([])
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([
      { id: 'blk_1', date: '2026-05-01', type: 'BLOCK', startTime: null, endTime: null, note: 'Ferie' },
    ] as any)

    const res = await GET(makeGetRequest('2026-05-01'))
    const data = await res.json()

    expect(data.slots.every((s: any) => !s.available)).toBe(true)
  })
})

describe('POST /api/bookings - mapping branches', () => {
  beforeEach(() => vi.clearAllMocks())

  const run = async (dto: object, tx: any = {}) => {
    const create = {
      client: { upsert: vi.fn().mockResolvedValue({ id: 'c' }) },
      subscription: { create: vi.fn().mockResolvedValue({ id: 's' }), findUnique: vi.fn() },
      appointment: { create: vi.fn().mockResolvedValue({ id: 'a' }) },
      ...tx,
    }
    mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(create))
    const res = await POST(makePostRequest({ ...baseDTO, ...dto }))
    return { res, tx: create }
  }

  it.each([
    ['follow-up', 'SINGLE_SESSION', 50],
    ['first-visit', 'SINGLE_SESSION', 85],
    ['plan-3-months', 'BUNDLE_3_MONTHS', 237],
    ['plan-6-months', 'BUNDLE_6_MONTHS', 450],
  ])('maps %s', async (commercialType, type, price) => {
    const { res, tx } = await run({ commercialType })
    expect(res.status).toBe(201)
    const arg = tx.subscription.create.mock.calls[0][0].data
    expect(arg.type).toBe(type)
    expect(arg.price).toBe(price)
    if (type.startsWith('BUNDLE')) expect(arg.expiresAt).toBeInstanceOf(Date)
    else expect(arg.expiresAt).toBeUndefined()
  })

  it.each([
    ['paypal', 'PAYPAL'],
    ['bank_transfer', 'BANK_TRANSFER'],
    ['none', 'NONE'],
    ['weird', 'NONE'],
  ])('maps payment method %s', async (paymentMethod, expected) => {
    const { tx } = await run({ paymentMethod })
    expect(tx.subscription.create.mock.calls[0][0].data.paymentMethod).toBe(expected)
  })

  it.each([
    ['pending', 'PENDING'],
    ['cancelled', 'CANCELLED'],
    ['completed', 'COMPLETED'],
    ['weird', 'PENDING'],
  ])('maps status %s', async (status, expected) => {
    const { tx } = await run({ status })
    expect(tx.appointment.create.mock.calls[0][0].data.status).toBe(expected)
  })

  it('defaults notes to empty string when undefined', async () => {
    const { tx } = await run({ notes: undefined })
    expect(tx.appointment.create.mock.calls[0][0].data.notes).toBe('')
  })

  it('returns 500 when existing subscription is not found', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { res } = await run(
      { existingSubscriptionId: 'missing' },
      { subscription: { findUnique: vi.fn().mockResolvedValue(null), create: vi.fn() } },
    )
    expect(res.status).toBe(500)
  })
})

describe('GET /api/bookings - weekend', () => {
  beforeEach(() => vi.clearAllMocks())
  const SAT = '2026-05-02'

  const slotsFor = async (blocks: any[], booked: any[] = [], duration = 30) => {
    mockPrisma.appointment.findMany.mockResolvedValue(booked)
    mockPrisma.availabilityBlock.findMany.mockResolvedValue(blocks)
    const res = await GET(new NextRequest(`http://localhost/api/bookings?date=${SAT}&duration=${duration}`))
    const data = await res.json()
    return Object.fromEntries(data.slots.map((s: any) => [s.time, s.available]))
  }

  it('is fully closed on weekend without OPEN blocks', async () => {
    const s = await slotsFor([])
    expect(Object.values(s).every((v) => v === false)).toBe(true)
  })

  it('opens only slots inside an OPEN window, excluding BLOCK windows and booked', async () => {
    const s = await slotsFor(
      [
        { type: 'OPEN', startTime: '09:00', endTime: '12:00' },
        { type: 'BLOCK', startTime: '10:00', endTime: '10:30' },
      ],
      [{ time: '11:00' }],
    )
    expect(s['09:00']).toBe(true)
    expect(s['10:00']).toBe(false)
    expect(s['11:00']).toBe(false)
    expect(s['11:30']).toBe(true)
    expect(s['13:00']).toBe(false)
  })

  it('treats OPEN/BLOCK without times as whole-day', async () => {
    const open = await slotsFor([{ type: 'OPEN', startTime: null, endTime: null }])
    expect(open['08:00']).toBe(true)
    const blocked = await slotsFor([
      { type: 'OPEN', startTime: null, endTime: null },
      { type: 'BLOCK', startTime: null, endTime: null },
    ])
    expect(Object.values(blocked).every((v) => v === false)).toBe(true)
  })

  it('uses default duration of 30 when not provided', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([])
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([])
    const res = await GET(new NextRequest('http://localhost/api/bookings?date=2026-05-04'))
    expect((await res.json()).slots[0].available).toBe(true)
  })
})
