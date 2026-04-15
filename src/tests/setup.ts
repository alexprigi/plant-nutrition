import { vi } from 'vitest'

// Mock Prisma globally
vi.mock('@/lib/prisma', () => ({
  prisma: {
    client: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    subscription: {
      create: vi.fn(),
      update: vi.fn(),
    },
    appointment: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

// Mock Auth.js
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))
