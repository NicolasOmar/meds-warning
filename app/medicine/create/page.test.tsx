import { describe, test, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
// COMPONENT
import MedicinePage from './page'

// Mock Prisma
vi.mock('@prisma/index', () => ({
  prisma: {
    medicinePresentation: {
      findMany: vi.fn().mockResolvedValue([])
    }
  }
}))

describe('[MedicinePage]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the medicine creation page', async () => {
    const component = await MedicinePage({})
    expect(component).toBeDefined()
  })

  test('component is an async functional component', async () => {
    const component = await MedicinePage({})
    expect(component).toBeTruthy()
  })

  test('calls prisma to fetch presentations', async () => {
    const { prisma } = await import('@prisma/index')
    await MedicinePage({})
    expect(prisma.medicinePresentation.findMany).toHaveBeenCalled()
  })
})
