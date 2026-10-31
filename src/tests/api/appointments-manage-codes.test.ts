import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/appointments/manage/route'
import { prisma } from '@/lib/prisma'

const mockPrisma = vi.mocked(prisma, { deep: true })

function dateInDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

const makeGet = (query = '') => new NextRequest(`http://localhost/api/appointments/manage${query}`)
const makePost = (body: object) =>
  new NextRequest('http://localhost/api/appointments/manage', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

const appointment = (overrides = {}) => ({
  id: 'appt_1', date: dateInDays(10), time: '10:00', status: 'CONFIRMED', notes: '', locale: 'en',
  managementToken: 'tok', rescheduleCount: 0, rescheduleCountRestricted: 0, isDeleted: false,
  client: { name: 'Mario', surname: 'Rossi', email: 'mario@test.com' },
  subscription: { paymentMethod: 'STRIPE', isPaid: true, price: 85, type: 'SINGLE_SESSION' },
  ...overrides,
})

// Il front-end traduce gli errori a partire dal `code`: il testo italiano resta solo come fallback.
describe('appointments/manage — machine-readable error codes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    mockPrisma.appointment.update.mockResolvedValue({} as any)
  })

  const get = async (appt: unknown, query = '?token=tok') => {
    mockPrisma.appointment.findUnique.mockResolvedValue(appt as any)
    const res = await GET(makeGet(query))
    return { status: res.status, body: await res.json() }
  }
  const post = async (appt: unknown, body: object) => {
    mockPrisma.appointment.findUnique.mockResolvedValue(appt as any)
    const res = await POST(makePost(body))
    return { status: res.status, body: await res.json() }
  }

  describe('GET', () => {
    it('missingToken', async () => {
      const res = await GET(makeGet())
      expect(res.status).toBe(400)
      expect((await res.json()).code).toBe('missingToken')
    })

    it.each([
      ['notFound', null, 404],
      ['alreadyCancelled', appointment({ status: 'CANCELLED' }), 410],
      ['alreadyCompleted', appointment({ status: 'COMPLETED' }), 410],
    ])('%s', async (code, appt, status) => {
      const r = await get(appt)
      expect(r.status).toBe(status)
      expect(r.body.code).toBe(code)
      expect(typeof r.body.error).toBe('string')
    })

    it('returns the appointment locale so the page can pick the language', async () => {
      const r = await get(appointment({ locale: 'en' }))
      expect(r.status).toBe(200)
      expect(r.body.locale).toBe('en')
    })
  })

  describe('POST', () => {
    it('missingParams', async () => {
      const r = await post(appointment(), { action: 'cancel' })
      expect(r.status).toBe(400)
      expect(r.body.code).toBe('missingParams')
    })

    it('notFound', async () => {
      const r = await post(null, { token: 't', action: 'cancel' })
      expect(r.status).toBe(404)
      expect(r.body.code).toBe('notFound')
    })

    it('notAllowed on a completed appointment', async () => {
      const r = await post(appointment({ status: 'COMPLETED' }), { token: 't', action: 'cancel' })
      expect(r.status).toBe(409)
      expect(r.body.code).toBe('notAllowed')
    })

    it('cancelTooLate for a paid appointment within 7 days', async () => {
      const r = await post(appointment({ date: dateInDays(3) }), { token: 't', action: 'cancel' })
      expect(r.status).toBe(403)
      expect(r.body.code).toBe('cancelTooLate')
    })

    it('dateTimeRequired', async () => {
      const r = await post(appointment(), { token: 't', action: 'reschedule' })
      expect(r.status).toBe(400)
      expect(r.body.code).toBe('dateTimeRequired')
    })

    it('rescheduleTooLate within 24 hours', async () => {
      const r = await post(appointment({ date: dateInDays(0) }), { token: 't', action: 'reschedule', date: dateInDays(12), time: '10:00' })
      expect(r.status).toBe(403)
      expect(r.body.code).toBe('rescheduleTooLate')
    })

    it('rescheduleLimit after three reschedules', async () => {
      const r = await post(appointment({ rescheduleCount: 3 }), { token: 't', action: 'reschedule', date: dateInDays(12), time: '10:00' })
      expect(r.status).toBe(403)
      expect(r.body.code).toBe('rescheduleLimit')
    })

    it('rescheduleRestrictedLimit in the 1-7 day window', async () => {
      const r = await post(appointment({ date: dateInDays(4), rescheduleCountRestricted: 1 }), { token: 't', action: 'reschedule', date: dateInDays(12), time: '10:00' })
      expect(r.status).toBe(403)
      expect(r.body.code).toBe('rescheduleRestrictedLimit')
    })

    it('invalidAction', async () => {
      const r = await post(appointment(), { token: 't', action: 'bogus' })
      expect(r.status).toBe(400)
      expect(r.body.code).toBe('invalidAction')
    })
  })
})
