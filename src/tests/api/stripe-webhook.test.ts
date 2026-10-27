import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/stripe-webhook/route'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

const mockPrisma = vi.mocked(prisma, { deep: true })

vi.mock('@/lib/stripe', () => ({
  stripe: { webhooks: { constructEvent: vi.fn() } },
}))

const mockConstructEvent = vi.mocked(stripe.webhooks.constructEvent) as unknown as ReturnType<typeof vi.fn>

const makeRequest = () =>
  new NextRequest('http://localhost/api/stripe-webhook', {
    method: 'POST',
    body: '{}',
    headers: { 'stripe-signature': 'sig' },
  })

const completedEvent = (metadata: Record<string, string> = {}) => ({
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_1',
      payment_status: 'paid',
      amount_total: 8500,
      metadata: {
        subscriptionId: 'sub_1', appointmentId: 'appt_1', clientEmail: 'mario@test.com',
        serviceName: 'Svc', date: '2026-06-15', time: '10:00', durationMinutes: '60',
        clientName: 'Mario Rossi', clientPhone: '+39 333', notes: '', locale: 'en',
        ...metadata,
      },
    },
  },
})

describe('POST /api/stripe-webhook — confirmation email', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('AUTH_URL', 'http://localhost:3000')
    vi.stubGlobal('fetch', fetchMock)
    mockPrisma.$transaction.mockResolvedValue([] as any)
    mockPrisma.appointment.findUnique.mockResolvedValue({ managementToken: 'tok' } as any)
    mockConstructEvent.mockReturnValue(completedEvent())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('forwards the locale from the session metadata to send-booking-emails', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => '' })
    const res = await POST(makeRequest())
    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:3000/api/send-booking-emails')
    expect(JSON.parse(init.body)).toMatchObject({ locale: 'en', managementToken: 'tok', price: 85 })
  })

  it('awaits the email request before responding', async () => {
    let resolved = false
    fetchMock.mockImplementation(
      () => new Promise((r) => setTimeout(() => { resolved = true; r({ ok: true, status: 200, text: async () => '' }) }, 20)),
    )
    await POST(makeRequest())
    expect(resolved).toBe(true)
  })

  it('logs status and appointment when send-booking-emails returns an error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' })
    const res = await POST(makeRequest())
    expect(res.status).toBe(200)
    expect(spy).toHaveBeenCalledWith('send-booking-emails failed:', 500, 'boom', 'appointmentId:', 'appt_1')
    spy.mockRestore()
  })

  it('logs and still returns 200 when the request throws', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockRejectedValue(new Error('network'))
    const res = await POST(makeRequest())
    expect(res.status).toBe(200)
    expect(spy).toHaveBeenCalledWith('Failed to send booking emails:', expect.any(Error))
    spy.mockRestore()
  })

  it('does not call send-booking-emails when payment is not paid', async () => {
    const ev = completedEvent()
    ;(ev.data.object as any).payment_status = 'unpaid'
    mockConstructEvent.mockReturnValue(ev)
    await POST(makeRequest())
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
