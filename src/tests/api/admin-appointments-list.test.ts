import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/admin/appointments/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const mockPrisma = vi.mocked(prisma, { deep: true })
const mockAuth = vi.mocked(auth) as unknown as ReturnType<typeof vi.fn>

const d = new Date('2026-01-01T10:00:00.000Z')
const row = (type: string, followUpToken: string | null, expiresAt: Date | null) => ({
  id: 'a1',
  date: '2026-06-15',
  time: '10:00',
  status: 'CONFIRMED',
  notes: '',
  managementToken: 't',
  rescheduleCount: 0,
  createdAt: d,
  updatedAt: d,
  client: {
    id: 'c1', name: 'Mario', surname: 'Rossi', email: 'm@t.com', phone: '1',
    address: 'Via Roma', civicNumber: '1', zipCode: '00100', city: 'Roma',
    fiscalCode: 'FC', createdAt: d,
  },
  subscription: {
    id: 's1', type, status: 'ACTIVE', price: 85, isPaid: true, paymentMethod: 'STRIPE',
    totalSessions: 1, usedSessions: 0, followUpToken, expiresAt, createdAt: d,
  },
})

describe('GET /api/admin/appointments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: {} })
  })

  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('maps appointments for all subscription types', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([
      row('FREE_CONSULTATION', 'tok', d),
      row('SINGLE_SESSION', null, null),
      row('BUNDLE_3_MONTHS', null, null),
      row('BUNDLE_6_MONTHS', null, null),
      row('UNKNOWN', null, null),
    ] as any)
    const res = await GET()
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data).toHaveLength(5)
    expect(data[0].followUpToken).toBe('tok')
    expect(data[0].expiresAt).toBe(d.toISOString())
    expect(data[1].followUpToken).toBeNull()
    expect(data[1].expiresAt).toBeNull()
    expect(data[0].status).toBe('confirmed')
    expect(data[4].serviceName).toBe(data[1].serviceName)
  })
})
