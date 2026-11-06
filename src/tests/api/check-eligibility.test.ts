import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/clients/check-eligibility/route'
import { prisma } from '@/lib/prisma'

const mockPrisma = vi.mocked(prisma, { deep: true })

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/clients/check-eligibility', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

describe('POST /api/clients/check-eligibility', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns eligible: true when the email has no live subscription', async () => {
    mockPrisma.subscription.findFirst.mockResolvedValue(null)

    const res = await POST(makeRequest({ email: 'nuovo@test.com' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ eligible: true })
  })

  it('returns eligible: false when the email already has a subscription that is not cancelled', async () => {
    mockPrisma.subscription.findFirst.mockResolvedValue({ id: 'sub_1' } as any)

    const res = await POST(makeRequest({ email: 'esistente@test.com' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ eligible: false, reason: 'already_customer' })
  })

  it('ignores cancelled subscriptions, so an abandoned checkout does not count as a purchase', async () => {
    mockPrisma.subscription.findFirst.mockResolvedValue(null)

    await POST(makeRequest({ email: 'abbandonato@test.com' }))

    expect(mockPrisma.subscription.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: { not: 'CANCELLED' } }) }),
    )
  })

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({}))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('lowercases email before querying and skips deleted clients', async () => {
    mockPrisma.subscription.findFirst.mockResolvedValue(null)

    await POST(makeRequest({ email: 'TEST@EXAMPLE.COM' }))

    expect(mockPrisma.subscription.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ client: { email: 'test@example.com', isDeleted: false } }),
      }),
    )
  })
})

describe('POST /api/clients/check-eligibility - errors', () => {
  it('returns 500 when the database fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockPrisma.subscription.findFirst.mockRejectedValue(new Error('db'))
    const res = await POST(makeRequest({ email: 'a@b.com' }))
    expect(res.status).toBe(500)
  })
})
