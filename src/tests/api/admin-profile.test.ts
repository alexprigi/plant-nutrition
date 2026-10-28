import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, PATCH } from '@/app/api/admin/profile/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const mockPrisma = vi.mocked(prisma, { deep: true })
const mockAuth = vi.mocked(auth) as unknown as ReturnType<typeof vi.fn>

const req = (body: object) =>
  new NextRequest('http://localhost/api/admin/profile', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

describe('/api/admin/profile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { email: 'a@t.com' } })
  })

  it('GET 401', async () => {
    mockAuth.mockResolvedValue(null)
    expect((await GET()).status).toBe(401)
  })

  it('GET returns user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', name: 'A', email: 'a@t.com' } as any)
    const res = await GET()
    expect(await res.json()).toEqual({ id: '1', name: 'A', email: 'a@t.com' })
  })

  it('PATCH 401', async () => {
    mockAuth.mockResolvedValue({ user: {} })
    expect((await PATCH(req({ name: 'x' }))).status).toBe(401)
  })

  it('PATCH 400 on empty / missing name', async () => {
    expect((await PATCH(req({ name: '   ' }))).status).toBe(400)
    expect((await PATCH(req({}))).status).toBe(400)
  })

  it('PATCH updates trimmed name', async () => {
    mockPrisma.user.update.mockResolvedValue({ id: '1', name: 'Bob', email: 'a@t.com' } as any)
    const res = await PATCH(req({ name: '  Bob ' }))
    expect(res.status).toBe(200)
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { name: 'Bob' } }),
    )
  })
})
