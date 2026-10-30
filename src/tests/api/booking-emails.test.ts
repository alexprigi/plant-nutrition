import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { postBookingEmail, sendClientEmail } from '@/lib/booking-emails'
import { resend } from '@/lib/email'

const mockSend = vi.mocked(resend.emails.send) as unknown as ReturnType<typeof vi.fn>
const params = { from: 'a@b.c', to: 'x@y.z', subject: 'Subj', html: '<p>x</p>' }

describe('postBookingEmail', () => {
  const fetchMock = vi.fn()
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('AUTH_URL', 'http://localhost:3000')
    vi.stubGlobal('fetch', fetchMock)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('posts the payload to send-booking-emails and returns true on success', async () => {
    fetchMock.mockResolvedValue({ ok: true })
    expect(await postBookingEmail({ type: 'booking', a: 1 })).toBe(true)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:3000/api/send-booking-emails')
    expect(JSON.parse(init.body)).toEqual({ type: 'booking', a: 1 })
  })

  it('logs and returns false on a non-2xx answer', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' })
    expect(await postBookingEmail({ type: 'cancellation' })).toBe(false)
    expect(spy).toHaveBeenCalledWith('send-booking-emails failed:', 500, 'boom', 'cancellation')
    spy.mockRestore()
  })

  it('logs with an empty body when the error body cannot be read', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockResolvedValue({ ok: false, status: 502, text: async () => { throw new Error('x') } })
    expect(await postBookingEmail({})).toBe(false)
    expect(spy).toHaveBeenCalledWith('send-booking-emails failed:', 502, '', undefined)
    spy.mockRestore()
  })

  it('logs and returns false on network errors', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockRejectedValue(new Error('network'))
    expect(await postBookingEmail({})).toBe(false)
    expect(spy).toHaveBeenCalledWith('Failed to send booking email:', expect.any(Error))
    spy.mockRestore()
  })
})

describe('sendClientEmail', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns true when Resend accepts the email', async () => {
    mockSend.mockResolvedValue({ data: { id: 'e' }, error: null })
    expect(await sendClientEmail(params)).toBe(true)
    expect(mockSend).toHaveBeenCalledWith(params)
  })

  it('logs and returns false when Resend reports an error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockSend.mockResolvedValue({ data: null, error: { message: 'domain not verified', name: 'validation_error' } })
    expect(await sendClientEmail(params)).toBe(false)
    expect(spy).toHaveBeenCalledWith('Resend error:', 'Subj', 'domain not verified')
    spy.mockRestore()
  })

  it('logs and returns false when Resend throws', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockSend.mockRejectedValue(new Error('network'))
    expect(await sendClientEmail(params)).toBe(false)
    expect(spy).toHaveBeenCalledWith('Failed to send email:', 'Subj', expect.any(Error))
    spy.mockRestore()
  })
})
