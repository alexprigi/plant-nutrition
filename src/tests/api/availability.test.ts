import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST, DELETE } from '@/app/api/admin/availability/route'
import { GET as GET_BOOKINGS } from '@/app/api/bookings/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const mockPrisma = vi.mocked(prisma)
const mockAuth = vi.mocked(auth)

const makeGetRequest = (params = '') =>
  new NextRequest(`http://localhost/api/admin/availability${params}`)

const makePostRequest = (body: object) =>
  new NextRequest('http://localhost/api/admin/availability', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

const makeDeleteRequest = (id: string) =>
  new NextRequest(`http://localhost/api/admin/availability?id=${id}`, { method: 'DELETE' })

const makeBookingsRequest = (date: string) =>
  new NextRequest(`http://localhost/api/bookings?date=${date}`)

// Prossimo sabato
function nextSaturday(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = (6 - day + 7) % 7 || 7
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

function nextMonday(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = (8 - day) % 7 || 7
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

describe('GET /api/admin/availability', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { name: 'Arianna' } } as any)
  })

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await GET(makeGetRequest())
    expect(res.status).toBe(401)
  })

  it('returns blocks for date range', async () => {
    const fakeBlocks = [{ id: 'blk_1', date: '2026-06-10', type: 'BLOCK', startTime: '12:00', endTime: '14:00', note: '' }]
    mockPrisma.availabilityBlock.findMany.mockResolvedValue(fakeBlocks as any)
    const res = await GET(makeGetRequest('?from=2026-06-10&to=2026-06-14'))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data).toHaveLength(1)
  })

  it('returns empty array on DB error', async () => {
    mockPrisma.availabilityBlock.findMany.mockRejectedValue(new Error('DB error'))
    const res = await GET(makeGetRequest())
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data).toEqual([])
  })
})

describe('POST /api/admin/availability', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { name: 'Arianna' } } as any)
  })

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await POST(makePostRequest({ date: '2026-06-10' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when date is missing', async () => {
    const res = await POST(makePostRequest({ note: 'test' }))
    expect(res.status).toBe(400)
  })

  it('creates a BLOCK for a single date', async () => {
    const fakeBlock = { id: 'blk_1', date: '2026-06-10', type: 'BLOCK', startTime: '12:00', endTime: '14:00', note: '' }
    mockPrisma.availabilityBlock.create.mockResolvedValue(fakeBlock as any)
    const res = await POST(makePostRequest({ date: '2026-06-10', type: 'BLOCK', startTime: '12:00', endTime: '14:00' }))
    expect(res.status).toBe(200)
    expect(mockPrisma.availabilityBlock.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ type: 'BLOCK', startTime: '12:00' }) })
    )
  })

  it('creates an OPEN block for a weekend', async () => {
    mockPrisma.availabilityBlock.create.mockResolvedValue({ id: 'blk_2', date: '2026-06-07', type: 'OPEN', startTime: null, endTime: null, note: '' } as any)
    await POST(makePostRequest({ date: '2026-06-07', type: 'OPEN' }))
    expect(mockPrisma.availabilityBlock.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ type: 'OPEN' }) })
    )
  })

  it('creates blocks in bulk', async () => {
    mockPrisma.availabilityBlock.createMany.mockResolvedValue({ count: 3 } as any)
    const res = await POST(makePostRequest({ dates: ['2026-06-10', '2026-06-11', '2026-06-12'], type: 'BLOCK', startTime: null, endTime: null }))
    const data = await res.json()
    expect(data.count).toBe(3)
  })

  it('defaults to BLOCK type when type is missing', async () => {
    mockPrisma.availabilityBlock.create.mockResolvedValue({ id: 'blk_3', date: '2026-06-10', type: 'BLOCK', startTime: null, endTime: null, note: '' } as any)
    await POST(makePostRequest({ date: '2026-06-10' }))
    expect(mockPrisma.availabilityBlock.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ type: 'BLOCK' }) })
    )
  })
})

