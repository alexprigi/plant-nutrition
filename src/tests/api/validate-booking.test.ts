import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/validate-booking/route'

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/validate-booking', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

const valid = {
  name: 'Mario', surname: 'Rossi', email: 'Mario@Test.com', phone: '+39 333 1234567',
  address: 'Via Roma', civicNumber: '1', city: 'Milano', zipCode: '20100',
  country: 'Italia', fiscalCode: 'rssmra80a01f205x', notes: 'ok',
}

describe('POST /api/validate-booking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns sanitized data for valid input', async () => {
    const res = await POST(makeRequest({ ...valid, notes: '<b>hi</b> "x"' }))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.valid).toBe(true)
    expect(data.sanitized.email).toBe('mario@test.com')
    expect(data.sanitized.fiscalCode).toBe('RSSMRA80A01F205X')
    expect(data.sanitized.notes).toBe('hi x')
  })

  it('returns empty notes when none provided', async () => {
    const data = await (await POST(makeRequest({ ...valid, notes: undefined }))).json()
    expect(data.sanitized.notes).toBe('')
  })

  it('reports all required-field errors (default locale de)', async () => {
    const res = await POST(makeRequest({}))
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(Object.keys(data.errors).sort()).toEqual(
      ['address', 'city', 'civicNumber', 'email', 'fiscalCode', 'name', 'phone', 'surname', 'zipCode'],
    )
    expect(data.errors.name).toBe('Vorname ist erforderlich')
  })

  it('treats whitespace-only values as missing', async () => {
    const blank = Object.fromEntries(Object.keys(valid).map((k) => [k, '   ']))
    const res = await POST(makeRequest({ ...blank, notes: undefined, locale: 'it' }))
    const data = await res.json()
    expect(data.errors.name).toBe('Il nome è obbligatorio')
    expect(data.errors.civicNumber).toBe('Il numero civico è obbligatorio')
  })

  it('reports too-long and invalid format errors (en)', async () => {
    const long = 'a'.repeat(300)
    const res = await POST(makeRequest({
      ...valid, locale: 'en', name: long, surname: long, email: 'bad', phone: '12',
      address: long, city: long, zipCode: '1', fiscalCode: '!!', notes: long + long,
    }))
    const data = await res.json()
    expect(data.errors).toMatchObject({
      name: 'First name is too long',
      surname: 'Last name is too long',
      email: 'Please enter a valid email address',
      phone: 'The phone number is invalid',
      address: 'Address is too long',
      city: 'City name is too long',
      zipCode: 'Postal code is invalid',
      fiscalCode: 'Tax ID is invalid',
      notes: 'Message cannot exceed 500 characters',
    })
  })

  it('falls back to default locale for unknown locale', async () => {
    const data = await (await POST(makeRequest({ locale: 'xx' }))).json()
    expect(data.errors.name).toBe('Vorname ist erforderlich')
  })

  it('returns 500 on malformed body', async () => {
    const req = new NextRequest('http://localhost/api/validate-booking', { method: 'POST', body: 'not json' })
    const res = await POST(req)
    expect(res.status).toBe(500)
    expect((await res.json()).valid).toBe(false)
  })

  it('returns 500 when a sanitize step throws (country missing)', async () => {
    const { country, ...rest } = valid
    const res = await POST(makeRequest(rest))
    expect(res.status).toBe(500)
  })
})
