import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getSubscriptionLabel, getAppointmentLabel, checkEligibility, createFullBooking, getAdminAppointments,
  updateAppointmentStatus, markSubscriptionAsPaid, rescheduleAppointment, resendFollowUpLink,
  type CreateBookingDTO, type SubscriptionType,
} from '@/lib/bookingService'

const fetchMock = vi.fn()
beforeEach(() => { fetchMock.mockReset(); vi.stubGlobal('fetch', fetchMock) })
afterEach(() => vi.unstubAllGlobals())

describe('getSubscriptionLabel', () => {
  it('covers every type including default', () => {
    const types = ['free-consultation', 'single-session', 'bundle-3-months', 'bundle-6-months', 'unknown'] as SubscriptionType[]
    const labels = types.map((t) => getSubscriptionLabel(t, 'en'))
    expect(new Set(labels).size).toBe(5)
    expect(labels[4]).toBe('Service')
  })
})

describe('checkEligibility', () => {
  it('posts the email and returns json', async () => {
    fetchMock.mockResolvedValue({ json: async () => ({ eligible: true }) })
    const signal = new AbortController().signal
    expect(await checkEligibility('a@b.c', signal)).toEqual({ eligible: true })
    expect(fetchMock).toHaveBeenCalledWith('/api/clients/check-eligibility', expect.objectContaining({ method: 'POST', signal }))
  })
})

describe('createFullBooking', () => {
  const dto = { name: 'a' } as unknown as CreateBookingDTO
  it('returns json on success', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) })
    expect(await createFullBooking(dto)).toEqual({ id: 1 })
  })
  it('throws on failure', async () => {
    fetchMock.mockResolvedValue({ ok: false })
    await expect(createFullBooking(dto)).rejects.toThrow('Failed to create booking')
  })
})

describe('getAdminAppointments', () => {
  it('returns json on success', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [{ id: 'x' }] })
    expect(await getAdminAppointments()).toEqual([{ id: 'x' }])
  })
  it('throws on failure', async () => {
    fetchMock.mockResolvedValue({ ok: false })
    await expect(getAdminAppointments()).rejects.toThrow('Failed to fetch appointments')
  })
})

describe.each([
  ['updateAppointmentStatus', () => updateAppointmentStatus('1', 'confirmed'), { status: 'confirmed' }],
  ['markSubscriptionAsPaid', () => markSubscriptionAsPaid('1'), { isPaid: true }],
  ['rescheduleAppointment', () => rescheduleAppointment('1', '2026-06-15', '10:00'), { reschedule: true, date: '2026-06-15', time: '10:00' }],
  ['resendFollowUpLink', () => resendFollowUpLink('1'), { resendFollowUp: true }],
])('%s', (_n, call, body) => {
  it('returns response.ok and PATCHes the body', async () => {
    fetchMock.mockResolvedValue({ ok: true })
    expect(await call()).toBe(true)
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/appointments/1', expect.objectContaining({ method: 'PATCH', body: JSON.stringify(body) }))
    fetchMock.mockResolvedValue({ ok: false })
    expect(await call()).toBe(false)
  })
})

describe('getAppointmentLabel', () => {
  it('uses the appointment type, not only the subscription type', () => {
    expect(getAppointmentLabel('FIRST_VISIT', 'single-session', 'en')).toBe('Full First Visit')
    expect(getAppointmentLabel('FOLLOW_UP', 'single-session', 'de')).toBe('Kontrolltermin')
    expect(getAppointmentLabel('FOLLOW_UP', 'bundle-3-months', 'it')).toBe('Visita di Controllo')
    expect(getAppointmentLabel('FREE_CONSULTATION', 'free-consultation', 'en')).toBe('Free Consultation')
  })

  it('names the first visit of a bundle after the bundle', () => {
    expect(getAppointmentLabel('FIRST_VISIT', 'bundle-3-months', 'en')).toBe('3-Month Program')
    expect(getAppointmentLabel('FIRST_VISIT', 'bundle-6-months', 'de')).toBe('6-Monats-VIP-Programm')
  })

  it('falls back to the default locale', () => {
    expect(getAppointmentLabel('FIRST_VISIT', 'single-session')).toBe('Vollständige Erstberatung')
  })
})
