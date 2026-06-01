import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { PATCH } from '@/app/api/admin/appointments/[id]/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const mockPrisma = vi.mocked(prisma)
const mockAuth = vi.mocked(auth)

vi.mock('@/lib/email', () => ({
  resend: { emails: { send: vi.fn().mockResolvedValue({ data: { id: 'email_1' } }) } },
}))

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/admin/appointments/appt_1', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

const makeParams = () => ({ params: Promise.resolve({ id: 'appt_1' }) })

const baseAppointment = (overrides = {}) => ({
  id: 'appt_1',
  date: '2026-06-15',
  time: '10:00',
  status: 'CONFIRMED',
  notes: '',
  subscriptionId: 'sub_1',
  managementToken: 'token_1',
  client: { name: 'Mario', surname: 'Rossi', email: 'mario@test.com', phone: '+39 333 1234567' },
  subscription: {
    id: 'sub_1',
    type: 'SINGLE_SESSION',
    price: 85,
    isPaid: true,
    paymentMethod: 'STRIPE',
    totalSessions: 1,
    usedSessions: 0,
    followUpToken: null,
  },
  ...overrides,
})

describe('PATCH /api/admin/appointments/[id] — status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { name: 'Arianna' } } as any)
  })

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await PATCH(makeRequest({ status: 'confirmed' }), makeParams())
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid status', async () => {
    const res = await PATCH(makeRequest({ status: 'invalid' }), makeParams())
    expect(res.status).toBe(400)
  })

  it('updates appointment status', async () => {
    mockPrisma.appointment.update.mockResolvedValue(baseAppointment({ status: 'CONFIRMED' }) as any)
    const res = await PATCH(makeRequest({ status: 'confirmed' }), makeParams())
    expect(res.status).toBe(200)
    expect(mockPrisma.appointment.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'CONFIRMED' } })
    )
  })

  it('increments usedSessions when marking as completed', async () => {
    mockPrisma.appointment.update.mockResolvedValue(
      baseAppointment({ status: 'COMPLETED' }) as any
    )
    mockPrisma.subscription.update.mockResolvedValue({} as any)

    await PATCH(makeRequest({ status: 'completed' }), makeParams())

    expect(mockPrisma.subscription.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ usedSessions: 1 }),
      })
    )
  })

  it('marks subscription as EXHAUSTED when last session completed', async () => {
    mockPrisma.appointment.update.mockResolvedValue(
      baseAppointment({ status: 'COMPLETED', subscription: { id: 'sub_1', type: 'SINGLE_SESSION', price: 85, isPaid: true, paymentMethod: 'STRIPE', totalSessions: 1, usedSessions: 0, followUpToken: null } }) as any
    )
    mockPrisma.subscription.update.mockResolvedValue({} as any)

    await PATCH(makeRequest({ status: 'completed' }), makeParams())

    expect(mockPrisma.subscription.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'EXHAUSTED' }),
      })
    )
  })

  it('sends follow-up email for bundle with remaining sessions', async () => {
    const { resend } = await import('@/lib/email')
    const mockSend = vi.mocked(resend.emails.send)

    mockPrisma.appointment.update.mockResolvedValue(
      baseAppointment({
        status: 'COMPLETED',
        subscription: { id: 'sub_1', type: 'BUNDLE_3_MONTHS', price: 237, isPaid: true, paymentMethod: 'STRIPE', totalSessions: 3, usedSessions: 0, followUpToken: 'fup_token' },
      }) as any
    )
    mockPrisma.subscription.update.mockResolvedValue({} as any)

    await PATCH(makeRequest({ status: 'completed' }), makeParams())

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'mario@test.com' })
    )
  })

  it('does NOT send follow-up email for non-bundle', async () => {
    const { resend } = await import('@/lib/email')
    const mockSend = vi.mocked(resend.emails.send)
    mockSend.mockClear()

    mockPrisma.appointment.update.mockResolvedValue(
      baseAppointment({ status: 'COMPLETED' }) as any
    )
    mockPrisma.subscription.update.mockResolvedValue({} as any)

    await PATCH(makeRequest({ status: 'completed' }), makeParams())

    expect(mockSend).not.toHaveBeenCalled()
  })
})

describe('PATCH /api/admin/appointments/[id] — reschedule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { name: 'Arianna' } } as any)
  })

  it('returns 400 when date or time missing', async () => {
    const res = await PATCH(makeRequest({ reschedule: true }), makeParams())
    expect(res.status).toBe(400)
  })

  it('returns 404 when appointment not found', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(null)
    const res = await PATCH(makeRequest({ reschedule: true, date: '2026-07-01', time: '10:00' }), makeParams())
    expect(res.status).toBe(404)
  })

  it('updates date and time without limits', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(baseAppointment() as any)
    mockPrisma.appointment.update.mockResolvedValue({} as any)

    const res = await PATCH(makeRequest({ reschedule: true, date: '2026-07-01', time: '14:00' }), makeParams())

    expect(res.status).toBe(200)
    expect(mockPrisma.appointment.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { date: '2026-07-01', time: '14:00' } })
    )
  })
})

describe('PATCH /api/admin/appointments/[id] — resendFollowUp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { name: 'Arianna' } } as any)
  })

  it('returns 400 when no sessions remaining', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ subscription: { id: 'sub_1', type: 'BUNDLE_3_MONTHS', price: 237, isPaid: true, paymentMethod: 'STRIPE', totalSessions: 3, usedSessions: 3, followUpToken: 'fup_token' } }) as any
    )
    const res = await PATCH(makeRequest({ resendFollowUp: true }), makeParams())
    expect(res.status).toBe(400)
  })

  it('returns 400 when no followUpToken', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ subscription: { id: 'sub_1', type: 'BUNDLE_3_MONTHS', price: 237, isPaid: true, paymentMethod: 'STRIPE', totalSessions: 3, usedSessions: 1, followUpToken: null } }) as any
    )
    const res = await PATCH(makeRequest({ resendFollowUp: true }), makeParams())
    expect(res.status).toBe(400)
  })

  it('sends follow-up email with correct sessions remaining', async () => {
    const { resend } = await import('@/lib/email')
    const mockSend = vi.mocked(resend.emails.send)

    mockPrisma.appointment.findUnique.mockResolvedValue(
      baseAppointment({ subscription: { id: 'sub_1', type: 'BUNDLE_3_MONTHS', price: 237, isPaid: true, paymentMethod: 'STRIPE', totalSessions: 3, usedSessions: 1, followUpToken: 'fup_token' } }) as any
    )

    const res = await PATCH(makeRequest({ resendFollowUp: true }), makeParams())

    expect(res.status).toBe(200)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'mario@test.com' })
    )
  })
})
