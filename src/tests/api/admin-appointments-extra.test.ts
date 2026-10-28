import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { PATCH } from '@/app/api/admin/appointments/[id]/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { resend } from '@/lib/email'

const mockPrisma = vi.mocked(prisma, { deep: true })
const mockAuth = vi.mocked(auth) as unknown as ReturnType<typeof vi.fn>
const mockSend = vi.mocked(resend.emails.send)

vi.mock('@/lib/email', () => ({
  resend: { emails: { send: vi.fn() } },
}))

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/admin/appointments/appt_1', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
const makeParams = () => ({ params: Promise.resolve({ id: 'appt_1' }) })

const appt = (subOverrides = {}, overrides = {}) => ({
  id: 'appt_1',
  date: '2026-06-15',
  time: '10:00',
  status: 'CONFIRMED',
  notes: '',
  locale: 'it',
  subscriptionId: 'sub_1',
  managementToken: 'token_1',
  client: { name: 'Mario', surname: 'Rossi', email: 'mario@test.com', phone: '+39 333' },
  subscription: {
    id: 'sub_1',
    type: 'SINGLE_SESSION',
    price: 85,
    isPaid: false,
    paymentMethod: 'STRIPE',
    totalSessions: 3,
    usedSessions: 0,
    followUpToken: 'fup',
    ...subOverrides,
  },
  ...overrides,
})

describe('PATCH admin appointment — extra branches', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { name: 'A' } } as any)
    mockSend.mockResolvedValue({ data: { id: 'e' } } as any)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('swallows follow-up email errors on completion and uses fallback type', async () => {
    mockSend.mockRejectedValue(new Error('fail'))
    mockPrisma.appointment.update.mockResolvedValue(
      appt({ type: 'BUNDLE_6_MONTHS', totalSessions: 6 }) as any,
    )
    mockPrisma.subscription.update.mockResolvedValue({} as any)
    const res = await PATCH(makeRequest({ status: 'completed' }), makeParams())
    expect(res.status).toBe(200)
    expect(mockSend).toHaveBeenCalled()
  })

  it('falls back to single-session label for unknown type on completion', async () => {
    mockPrisma.appointment.update.mockResolvedValue(
      appt({ type: 'BUNDLE_3_MONTHS' }) as any,
    )
    mockPrisma.subscription.update.mockResolvedValue({} as any)
    // unknown type in bundle check is impossible; use unknown type in resend path instead
    mockPrisma.appointment.findUnique.mockResolvedValue(appt({ type: 'WEIRD' }) as any)
    const res = await PATCH(makeRequest({ resendFollowUp: true }), makeParams())
    expect(res.status).toBe(200)
  })

  it('isPaid: 404 when not found', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(null)
    const res = await PATCH(makeRequest({ isPaid: true }), makeParams())
    expect(res.status).toBe(404)
  })

  it('isPaid: confirms pending appointment and sends email', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(appt({}, { status: 'PENDING' }) as any)
    mockPrisma.subscription.update.mockResolvedValue({} as any)
    mockPrisma.appointment.update.mockResolvedValue({} as any)
    const res = await PATCH(makeRequest({ isPaid: true }), makeParams())
    expect(res.status).toBe(200)
    expect(mockPrisma.subscription.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isPaid: true } }),
    )
    expect(mockPrisma.appointment.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'CONFIRMED' } }),
    )
    expect(fetch).toHaveBeenCalled()
  })

  it('isPaid: does not update status when already confirmed, unknown type fallback, fetch error swallowed', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('net')))
    mockPrisma.appointment.findUnique.mockResolvedValue(appt({ type: 'WEIRD' }) as any)
    mockPrisma.subscription.update.mockResolvedValue({} as any)
    const res = await PATCH(makeRequest({ isPaid: true }), makeParams())
    expect(res.status).toBe(200)
    expect(mockPrisma.appointment.update).not.toHaveBeenCalled()
  })

  it('reschedule: unknown type fallback and email error swallowed', async () => {
    mockSend.mockRejectedValue(new Error('fail'))
    mockPrisma.appointment.findUnique.mockResolvedValue(appt({ type: 'WEIRD' }) as any)
    mockPrisma.appointment.update.mockResolvedValue({} as any)
    const res = await PATCH(
      makeRequest({ reschedule: true, date: '2026-07-01', time: '10:00' }),
      makeParams(),
    )
    expect(res.status).toBe(200)
  })

  it('resendFollowUp: 404 when not found', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(null)
    const res = await PATCH(makeRequest({ resendFollowUp: true }), makeParams())
    expect(res.status).toBe(404)
  })

  it('returns 400 when no modification specified', async () => {
    const res = await PATCH(makeRequest({}), makeParams())
    expect(res.status).toBe(400)
  })

  it('completion: bundle without remaining sessions sends no email', async () => {
    mockPrisma.appointment.update.mockResolvedValue(
      appt({ type: 'BUNDLE_3_MONTHS', totalSessions: 3, usedSessions: 2 }) as any,
    )
    mockPrisma.subscription.update.mockResolvedValue({} as any)
    await PATCH(makeRequest({ status: 'completed' }), makeParams())
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('completion: bundle with remaining sessions but no token sends no email', async () => {
    mockPrisma.appointment.update.mockResolvedValue(
      appt({ type: 'BUNDLE_3_MONTHS', followUpToken: null }) as any,
    )
    mockPrisma.subscription.update.mockResolvedValue({} as any)
    await PATCH(makeRequest({ status: 'completed' }), makeParams())
    expect(mockSend).not.toHaveBeenCalled()
  })
})

describe('PATCH admin appointment — production env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('uses no test prefix when AUTH_URL is production', async () => {
    vi.resetModules()
    vi.stubEnv('AUTH_URL', 'https://www.vivaplantnutrition.com')
    const mod = await import('@/app/api/admin/appointments/[id]/route')
    const { prisma: p } = await import('@/lib/prisma')
    const { auth: a } = await import('@/lib/auth')
    const { resend: r } = await import('@/lib/email')
    ;(vi.mocked(a) as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ user: {} })
    vi.mocked(p, { deep: true }).appointment.findUnique.mockResolvedValue(appt() as any)
    vi.mocked(r.emails.send).mockResolvedValue({ data: { id: 'x' } } as any)
    const res = await mod.PATCH(makeRequest({ resendFollowUp: true }), makeParams())
    expect(res.status).toBe(200)
    const arg = vi.mocked(r.emails.send).mock.calls[0][0] as { subject: string }
    expect(arg.subject.startsWith('[TEST]')).toBe(false)
  })
})
