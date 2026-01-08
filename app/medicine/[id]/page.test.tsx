// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import UpdateMedicinePage from './page'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}))

// Mock prisma
vi.mock('@prisma/index', () => ({
  prisma: {
    medicinePresentation: {
      findMany: vi.fn()
    },
    medicine: {
      findFirst: vi.fn()
    }
  }
}))

// Import the mocked modules
import { notFound } from 'next/navigation'
import { prisma } from '@prisma/index'

describe('[UpdateMedicinePage]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders MedicineForm with medicine data and presentations', async () => {
    const mockPresentations = [
      { id: 1, description: 'Tablet' },
      { id: 2, description: 'Capsule' }
    ]

    const mockMedicine = {
      id: 1,
      name: 'Aspirin',
      laboratory: 'Bayer',
      presentation: 1,
      expirationDate: new Date('2025-12-31'),
      usedFor: 'Pain relief',
      sideEffects: 'Dizziness',
      comments: 'Take with food'
    }

    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(mockPresentations)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(mockMedicine)

    const params = Promise.resolve({ id: '1' })
    const component = await UpdateMedicinePage({ params })
    render(component)

    // Check if MedicineForm is rendered with the medicine data
    expect(screen.getByDisplayValue('Aspirin')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Bayer')).toBeInTheDocument()
  })

  test('calls prisma.medicinePresentation.findMany to fetch presentations', async () => {
    const mockPresentations = [{ id: 1, description: 'Tablet' }]
    const mockMedicine = {
      id: 1,
      name: 'Test',
      laboratory: 'Lab',
      presentation: 1,
      expirationDate: null,
      usedFor: null,
      sideEffects: null,
      comments: null
    }

    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(mockPresentations)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(mockMedicine)

    const params = Promise.resolve({ id: '1' })
    await UpdateMedicinePage({ params })

    expect(prisma.medicinePresentation.findMany).toHaveBeenCalledWith({})
  })

  test('calls prisma.medicine.findFirst with correct id parameter', async () => {
    const mockPresentations = [{ id: 1, description: 'Tablet' }]
    const mockMedicine = {
      id: 42,
      name: 'Test',
      laboratory: 'Lab',
      presentation: 1,
      expirationDate: null,
      usedFor: null,
      sideEffects: null,
      comments: null
    }

    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(mockPresentations)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(mockMedicine)

    const params = Promise.resolve({ id: '42' })
    await UpdateMedicinePage({ params })

    expect(prisma.medicine.findFirst).toHaveBeenCalledWith({
      where: { id: 42 }
    })
  })

  test('calls notFound when id is missing', async () => {
    const params = Promise.resolve({ id: '' })

    await UpdateMedicinePage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  test('calls notFound when id is not a valid number', async () => {
    const params = Promise.resolve({ id: 'invalid' })

    await UpdateMedicinePage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  test('calls notFound when medicine is not found in database', async () => {
    const mockPresentations = [{ id: 1, description: 'Tablet' }]

    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(mockPresentations)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(null)

    const params = Promise.resolve({ id: '999' })

    await UpdateMedicinePage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  test('passes correct presentations list to MedicineForm component', async () => {
    const mockPresentations = [
      { id: 1, description: 'Tablet' },
      { id: 2, description: 'Capsule' },
      { id: 3, description: 'Liquid' }
    ]

    const mockMedicine = {
      id: 1,
      name: 'Test',
      laboratory: 'Lab',
      presentation: 1,
      expirationDate: null,
      usedFor: null,
      sideEffects: null,
      comments: null
    }

    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(mockPresentations)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(mockMedicine)

    const params = Promise.resolve({ id: '1' })
    const component = await UpdateMedicinePage({ params })
    render(component)

    // Verify that prisma.medicinePresentation.findMany was called with correct data
    expect(prisma.medicinePresentation.findMany).toHaveBeenCalledWith({})
    // Verify the form renders with medicine data
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument()
  })

  test('handles medicine with null optional fields', async () => {
    const mockPresentations = [{ id: 1, description: 'Tablet' }]

    const mockMedicine = {
      id: 5,
      name: 'Medicine Name',
      laboratory: null,
      presentation: 1,
      expirationDate: null,
      usedFor: null,
      sideEffects: null,
      comments: null
    }

    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(mockPresentations)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(mockMedicine)

    const params = Promise.resolve({ id: '5' })
    const component = await UpdateMedicinePage({ params })
    render(component)

    expect(screen.getByDisplayValue('Medicine Name')).toBeInTheDocument()
  })

  test('handles medicine with all fields populated', async () => {
    const mockPresentations = [{ id: 1, description: 'Tablet' }]

    const mockMedicine = {
      id: 10,
      name: 'Complete Medicine',
      laboratory: 'Complete Labs',
      presentation: 1,
      expirationDate: new Date('2025-12-31'),
      usedFor: 'Complete Usage',
      sideEffects: 'Complete Side Effects',
      comments: 'Complete Comments'
    }

    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(mockPresentations)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(mockMedicine)

    const params = Promise.resolve({ id: '10' })
    const component = await UpdateMedicinePage({ params })
    render(component)

    expect(screen.getByDisplayValue('Complete Medicine')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Complete Labs')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Complete Usage')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Complete Side Effects')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Complete Comments')).toBeInTheDocument()
  })

  test('converts string id to number for database query', async () => {
    const mockPresentations = [{ id: 1, description: 'Tablet' }]
    const mockMedicine = {
      id: 123,
      name: 'Test',
      laboratory: 'Lab',
      presentation: 1,
      expirationDate: null,
      usedFor: null,
      sideEffects: null,
      comments: null
    }

    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(mockPresentations)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(mockMedicine)

    const params = Promise.resolve({ id: '123' })
    await UpdateMedicinePage({ params })

    expect(prisma.medicine.findFirst).toHaveBeenCalledWith({
      where: { id: 123 }
    })
  })

  test('calls notFound with id containing only zeros', async () => {
    const params = Promise.resolve({ id: '0' })

    await UpdateMedicinePage({ params })

    // ID '0' converts to number 0 which is falsy
    // The condition checks !id which evaluates to true for 0
    // Therefore notFound is called
    expect(notFound).toHaveBeenCalled()
  })

  test('handles async params correctly', async () => {
    const mockPresentations = [{ id: 1, description: 'Tablet' }]
    const mockMedicine = {
      id: 1,
      name: 'Test',
      laboratory: 'Lab',
      presentation: 1,
      expirationDate: null,
      usedFor: null,
      sideEffects: null,
      comments: null
    }

    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(mockPresentations)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(mockMedicine)

    // Create a promise that resolves after a small delay
    const params = new Promise(resolve => {
      setTimeout(() => resolve({ id: '1' }), 10)
    })

    const component = await UpdateMedicinePage({ params: params as Promise<{ id: string }> })
    render(component)

    expect(screen.getByDisplayValue('Test')).toBeInTheDocument()
  })
})