describe('DELETE /api/admin/availability', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { name: 'Arianna' } } as any)
  })

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await DELETE(makeDeleteRequest('blk_1'))
    expect(res.status).toBe(401)
  })

  it('returns 400 when id is missing', async () => {
    const res = await DELETE(new NextRequest('http://localhost/api/admin/availability', { method: 'DELETE' }))
    expect(res.status).toBe(400)
  })

  it('deletes block and returns success', async () => {
    mockPrisma.availabilityBlock.delete.mockResolvedValue({} as any)
    const res = await DELETE(makeDeleteRequest('blk_1'))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockPrisma.availabilityBlock.delete).toHaveBeenCalledWith({ where: { id: 'blk_1' } })
  })
})

describe('GET /api/bookings — weekend availability', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.appointment.findMany.mockResolvedValue([])
  })

  it('blocks all slots on weekend with no OPEN block', async () => {
    const sat = nextSaturday()
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([])
    const res = await GET_BOOKINGS(makeBookingsRequest(sat))
    const data = await res.json()
    expect(data.slots.every((s: any) => !s.available)).toBe(true)
  })

  it('opens all slots on weekend with full-day OPEN block', async () => {
    const sat = nextSaturday()
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([
      { id: 'blk_1', date: sat, type: 'OPEN', startTime: null, endTime: null, note: '' },
    ] as any)
    const res = await GET_BOOKINGS(makeBookingsRequest(sat))
    const data = await res.json()
    expect(data.slots.some((s: any) => s.available)).toBe(true)
  })

  it('opens only specific slots on weekend with partial OPEN block', async () => {
    const sat = nextSaturday()
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([
      { id: 'blk_1', date: sat, type: 'OPEN', startTime: '09:00', endTime: '12:00', note: '' },
    ] as any)
    const res = await GET_BOOKINGS(makeBookingsRequest(sat))
    const data = await res.json()
    const slot0900 = data.slots.find((s: any) => s.time === '09:00')
    const slot1300 = data.slots.find((s: any) => s.time === '13:00')
    expect(slot0900.available).toBe(true)
    expect(slot1300.available).toBe(false)
  })

  it('blocks specific slots on weekday with range BLOCK', async () => {
    const mon = nextMonday()
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([
      { id: 'blk_1', date: mon, type: 'BLOCK', startTime: '12:00', endTime: '14:00', note: '' },
    ] as any)
    const res = await GET_BOOKINGS(makeBookingsRequest(mon))
    const data = await res.json()
    const slot1200 = data.slots.find((s: any) => s.time === '12:00')
    const slot1400 = data.slots.find((s: any) => s.time === '14:00')
    expect(slot1200.available).toBe(false)
    expect(slot1400.available).toBe(true)
  })

  it('opens multiple non-contiguous intervals on weekend', async () => {
    const sat = nextSaturday()
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([
      { id: 'blk_1', date: sat, type: 'OPEN', startTime: '09:00', endTime: '10:00', note: '' },
      { id: 'blk_2', date: sat, type: 'OPEN', startTime: '14:00', endTime: '15:00', note: '' },
    ] as any)
    const res = await GET_BOOKINGS(makeBookingsRequest(sat))
    const data = await res.json()
    const slot0900 = data.slots.find((s: any) => s.time === '09:00')
    const slot1400 = data.slots.find((s: any) => s.time === '14:00')
    const slot1100 = data.slots.find((s: any) => s.time === '11:00')
    expect(slot0900.available).toBe(true)
    expect(slot1400.available).toBe(true)
    expect(slot1100.available).toBe(false)
  })

  it('blocks OPEN weekend slot if covered by BLOCK', async () => {
    const sat = nextSaturday()
    mockPrisma.availabilityBlock.findMany.mockResolvedValue([
      { id: 'blk_1', date: sat, type: 'OPEN', startTime: null, endTime: null, note: '' },
      { id: 'blk_2', date: sat, type: 'BLOCK', startTime: '10:00', endTime: '11:00', note: '' },
    ] as any)
    const res = await GET_BOOKINGS(makeBookingsRequest(sat))
    const data = await res.json()
    const slot1000 = data.slots.find((s: any) => s.time === '10:00')
    const slot1100 = data.slots.find((s: any) => s.time === '11:00')
    expect(slot1000.available).toBe(false)
    expect(slot1100.available).toBe(true)
  })
})
