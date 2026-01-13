// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { prisma } from '@prisma/index'
// COMPONENTS
import ListMedicinePresentationPage from './page'
// SHARED
import { COMMON_TABLE_ERRORS } from '@shared-constants/common'
import { MEDICINE_PRESENTATION_TABLE_LABELS } from '@shared-constants/tables'
// MOCKS
import {
  presentationListResponse,
  secondPresentationListResponse,
  emptyPresentationListResponse
} from './mocks.json'

// Mock prisma
vi.mock('@prisma/index', () => ({
  prisma: {
    medicinePresentation: {
      findMany: vi.fn()
    }
  }
}))

describe('[ListMedicinePresentationPage]', () => {
  const avoidProps = new Set(['id'])

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the presentation list page with title', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(presentationListResponse)

    const component = await ListMedicinePresentationPage({})
    render(component)

    const title = screen.getByText(MEDICINE_PRESENTATION_TABLE_LABELS.TITLE)
    expect(title).toBeInTheDocument()
  })

  test('renders table headers correctly', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(
      secondPresentationListResponse
    )

    const component = await ListMedicinePresentationPage({})
    render(component)

    const headers = MEDICINE_PRESENTATION_TABLE_LABELS.HEADERS.split(',')
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
  })

  test('renders presentation data in table rows', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(
      secondPresentationListResponse
    )

    const component = await ListMedicinePresentationPage({})
    render(component)

    Object.entries(secondPresentationListResponse[0]).forEach(([key, value]) => {
      if (!avoidProps.has(key) && value !== null) {
        expect(screen.getByText(value.toString())).toBeInTheDocument()
      }
    })
  })

  test('renders multiple presentations in the table', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(
      secondPresentationListResponse
    )

    const component = await ListMedicinePresentationPage({})
    render(component)

    secondPresentationListResponse.forEach(presentationObj => {
      Object.entries(presentationObj).forEach(([key, value]) => {
        if (!avoidProps.has(key) && value !== null) {
          expect(screen.getByText(value.toString())).toBeInTheDocument()
        }
      })
    })
  })

  test('calls prisma.medicinePresentation.findMany with correct parameters', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce([])

    await ListMedicinePresentationPage({})

    expect(prisma.medicinePresentation.findMany).toHaveBeenCalledWith()
  })

  test('displays no data message when presentation list is empty', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(
      emptyPresentationListResponse
    )

    const component = await ListMedicinePresentationPage({})
    render(component)

    const noDataMessage = screen.getByText(COMMON_TABLE_ERRORS.NO_DATA)
    expect(noDataMessage).toBeInTheDocument()
  })

  test('renders the MedicinePresentationTable component', async () => {
    vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(presentationListResponse)

    const component = await ListMedicinePresentationPage({})
    const { container } = render(component)

    // Verify that the table is rendered by checking for table structure
    expect(container.firstChild).toBeInTheDocument()
  })
})
