import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/create-checkout-session/route'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

vi.mock('@/lib/stripe', () => ({
  stripe: { checkout: { sessions: { create: vi.fn() } } },
}))

const mockPrisma = vi.mocked(prisma, { deep: true })
const mockStripeCreate = vi.mocked(stripe.checkout.sessions.create)

const baseDTO = {
  name: 'Mario', surname: 'Rossi', email: 'Mario@Test.com',
  phone: '+39 333 1234567', address: 'Via Roma', civicNumber: '1',
  city: 'Milano', zipCode: '20100', country: 'Italia', fiscalCode: 'RSSMRA80A01F205X',
  commercialType: 'first-visit', paymentMethod: 'stripe',
  selectedDate: '2026-05-01', selectedTime: '10:00',
  notes: 'nota', locale: 'it', durationMinutes: 45,
}

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

let tx: any

describe('POST /api/create-checkout-session', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('AUTH_URL', 'http://localhost:3000/')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    tx = {
      client: { upsert: vi.fn().mockResolvedValue({ id: 'cli_1' }) },
      subscription: { create: vi.fn().mockResolvedValue({ id: 'sub_1' }) },
      appointment: { create: vi.fn().mockResolvedValue({ id: 'appt_1' }) },
    }
    mockPrisma.$transaction.mockImplementation(async (arg: any) =>
      typeof arg === 'function' ? arg(tx) : Promise.all(arg),
    )
    mockStripeCreate.mockResolvedValue({ id: 'cs_1', url: 'https://stripe.test/cs_1' } as any)
    mockPrisma.subscription.update.mockResolvedValue({} as any)
    mockPrisma.appointment.delete = vi.fn().mockResolvedValue({}) as any
    ;(mockPrisma.subscription as any).delete = vi.fn().mockResolvedValue({})
  })

  it.each([
    ['free-consultation', 'FREE_CONSULTATION', 0, false],
    ['follow-up', 'SINGLE_SESSION', 50, false],
    ['first-visit', 'SINGLE_SESSION', 85, false],
    ['plan-3-months', 'BUNDLE_3_MONTHS', 237, true],
    ['plan-6-months', 'BUNDLE_6_MONTHS', 450, true],
  ])('handles %s', async (commercialType, type, price, hasExpiry) => {
    const res = await POST(makeRequest({ ...baseDTO, commercialType }))
    const data = await res.json()
    expect(res.status).toBe(201)
    expect(data.url).toBe('https://stripe.test/cs_1')
    const sub = tx.subscription.create.mock.calls[0][0].data
    expect(sub.type).toBe(type)
    expect(sub.price).toBe(price)
    expect('expiresAt' in sub).toBe(hasExpiry)
    expect((mockStripeCreate.mock.calls[0][0] as any).line_items[0].price_data.unit_amount).toBe(price * 100)
    expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
      where: { id: 'sub_1' },
      data: { stripeSessionId: 'cs_1' },
    })
  })

  it('sets 3 and 6 month bundle expiry correctly', async () => {
    await POST(makeRequest({ ...baseDTO, commercialType: 'plan-3-months' }))
    const d3 = tx.subscription.create.mock.calls[0][0].data.expiresAt as Date
    expect(d3.getTime()).toBeGreaterThan(Date.now() + 179 * 86400000)
    await POST(makeRequest({ ...baseDTO, commercialType: 'plan-6-months' }))
    const d6 = tx.subscription.create.mock.calls[1][0].data.expiresAt as Date
    expect(d6.getTime()).toBeGreaterThan(Date.now() + 359 * 86400000)
  })

  it.each([
    ['paypal', 'PAYPAL'],
    ['bank_transfer', 'BANK_TRANSFER'],
    ['none', 'NONE'],
    ['stripe', 'STRIPE'],
    ['weird', 'NONE'],
  ])('maps payment method %s', async (paymentMethod, expected) => {
    await POST(makeRequest({ ...baseDTO, paymentMethod }))
    expect(tx.subscription.create.mock.calls[0][0].data.paymentMethod).toBe(expected)
  })

  it('uses valid locale in URLs and strips trailing slash from AUTH_URL', async () => {
    await POST(makeRequest({ ...baseDTO, locale: 'en' }))
    const arg = mockStripeCreate.mock.calls[0][0] as any
    expect(arg.success_url).toBe('http://localhost:3000/en/booking/success?session_id={CHECKOUT_SESSION_ID}')
    expect(arg.cancel_url).toBe('http://localhost:3000/en/booking?cancelled=true')
    expect(arg.metadata.durationMinutes).toBe('45')
    expect(arg.customer_email).toBe('Mario@Test.com')
  })

  it('falls back to default locale for invalid locale, default duration, empty notes', async () => {
    await POST(makeRequest({ ...baseDTO, locale: 'xx', durationMinutes: undefined, notes: undefined }))
    const arg = mockStripeCreate.mock.calls[0][0] as any
    expect(arg.success_url).toContain('/de/booking/success')
    expect(arg.cancel_url).toContain('/de/booking?cancelled=true')
    expect(arg.metadata.durationMinutes).toBe('60')
    expect(arg.metadata.notes).toBe('')
    expect(tx.appointment.create.mock.calls[0][0].data.notes).toBe('')
  })

  it('truncates long notes in Stripe metadata', async () => {
    await POST(makeRequest({ ...baseDTO, notes: 'x'.repeat(800) }))
    expect((mockStripeCreate.mock.calls[0][0] as any).metadata.notes).toHaveLength(500)
  })

  it('uses localhost default when AUTH_URL is unset', async () => {
    vi.stubEnv('AUTH_URL', '')
    await POST(makeRequest(baseDTO))
    expect((mockStripeCreate.mock.calls[0][0] as any).success_url).toMatch(/^http:\/\/localhost:3000\//)
  })

  it('rolls back DB records and returns 500 when Stripe fails', async () => {
    mockStripeCreate.mockRejectedValue(new Error('stripe down'))
    const res = await POST(makeRequest(baseDTO))
    expect(res.status).toBe(500)
    expect(mockPrisma.appointment.delete).toHaveBeenCalledWith({ where: { id: 'appt_1' } })
    expect((mockPrisma.subscription as any).delete).toHaveBeenCalledWith({ where: { id: 'sub_1' } })
    expect(mockPrisma.subscription.update).not.toHaveBeenCalled()
  })

  it('still returns 500 when rollback itself fails', async () => {
    mockStripeCreate.mockRejectedValue(new Error('stripe down'))
    mockPrisma.$transaction.mockImplementation(async (arg: any) => {
      if (typeof arg === 'function') return arg(tx)
      throw new Error('rollback failed')
    })
    const res = await POST(makeRequest(baseDTO))
    expect(res.status).toBe(500)
  })

  it('returns 500 when the DB transaction fails', async () => {
    mockPrisma.$transaction.mockRejectedValue(new Error('db'))
    const res = await POST(makeRequest(baseDTO))
    expect(res.status).toBe(500)
    expect(mockStripeCreate).not.toHaveBeenCalled()
  })
})
