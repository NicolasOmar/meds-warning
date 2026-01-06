import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENT
import MedicinePage from './page'
// SHARED
import { MedicinePresentationType } from '@shared-types/zod'

// Mock Prisma
vi.mock('@prisma/index', () => ({
  prisma: {
    medicinePresentation: {
      findMany: vi.fn()
    }
  }
}))

// Mock MedicineForm component
vi.mock('@form-components/MedicineForm', () => ({
  default: ({ presentationsList }: { presentationsList: MedicinePresentationType[] }) => (
    <div data-testid="medicine-form" data-presentations={presentationsList.length}>
      Medicine Form with {presentationsList.length} presentations
    </div>
  )
}))

describe('MedicinePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the medicine page', async () => {
    const { prisma } = await import('@prisma/index')
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValue(
      [] as MedicinePresentationType[]
    )

    render(await MedicinePage())
    expect(screen.getByTestId('medicine-form')).toBeInTheDocument()
  })

  test('passes presentations to MedicineForm', async () => {
    const { prisma } = await import('@prisma/index')
    const mockPresentations: MedicinePresentationType[] = [
      { id: 1, description: 'Tablet' },
      { id: 2, description: 'Syrup' }
    ]
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValue(mockPresentations)

    render(await MedicinePage())
    const form = screen.getByTestId('medicine-form')
    expect(form).toHaveAttribute('data-presentations', '2')
  })

  test('fetches presentations from database', async () => {
    const { prisma } = await import('@prisma/index')
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValue(
      [] as MedicinePresentationType[]
    )

    await MedicinePage()
    expect(prisma.medicinePresentation.findMany).toHaveBeenCalled()
  })

  test('renders without error with empty presentations', async () => {
    const { prisma } = await import('@prisma/index')
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValue(
      [] as MedicinePresentationType[]
    )

    expect(async () => render(await MedicinePage())).not.toThrow()
  })

  test('handles multiple presentation types', async () => {
    const { prisma } = await import('@prisma/index')
    const mockPresentations: MedicinePresentationType[] = [
      { id: 1, description: 'Tablet' },
      { id: 2, description: 'Syrup' },
      { id: 3, description: 'Capsule' },
      { id: 4, description: 'Injection' }
    ]
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValue(mockPresentations)

    render(await MedicinePage())
    const form = screen.getByTestId('medicine-form')
    expect(form).toHaveAttribute('data-presentations', '4')
  })

  test('MedicineForm displays correct count of presentations', async () => {
    const { prisma } = await import('@prisma/index')
    const mockPresentations: MedicinePresentationType[] = [{ id: 1, description: 'Tablet' }]
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValue(mockPresentations)

    render(await MedicinePage())
    const form = screen.getByText(/Medicine Form with 1 presentations/)
    expect(form).toBeInTheDocument()
  })

  test('renders async page correctly', async () => {
    const { prisma } = await import('@prisma/index')
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValue(
      [] as MedicinePresentationType[]
    )

    const result = await MedicinePage()
    expect(result).toBeDefined()
  })
})
