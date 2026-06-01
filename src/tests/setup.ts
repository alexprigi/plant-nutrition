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
      updateMany: vi.fn(),
      findUnique: vi.fn(),
    },
    appointment: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    availabilityBlock: {
      findMany: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

// Mock Auth.js
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))
