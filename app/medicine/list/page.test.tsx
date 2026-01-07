// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import ListMedicinePage from './page'
// SHARED
import { MEDICINE_TABLE_LABELS } from '@shared-constants/labels'

// Mock prisma
vi.mock('@prisma/index', () => ({
  prisma: {
    medicine: {
      findMany: vi.fn()
    }
  }
}))

// Import the mocked prisma
import { prisma } from '@prisma/index'

describe('[ListMedicinePage]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the medicine list page with title', async () => {
    // Mock the findMany to return one medicine
    const mockMedicines = [
      {
        id: 1,
        name: 'Test Medicine',
        laboratory: 'Test Lab',
        presentation: 1,
        medicinePresentation: { description: 'Tablet' },
        expirationDate: new Date('2025-12-31'),
        usedFor: 'Test',
        sideEffects: 'None',
        comments: 'Test'
      }
    ]
    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(mockMedicines)

    const component = await ListMedicinePage({})
    render(component)

    const title = screen.getByText(MEDICINE_TABLE_LABELS.TITLE)
    expect(title).toBeInTheDocument()
  })

  test('renders table headers correctly', async () => {
    const mockMedicines = [
      {
        id: 1,
        name: 'Aspirin',
        laboratory: 'Bayer',
        presentation: 1,
        medicinePresentation: { description: 'Tablet' },
        expirationDate: new Date('2025-12-31'),
        usedFor: 'Pain relief',
        sideEffects: 'None',
        comments: 'Take with food'
      }
    ]

    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(mockMedicines)

    const component = await ListMedicinePage({})
    render(component)

    const headers = MEDICINE_TABLE_LABELS.HEADERS.split(',')
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
  })

  test('renders medicine data in table rows', async () => {
    const mockMedicines = [
      {
        id: 1,
        name: 'Aspirin',
        laboratory: 'Bayer',
        presentation: 1,
        medicinePresentation: { description: 'Tablet' },
        expirationDate: new Date('2025-12-31'),
        usedFor: 'Pain relief',
        sideEffects: 'Dizziness',
        comments: 'Take with food'
      }
    ]

    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(mockMedicines)

    const component = await ListMedicinePage({})
    render(component)

    expect(screen.getByText('Aspirin')).toBeInTheDocument()
    expect(screen.getByText('Bayer')).toBeInTheDocument()
    expect(screen.getByText('Tablet')).toBeInTheDocument()
    expect(screen.getByText('Pain relief')).toBeInTheDocument()
    expect(screen.getByText('Dizziness')).toBeInTheDocument()
    expect(screen.getByText('Take with food')).toBeInTheDocument()
  })

  test('handles null values in medicine data', async () => {
    const mockMedicines = [
      {
        id: 2,
        name: 'Ibuprofen',
        laboratory: null,
        presentation: 1,
        medicinePresentation: { description: 'Capsule' },
        expirationDate: null,
        usedFor: null,
        sideEffects: null,
        comments: null
      }
    ]

    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(mockMedicines)

    const component = await ListMedicinePage({})
    render(component)

    expect(screen.getByText('Ibuprofen')).toBeInTheDocument()
    expect(screen.getByText('Capsule')).toBeInTheDocument()
    // Null values should be displayed as '-'
    const dashElements = screen.getAllByText('-')
    expect(dashElements.length).toBeGreaterThan(0)
  })

  test('formats expiration date correctly', async () => {
    const mockMedicines = [
      {
        id: 3,
        name: 'Vitamin C',
        laboratory: 'Generic',
        presentation: 1,
        medicinePresentation: { description: 'Powder' },
        expirationDate: new Date('2026-06-15'),
        usedFor: 'Immune support',
        sideEffects: 'None',
        comments: ''
      }
    ]

    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(mockMedicines)

    const component = await ListMedicinePage({})
    render(component)

    expect(screen.getByText('2026-06-15')).toBeInTheDocument()
  })

  test('renders multiple medicines in the table', async () => {
    const mockMedicines = [
      {
        id: 1,
        name: 'Aspirin',
        laboratory: 'Bayer',
        presentation: 1,
        medicinePresentation: { description: 'Tablet' },
        expirationDate: new Date('2025-12-31'),
        usedFor: 'Pain relief',
        sideEffects: 'Dizziness',
        comments: 'Take with food'
      },
      {
        id: 2,
        name: 'Ibuprofen',
        laboratory: 'Generic',
        presentation: 1,
        medicinePresentation: { description: 'Capsule' },
        expirationDate: new Date('2026-01-15'),
        usedFor: 'Inflammation',
        sideEffects: 'Nausea',
        comments: 'Take after meals'
      }
    ]

    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(mockMedicines)

    const component = await ListMedicinePage({})
    render(component)

    expect(screen.getByText('Aspirin')).toBeInTheDocument()
    expect(screen.getByText('Ibuprofen')).toBeInTheDocument()
    expect(screen.getByText('Pain relief')).toBeInTheDocument()
    expect(screen.getByText('Inflammation')).toBeInTheDocument()
  })

  test('calls prisma.medicine.findMany with correct parameters', async () => {
    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce([])

    await ListMedicinePage({})

    expect(prisma.medicine.findMany).toHaveBeenCalledWith({
      include: {
        medicinePresentation: true
      }
    })
  })

  test('displays no data message when medicine list is empty', async () => {
    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce([])

    const component = await ListMedicinePage({})
    render(component)

    const noDataMessage = screen.getByText('No data available')
    expect(noDataMessage).toBeInTheDocument()
  })
})
