// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { notFound } from 'next/navigation'
import { prisma } from '@prisma/index'
// COMPONENTS
import UpdateMedicinePage from './page'
// MOCKS
import { presentationList, firstMedicineResponse, nullMedicineResponse } from './mocks.json'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}))

vi.mock('@shared-functions/auth', () => ({
  getSession: vi.fn().mockResolvedValue({ user: { id: 1, email: 'test@test.com', name: 'Test' } })
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

describe('[UpdateMedicinePage]', () => {
  const avoidProps = new Set(['id', 'userId', 'presentation', 'expirationDate'])

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders MedicineForm with medicine data and presentations', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(presentationList)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce({
      ...firstMedicineResponse,
      expirationDate: new Date(firstMedicineResponse.expirationDate)
    })

    const params = Promise.resolve({ id: '1' })
    const component = await UpdateMedicinePage({ params })
    render(component)

    Object.entries(firstMedicineResponse).forEach(([key, value]) => {
      if (!avoidProps.has(key) && value !== null) {
        expect(screen.getByDisplayValue(value.toString())).toBeInTheDocument()
      }
    })
  })

  test('calls prisma.medicinePresentation.findMany to fetch presentations', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(presentationList)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce({
      ...firstMedicineResponse,
      expirationDate: new Date(firstMedicineResponse.expirationDate)
    })

    const params = Promise.resolve({ id: '1' })
    await UpdateMedicinePage({ params })

    expect(prisma.medicinePresentation.findMany).toHaveBeenCalledWith({ where: { userId: 1 } })
  })

  test('calls prisma.medicine.findFirst with correct id parameter', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(presentationList)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce({
      ...firstMedicineResponse,
      expirationDate: new Date(firstMedicineResponse.expirationDate)
    })

    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(presentationList)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce({
      ...firstMedicineResponse,
      expirationDate: new Date(firstMedicineResponse.expirationDate)
    })

    const params = Promise.resolve({ id: '1' })
    await UpdateMedicinePage({ params })

    expect(prisma.medicine.findFirst).toHaveBeenCalledWith({
      where: { id: 1, userId: 1 }
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
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(presentationList)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(null)

    const params = Promise.resolve({ id: '999' })

    await UpdateMedicinePage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  test('handles medicine with null optional fields', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(presentationList)
    vi.mocked(prisma.medicine.findFirst).mockResolvedValueOnce(nullMedicineResponse)

    const params = Promise.resolve({ id: '5' })
    const component = await UpdateMedicinePage({ params })
    render(component)

    Object.entries(nullMedicineResponse).forEach(([key, value]) => {
      if (!avoidProps.has(key) && value !== null) {
        expect(screen.getByDisplayValue(value.toString())).toBeInTheDocument()
      }
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
})
