import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { PATCH } from '@/app/api/admin/password/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const mockPrisma = vi.mocked(prisma)
const mockAuth = vi.mocked(auth)

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/admin/password', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

describe('PATCH /api/admin/password', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null as any)

    const res = await PATCH(makeRequest({ currentPassword: 'old', newPassword: 'newpass123' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when current password is wrong', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@test.com' } } as any)
    const hashed = await bcrypt.hash('correctpassword', 1)
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', password: hashed } as any)

    const res = await PATCH(makeRequest({ currentPassword: 'wrongpassword', newPassword: 'newpass123' }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toContain('non corretta')
  })

  it('returns 400 when new password is too short', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@test.com' } } as any)

    const res = await PATCH(makeRequest({ currentPassword: 'current', newPassword: 'short' }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toContain('8 caratteri')
  })

  it('updates password successfully', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@test.com' } } as any)
    const hashed = await bcrypt.hash('currentpass', 1)
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', password: hashed } as any)
    mockPrisma.user.update.mockResolvedValue({} as any)

    const res = await PATCH(makeRequest({ currentPassword: 'currentpass', newPassword: 'newpassword123' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockPrisma.user.update).toHaveBeenCalledOnce()
  })
})
