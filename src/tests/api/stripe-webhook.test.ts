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

describe('POST /api/stripe-webhook — validation and edge cases', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('AUTH_URL', 'http://localhost:3000')
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => '' })
    mockPrisma.$transaction.mockResolvedValue([] as any)
    mockPrisma.appointment.findUnique.mockResolvedValue({ managementToken: 'tok' } as any)
    mockConstructEvent.mockReturnValue(completedEvent())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('returns 400 when the signature header is missing', async () => {
    const res = await POST(new NextRequest('http://localhost/api/stripe-webhook', { method: 'POST', body: '{}' }))
    expect(res.status).toBe(400)
    expect(mockConstructEvent).not.toHaveBeenCalled()
  })

  it.each([new Error('bad sig'), 'bad sig'])('returns 400 for an invalid signature (%s)', async (err) => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockConstructEvent.mockImplementation(() => { throw err })
    const res = await POST(makeRequest())
    expect(res.status).toBe(400)
    expect(spy).toHaveBeenCalledWith('Webhook signature verification failed:', 'bad sig')
    spy.mockRestore()
  })

  it('ignores other event types', async () => {
    mockConstructEvent.mockReturnValue({ type: 'payment_intent.created', data: { object: {} } })
    const res = await POST(makeRequest())
    expect(await res.json()).toEqual({ received: true })
    expect(mockPrisma.$transaction).not.toHaveBeenCalled()
  })

  it('returns 200 without side effects when unpaid', async () => {
    const ev = completedEvent()
    ;(ev.data.object as any).payment_status = 'unpaid'
    mockConstructEvent.mockReturnValue(ev)
    const res = await POST(makeRequest())
    expect(res.status).toBe(200)
    expect(mockPrisma.$transaction).not.toHaveBeenCalled()
  })

  it.each([
    ['subscriptionId', { subscriptionId: '' }],
    ['appointmentId', { appointmentId: '' }],
  ])('returns 400 when %s metadata is missing', async (_n, md) => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockConstructEvent.mockReturnValue(completedEvent(md))
    const res = await POST(makeRequest())
    expect(res.status).toBe(400)
    expect(mockPrisma.$transaction).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('returns 400 when metadata is undefined', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const ev = completedEvent()
    ;(ev.data.object as any).metadata = undefined
    mockConstructEvent.mockReturnValue(ev)
    expect((await POST(makeRequest())).status).toBe(400)
    spy.mockRestore()
  })

  it('handles missing optional metadata, null amount, missing appointment and no AUTH_URL', async () => {
    vi.unstubAllEnvs()
    delete process.env.AUTH_URL
    const ev = completedEvent()
    const obj = ev.data.object as any
    obj.amount_total = null
    obj.metadata = { subscriptionId: 'sub_1', appointmentId: 'appt_1' }
    mockConstructEvent.mockReturnValue(ev)
    mockPrisma.appointment.findUnique.mockResolvedValue(null)
    const res = await POST(makeRequest())
    expect(res.status).toBe(200)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:3000/api/send-booking-emails')
    expect(JSON.parse(init.body)).toMatchObject({ price: 0, durationMinutes: 60 })
  })

  it('strips a trailing slash from AUTH_URL', async () => {
    vi.stubEnv('AUTH_URL', 'https://example.com/')
    await POST(makeRequest())
    expect(fetchMock.mock.calls[0][0]).toBe('https://example.com/api/send-booking-emails')
  })

  it('logs an empty body when reading the error response fails', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockResolvedValue({ ok: false, status: 502, text: async () => { throw new Error('x') } })
    const res = await POST(makeRequest())
    expect(res.status).toBe(200)
    expect(spy).toHaveBeenCalledWith('send-booking-emails failed:', 502, '', 'appointmentId:', 'appt_1')
    spy.mockRestore()
  })
})
