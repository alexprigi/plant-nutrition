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

  it('uses the follow-up body for follow-up sessions with price 0', async () => {
    await POST(makeRequest({ ...booking, price: 0, paymentMethod: 'none', isFollowUp: true, locale: 'en' }))
    const clientCall = mockSend.mock.calls.find(([p]) => p.to === 'mario@test.com')![0] as any
    expect(clientCall.text).toContain(getT('en').bodyFollowUp)
    expect(clientCall.text).not.toContain(getT('en').bodyFree)
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

  describe('other types and optional fields', () => {
    it('sends the admin cancellation email with and without date/refund', async () => {
      let res = await POST(makeRequest({ ...booking, type: 'cancellation', isRefundable: true }))
      expect(res.status).toBe(200)
      expect(mockSend.mock.calls[0][0].text).toContain('rimborso')
      mockSend.mockClear()
      res = await POST(makeRequest({ clientName: 'M', clientEmail: 'm@t.com', type: 'cancellation' }))
      expect(res.status).toBe(200)
      expect(mockSend.mock.calls[0][0].text).not.toContain('rimborso')
    })

    it('sends the client cancellation email without a date', async () => {
      const res = await POST(makeRequest({ clientName: 'M', clientEmail: 'm@t.com', type: 'cancellation-client' }))
      expect(res.status).toBe(200)
    })

    it('sends the reschedule email with and without dates', async () => {
      let res = await POST(makeRequest({ ...booking, type: 'reschedule', oldDate: '2026-06-15', oldTime: '10:00', newDate: '2026-06-16', newTime: '11:00' }))
      expect(res.status).toBe(200)
      expect(mockSend.mock.calls[0][0].subject).toContain('spostato')
      res = await POST(makeRequest({ clientName: 'M', clientEmail: 'm@t.com', type: 'reschedule' }))
      expect(res.status).toBe(200)
    })

    it('handles a minimal booking (no price, date, time, method, service)', async () => {
      const res = await POST(makeRequest({ clientName: 'M', clientEmail: 'm@t.com' }))
      expect(res.status).toBe(200)
      expect(mockSend.mock.calls[0][0].attachments).toEqual([])
    })

    it('attaches an ICS using durationMinutes and notes, and skips it for pending bank transfers', async () => {
      await POST(makeRequest({ ...booking, durationMinutes: 30, notes: 'n' }))
      expect(mockSend.mock.calls[0][0].attachments).toHaveLength(1)
      mockSend.mockClear()
      await POST(makeRequest({ ...booking, paymentMethod: 'bank_transfer', isPaid: false }))
      expect(mockSend.mock.calls[0][0].attachments).toEqual([])
    })

    it('treats bank transfer as confirmed once paid and defaults isPaid', async () => {
      await POST(makeRequest({ ...booking, paymentMethod: 'bank_transfer', isPaid: true }))
      expect(mockSend.mock.calls[0][0].attachments).toHaveLength(1)
      await POST(makeRequest({ ...booking, isPaid: undefined, paymentMethod: 'paypal' }))
    })

    it('handles a pending bank transfer without service name', async () => {
      const res = await POST(makeRequest({ clientName: 'M', clientEmail: 'm@t.com', paymentMethod: 'bank_transfer' }))
      expect(res.status).toBe(200)
    })

    it('tolerates responses without data', async () => {
      mockSend.mockResolvedValue({ data: null, error: null })
      const res = await POST(makeRequest(booking))
      expect(await res.json()).toEqual({ success: true })
      mockSend.mockResolvedValueOnce({ data: { id: 'c' }, error: null }).mockResolvedValueOnce({ data: null, error: null })
      const res2 = await POST(makeRequest(booking))
      expect(await res2.json()).toEqual({ success: true, clientEmailId: 'c' })
    })

    it('falls back to a generic error message', async () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockSend.mockRejectedValue({})
      const res = await POST(makeRequest(booking))
      expect((await res.json()).error).toBe('Failed to send emails')
      spy.mockRestore()
    })

    it('omits the [TEST] prefix in production', async () => {
      vi.stubEnv('AUTH_URL', 'https://www.vivaplantnutrition.com')
      vi.resetModules()
      const { POST: prodPost } = await import('@/app/api/send-booking-emails/route')
      const { resend: r } = await import('@/lib/email')
      vi.mocked(r.emails.send).mockResolvedValue({ data: { id: 'x' }, error: null } as any)
      await prodPost(makeRequest(booking))
      expect(vi.mocked(r.emails.send).mock.calls[0][0].subject).not.toContain('[TEST]')
      vi.unstubAllEnvs()
    })
  })
})
