// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { prisma } from '@prisma/index'
// COMPONENTS
import ListMedicinePage from './page'
// SHARED
import { COMMON_TABLE_ERRORS, MEDICINE_TABLE_LABELS } from '@shared-constants/labels'
// MOCKS
import {
  medicineListResponse,
  secondMedicineListResponse,
  nullMedicineListResponse
} from './mocks.json'

// Mock prisma
vi.mock('@prisma/index', () => ({
  prisma: {
    medicine: {
      findMany: vi.fn()
    }
  }
}))

describe('[ListMedicinePage]', () => {
  const avoidProps = new Set(['id', 'presentation', 'medicinePresentation'])

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the medicine list page with title', async () => {
    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(
      medicineListResponse.map(med => ({ ...med, expirationDate: new Date(med.expirationDate) }))
    )

    const component = await ListMedicinePage({})
    render(component)

    const title = screen.getByText(MEDICINE_TABLE_LABELS.TITLE)
    expect(title).toBeInTheDocument()
  })

  test('renders table headers correctly', async () => {
    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(
      secondMedicineListResponse.map(med => ({
        ...med,
        expirationDate: new Date(med.expirationDate)
      }))
    )

    const component = await ListMedicinePage({})
    render(component)

    const headers = MEDICINE_TABLE_LABELS.HEADERS.split(',')
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
  })

  test('renders medicine data in table rows', async () => {
    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(
      secondMedicineListResponse.map(med => ({
        ...med,
        expirationDate: new Date(med.expirationDate)
      }))
    )

    const component = await ListMedicinePage({})
    render(component)

    Object.entries(secondMedicineListResponse[0]).forEach(([key, value]) => {
      if (!avoidProps.has(key) && value !== null) {
        expect(screen.getByText(value.toString())).toBeInTheDocument()
      }
    })
  })

  test('handles null values in medicine data', async () => {
    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(nullMedicineListResponse)

    const component = await ListMedicinePage({})
    render(component)

    Object.entries(nullMedicineListResponse[0]).forEach(([key, value]) => {
      if (!avoidProps.has(key) && value !== null) {
        expect(screen.getByText(value.toString())).toBeInTheDocument()
      }
    })

    const dashElements = screen.getAllByText('-')
    expect(dashElements.length).toBe(5)
  })

  test('formats expiration date correctly', async () => {
    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(
      secondMedicineListResponse.map(med => ({
        ...med,
        expirationDate: new Date(med.expirationDate)
      }))
    )

    const component = await ListMedicinePage({})
    render(component)

    expect(screen.getByText(secondMedicineListResponse[0].expirationDate)).toBeInTheDocument()
  })

  test('renders multiple medicines in the table', async () => {
    const mockMedicines = [...medicineListResponse, ...secondMedicineListResponse]

    vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(
      mockMedicines.map(med => ({ ...med, expirationDate: new Date(med.expirationDate) }))
    )

    const component = await ListMedicinePage({})
    render(component)

    mockMedicines.forEach(medObj => {
      Object.entries(medObj).forEach(([key, value]) => {
        if (!avoidProps.has(key) && value !== null) {
          expect(screen.getByText(value.toString())).toBeInTheDocument()
        }
      })
    })
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

    const noDataMessage = screen.getByText(COMMON_TABLE_ERRORS.NO_DATA)
    expect(noDataMessage).toBeInTheDocument()
  })
})
