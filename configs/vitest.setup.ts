import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock Prisma dependencies globally to prevent import errors during testing
vi.mock('@prisma/adapter-pg', () => ({}), { virtual: true })
vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    $connect = vi.fn()
    $disconnect = vi.fn()
  }
}), { virtual: true })

// Mock the prisma index file
vi.mock('@prisma/index', () => ({
  prisma: {
    userForm: {
      findFirst: vi.fn()
    }
  }
}), { virtual: true })
