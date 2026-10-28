import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
}))

import { GET, POST } from '@/app/api/auth/[...nextauth]/route'
import { handlers } from '@/lib/auth'

describe('nextauth route', () => {
  it('re-exports handlers', () => {
    expect(GET).toBe(handlers.GET)
    expect(POST).toBe(handlers.POST)
  })
})
