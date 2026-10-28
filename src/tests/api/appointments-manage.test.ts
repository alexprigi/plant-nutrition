import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/appointments/manage/route'
import { prisma } from '@/lib/prisma'

const mockPrisma = vi.mocked(prisma, { deep: true })

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

describe('POST /api/appointments/manage - extra branches', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    mockPrisma.appointment.update.mockResolvedValue({} as any)
  })

  it('returns 400 when token or action is missing', async () => {
    expect((await POST(makePostRequest({ action: 'cancel' }))).status).toBe(400)
    expect((await POST(makePostRequest({ token: 't' }))).status).toBe(400)
  })

  it('returns 404 when appointment not found', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(null)
    const res = await POST(makePostRequest({ token: 't', action: 'cancel' }))
    expect(res.status).toBe(404)
  })

  it('returns 409 for completed appointment', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(baseAppointment({ status: 'COMPLETED' }) as any)
    const res = await POST(makePostRequest({ token: 't', action: 'cancel' }))
    expect(res.status).toBe(409)
  })

  it('returns 400 for unknown action', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(baseAppointment() as any)
    const res = await POST(makePostRequest({ token: 't', action: 'bogus' }))
    expect(res.status).toBe(400)
  })

  it('cancels a free appointment close to the date (not refundable)', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(2), subscription: { paymentMethod: 'NONE', isPaid: false, price: 0 } }) as any,
    )
    const res = await POST(makePostRequest({ token: 't', action: 'cancel' }))
    expect(res.status).toBe(200)
    const body = JSON.parse((vi.mocked(fetch).mock.calls[0][1] as any).body)
    expect(body.isRefundable).toBe(false)
  })

  it('cancels an unpaid non-free confirmed appointment', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ date: dateInDays(2), subscription: { paymentMethod: 'BANK_TRANSFER', isPaid: false, price: 85 } }) as any,
    )
    const res = await POST(makePostRequest({ token: 't', action: 'cancel' }))
    expect(res.status).toBe(200)
  })

  it('swallows fetch failures when sending cancellation/reschedule notifications', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    mockPrisma.appointment.findUnique.mockResolvedValue(baseAppointment() as any)
    expect((await POST(makePostRequest({ token: 't', action: 'cancel' }))).status).toBe(200)
    expect(
      (await POST(makePostRequest({ token: 't', action: 'reschedule', date: dateInDays(12), time: '11:00' }))).status,
    ).toBe(200)
    await new Promise((r) => setTimeout(r, 0))
  })

  it('awaits the notification emails before responding', async () => {
    let sent = 0
    vi.stubGlobal('fetch', vi.fn().mockImplementation(
      () => new Promise((r) => setTimeout(() => { sent++; r({ ok: true }) }, 10)),
    ))
    mockPrisma.appointment.findUnique.mockResolvedValue(baseAppointment() as any)
    await POST(makePostRequest({ token: 't', action: 'cancel' }))
    expect(sent).toBe(2)
    await POST(makePostRequest({ token: 't', action: 'reschedule', date: dateInDays(12), time: '11:00' }))
    expect(sent).toBe(3)
  })

  it('logs when send-booking-emails answers with an error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' }))
    mockPrisma.appointment.findUnique.mockResolvedValue(baseAppointment() as any)
    expect((await POST(makePostRequest({ token: 't', action: 'cancel' }))).status).toBe(200)
    expect(spy).toHaveBeenCalledWith('send-booking-emails failed:', 500, 'boom', 'cancellation')
    spy.mockRestore()
  })

  it('logs even when the error body cannot be read', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502, text: async () => { throw new Error('x') } }))
    mockPrisma.appointment.findUnique.mockResolvedValue(baseAppointment() as any)
    await POST(makePostRequest({ token: 't', action: 'cancel' }))
    expect(spy).toHaveBeenCalledWith('send-booking-emails failed:', 502, '', 'cancellation')
    spy.mockRestore()
  })

  it('logs network failures', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    mockPrisma.appointment.findUnique.mockResolvedValue(baseAppointment() as any)
    await POST(makePostRequest({ token: 't', action: 'cancel' }))
    expect(spy).toHaveBeenCalledWith('Failed to send booking email:', expect.any(Error))
    spy.mockRestore()
  })
})

describe('GET /api/appointments/manage - extra branches', () => {
  beforeEach(() => vi.clearAllMocks())

  it('computes flags for unpaid, non-free appointment within 24h', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({
        date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        subscription: { paymentMethod: 'BANK_TRANSFER', isPaid: false, price: 85, type: 'SINGLE_SESSION' },
      }) as any,
    )
    const data = await (await GET(makeGetRequest('t'))).json()
    expect(data.canReschedule).toBe(false)
    expect(data.contactRequired).toBe(true)
  })

  it('contactRequired when reschedule is blocked and >24h', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(baseAppointment({ rescheduleCount: 3 }) as any)
    const data = await (await GET(makeGetRequest('t'))).json()
    expect(data.contactRequired).toBe(true)
  })

  it('allows reschedule in restricted zone with no previous restricted reschedule', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(baseAppointment({ date: dateInDays(4) }) as any)
    const data = await (await GET(makeGetRequest('t'))).json()
    expect(data.canReschedule).toBe(true)
  })

  it('free appointment is cancellable and never requires contact', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ subscription: { paymentMethod: 'NONE', isPaid: false, price: 0, type: 'FREE_CONSULTATION' } }) as any,
    )
    const data = await (await GET(makeGetRequest('t'))).json()
    expect(data.contactRequired).toBe(false)
    expect(data.canCancel).toBe(true)
  })
})
