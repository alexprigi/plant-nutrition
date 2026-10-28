import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/send-contact-email/route'

vi.mock('@/lib/email', () => ({
  resend: { emails: { send: vi.fn() } },
}))

import { resend } from '@/lib/email'
const mockSend = vi.mocked(resend.emails.send)

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/send-contact-email', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

const valid = { nome: 'Mario', email: 'm@test.com', servizio: 'workshop', messaggio: 'Ciao', telefono: '123' }

describe('POST /api/send-contact-email', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSend.mockResolvedValue({ data: { id: 'x' }, error: null } as any)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it.each(['nome', 'email', 'servizio', 'messaggio'])('returns 400 when %s is missing', async (field) => {
    const res = await POST(makeRequest({ ...valid, [field]: '' }))
    expect(res.status).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('sends email with mapped service label', async () => {
    const res = await POST(makeRequest(valid))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    const arg = mockSend.mock.calls[0][0] as any
    expect(arg.subject).toContain('Workshop')
    expect(arg.replyTo).toBe('m@test.com')
    expect(arg.text).toContain('Telefono: 123')
  })

  it('uses raw servizio when unmapped and dash when phone missing', async () => {
    const res = await POST(makeRequest({ ...valid, servizio: 'custom', telefono: undefined }))
    expect(res.status).toBe(200)
    const arg = mockSend.mock.calls[0][0] as any
    expect(arg.subject).toContain('custom')
    expect(arg.text).toContain('Telefono: —')
  })

  it('returns 500 with error message when send fails', async () => {
    mockSend.mockRejectedValue(new Error('boom'))
    const res = await POST(makeRequest(valid))
    expect(res.status).toBe(500)
    expect((await res.json()).error).toBe('boom')
  })

  it('returns default error message when error has no message', async () => {
    mockSend.mockRejectedValue({})
    const res = await POST(makeRequest(valid))
    expect((await res.json()).error).toBe('Errore invio email')
  })
})
