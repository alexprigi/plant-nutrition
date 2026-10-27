import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/send-booking-emails/route'
import { resend } from '@/lib/email'
import { getT } from '@/lib/email-templates/email-i18n'

vi.mock('@/lib/email', () => ({
  resend: { emails: { send: vi.fn() } },
}))

const mockSend = vi.mocked(resend.emails.send) as unknown as ReturnType<typeof vi.fn>

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/send-booking-emails', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

const booking = {
  clientName: 'Mario Rossi', clientEmail: 'mario@test.com', clientPhone: '+39 333',
  serviceName: 'Svc', price: 85, date: '2026-06-15', time: '10:00',
  paymentMethod: 'stripe', isPaid: true,
}

describe('POST /api/send-booking-emails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSend.mockResolvedValue({ data: { id: 'email_1' }, error: null })
  })

  it.each(['it', 'de', 'en'] as const)('sends client confirmation subject in %s', async (locale) => {
    const res = await POST(makeRequest({ ...booking, locale }))
    expect(res.status).toBe(200)
    const clientCall = mockSend.mock.calls.find(([p]) => p.to === 'mario@test.com')![0]
    expect(clientCall.subject).toContain(getT(locale).subjConfirm('Svc'))
  })

  it('uses the bank transfer request subject for pending bank transfers', async () => {
    await POST(makeRequest({ ...booking, paymentMethod: 'bank_transfer', isPaid: false, locale: 'en' }))
    const clientCall = mockSend.mock.calls.find(([p]) => p.to === 'mario@test.com')![0]
    expect(clientCall.subject).toContain(getT('en').subjBankRequest('Svc'))
  })

  it('keeps admin emails in Italian regardless of locale', async () => {
    await POST(makeRequest({ ...booking, locale: 'en' }))
    const adminCall = mockSend.mock.calls.find(([p]) => p.to === 'info@vivaplantnutrition.com')![0]
    expect(adminCall.subject).toContain('Nuova Prenotazione')
  })

  it('localizes the client cancellation subject', async () => {
    await POST(makeRequest({ ...booking, type: 'cancellation-client', locale: 'de' }))
    expect(mockSend.mock.calls[0][0].subject).toContain(getT('de').subjCancelConfirmed)
  })

  it('returns 500 when Resend reports an error for the client email', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockSend.mockResolvedValue({ data: null, error: { message: 'domain not verified', name: 'validation_error' } })
    const res = await POST(makeRequest(booking))
    const data = await res.json()
    expect(res.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toContain('domain not verified')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('returns 500 when only the admin email fails', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockSend
      .mockResolvedValueOnce({ data: { id: 'c' }, error: null })
      .mockResolvedValueOnce({ data: null, error: { message: 'rate limited', name: 'rate_limit_exceeded' } })
    const res = await POST(makeRequest(booking))
    expect(res.status).toBe(500)
    spy.mockRestore()
  })
})
