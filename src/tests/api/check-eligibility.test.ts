import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/clients/check-eligibility/route'
import { prisma } from '@/lib/prisma'

const mockPrisma = vi.mocked(prisma)

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/clients/check-eligibility', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

describe('POST /api/clients/check-eligibility', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns eligible: true when email does not exist', async () => {
    mockPrisma.client.findUnique.mockResolvedValue(null)

    const res = await POST(makeRequest({ email: 'nuovo@test.com' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ eligible: true })
  })

  it('returns eligible: false when email already exists', async () => {
    mockPrisma.client.findUnique.mockResolvedValue({ id: '1', email: 'esistente@test.com' } as any)

    const res = await POST(makeRequest({ email: 'esistente@test.com' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ eligible: false, reason: 'already_customer' })
  })

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({}))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('lowercases email before querying', async () => {
    mockPrisma.client.findUnique.mockResolvedValue(null)

    await POST(makeRequest({ email: 'TEST@EXAMPLE.COM' }))

    expect(mockPrisma.client.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ email: 'test@example.com' }),
      }),
    )
  })
})
