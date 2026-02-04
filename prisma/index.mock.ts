import { vi } from 'vitest'

export const prisma = {
  medicine: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    updateMany: vi.fn()
  },
  medicinePresentation: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn()
  },
  user: {
    create: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn()
  }
}
