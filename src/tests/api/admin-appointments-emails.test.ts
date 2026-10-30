import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { PATCH } from '@/app/api/admin/appointments/[id]/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { resend } from '@/lib/email'

const mockPrisma = vi.mocked(prisma, { deep: true })
const mockAuth = vi.mocked(auth) as unknown as ReturnType<typeof vi.fn>
const mockSend = vi.mocked(resend.emails.send) as unknown as ReturnType<typeof vi.fn>

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/admin/appointments/appt_1', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
const makeParams = () => ({ params: Promise.resolve({ id: 'appt_1' }) })

const appt = (subOverrides = {}) => ({
  id: 'appt_1', date: '2026-06-15', time: '10:00', status: 'PENDING', notes: '', locale: 'en',
  managementToken: 'tok',
  client: { name: 'Mario', surname: 'Rossi', email: 'mario@test.com', phone: '+39 333' },
  subscription: {
    id: 'sub_1', type: 'BUNDLE_3_MONTHS', price: 237, isPaid: false, paymentMethod: 'BANK_TRANSFER',
    totalSessions: 3, usedSessions: 0, followUpToken: 'fup', ...subOverrides,
  },
})

// Le email devono essere attese prima della risposta: su serverless le promise non attese vengono perse.
describe('admin appointments — emails are awaited and failures are logged', () => {
  const fetchMock = vi.fn()
  let errSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('AUTH_URL', 'http://localhost:3000')
    vi.stubGlobal('fetch', fetchMock)
    errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockAuth.mockResolvedValue({ user: { name: 'A' } })
    mockSend.mockResolvedValue({ data: { id: 'e' }, error: null })
    fetchMock.mockResolvedValue({ ok: true })
    mockPrisma.appointment.findUnique.mockResolvedValue(appt() as any)
    mockPrisma.appointment.update.mockResolvedValue(appt({ usedSessions: 0 }) as any)
    mockPrisma.subscription.update.mockResolvedValue({} as any)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    errSpy.mockRestore()
  })

  it('awaits the confirmation email after marking as paid', async () => {
    let sent = false
    fetchMock.mockImplementation(() => new Promise((r) => setTimeout(() => { sent = true; r({ ok: true }) }, 15)))
    const res = await PATCH(makeRequest({ isPaid: true }), makeParams())
    expect(res.status).toBe(200)
    expect(sent).toBe(true)
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ locale: 'en', isPaid: true })
  })

  it.each([
    ['FIRST_VISIT', 'SINGLE_SESSION', 'Full First Visit'],
    ['FIRST_VISIT', 'BUNDLE_3_MONTHS', '3-Month Program'],
    ['FOLLOW_UP', 'BUNDLE_3_MONTHS', 'Follow-up Visit'],
  ])('names a %s appointment of a %s subscription "%s" in the confirmation', async (type, subType, label) => {
    mockPrisma.appointment.findUnique.mockResolvedValue({ ...appt({ type: subType }), type } as any)
    await PATCH(makeRequest({ isPaid: true }), makeParams())
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).serviceName).toBe(label)
  })

  it('logs but still succeeds when the confirmation email fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' })
    const res = await PATCH(makeRequest({ isPaid: true }), makeParams())
    expect(res.status).toBe(200)
    expect(errSpy).toHaveBeenCalledWith('send-booking-emails failed:', 500, 'boom', undefined)
  })

  it('awaits the reschedule email', async () => {
    let sent = false
    mockSend.mockImplementation(() => new Promise((r) => setTimeout(() => { sent = true; r({ data: { id: 'e' }, error: null }) }, 15)))
    const res = await PATCH(makeRequest({ reschedule: true, date: '2026-07-01', time: '11:00' }), makeParams())
    expect(res.status).toBe(200)
    expect(sent).toBe(true)
  })

  it('logs but still succeeds when the reschedule email fails', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'rate limited', name: 'rate_limit_exceeded' } })
    const res = await PATCH(makeRequest({ reschedule: true, date: '2026-07-01', time: '11:00' }), makeParams())
    expect(res.status).toBe(200)
    expect(errSpy).toHaveBeenCalledWith('Resend error:', expect.stringContaining('rescheduled'), 'rate limited')
  })

  it('awaits the follow-up email when a session is completed', async () => {
    let sent = false
    mockSend.mockImplementation(() => new Promise((r) => setTimeout(() => { sent = true; r({ data: { id: 'e' }, error: null }) }, 15)))
    const res = await PATCH(makeRequest({ status: 'completed' }), makeParams())
    expect(res.status).toBe(200)
    expect(sent).toBe(true)
  })

  it('returns 502 when resending the follow-up fails', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'bounced', name: 'validation_error' } })
    const res = await PATCH(makeRequest({ resendFollowUp: true }), makeParams())
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ error: 'Invio email fallito' })
  })
})
