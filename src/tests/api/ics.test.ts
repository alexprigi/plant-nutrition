import { describe, it, expect } from 'vitest'
import { generateICS, icsToBase64 } from '@/lib/ics'

describe('generateICS', () => {
  const base = {
    title: 'Consulenza Nutrizionale',
    date: '2026-06-15',
    time: '10:00',
    durationMinutes: 60,
  }

  it('generates valid ICS structure', () => {
    const ics = generateICS(base)
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('END:VCALENDAR')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('END:VEVENT')
  })

  it('includes correct DTSTART', () => {
    const ics = generateICS(base)
    expect(ics).toContain('DTSTART;TZID=Europe/Rome:20260615T100000')
  })

  it('calculates correct DTEND for 60 minutes', () => {
    const ics = generateICS(base)
    expect(ics).toContain('DTEND;TZID=Europe/Rome:20260615T110000')
  })

  it('calculates correct DTEND for 30 minutes', () => {
    const ics = generateICS({ ...base, durationMinutes: 30 })
    expect(ics).toContain('DTEND;TZID=Europe/Rome:20260615T103000')
  })

  it('calculates correct DTEND across hour boundary', () => {
    const ics = generateICS({ ...base, time: '10:45', durationMinutes: 30 })
    expect(ics).toContain('DTEND;TZID=Europe/Rome:20260615T111500')
  })

  it('includes correct SUMMARY', () => {
    const ics = generateICS(base)
    expect(ics).toContain('SUMMARY:Consulenza Nutrizionale')
  })

  it('includes description when provided', () => {
    const ics = generateICS({ ...base, description: 'Note del cliente' })
    expect(ics).toContain('DESCRIPTION:Note del cliente')
  })

  it('does not include DESCRIPTION when not provided', () => {
    const ics = generateICS(base)
    expect(ics).not.toContain('DESCRIPTION:')
  })

  it('includes METHOD:REQUEST', () => {
    const ics = generateICS(base)
    expect(ics).toContain('METHOD:REQUEST')
  })

  it('uses CRLF line endings', () => {
    const ics = generateICS(base)
    expect(ics).toContain('\r\n')
  })
})

describe('icsToBase64', () => {
  it('converts ICS string to base64', () => {
    const ics = 'BEGIN:VCALENDAR\r\nEND:VCALENDAR'
    const b64 = icsToBase64(ics)
    expect(b64).toBe(Buffer.from(ics, 'utf-8').toString('base64'))
  })

  it('returns a non-empty string', () => {
    const ics = generateICS({
      title: 'Test',
      date: '2026-06-15',
      time: '10:00',
      durationMinutes: 60,
    })
    expect(icsToBase64(ics).length).toBeGreaterThan(0)
  })
})
