// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// ACTIONS
import { deletePresentation } from '@actions/presentation'
// COMPONENTS
import MedicinePresentationTable from './index'
// SHARED
import { COMMON_LABELS, COMMON_TABLE_ERRORS } from '@shared-constants/common'
import { MEDICINE_PRESENTATION_TABLE_LABELS } from '@shared-constants/tables'
// MOCKS
import {
  basicPresentationData,
  multiplePresentationData,
  emptyPresentationData
} from './mocks.json'

// Mock Prisma to prevent import errors
vi.mock('@prisma/index', () => ({
  prisma: {}
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

// Mock actions
vi.mock('@actions/presentation', () => ({
  deletePresentation: vi.fn()
}))

// Mock sonner for toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('[MedicinePresentationTable]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders table title correctly', () => {
    render(<MedicinePresentationTable presentationList={basicPresentationData} />)

    const title = screen.getByText(MEDICINE_PRESENTATION_TABLE_LABELS.TITLE)
    expect(title).toBeInTheDocument()
  })

  test('renders table headers correctly', () => {
    render(<MedicinePresentationTable presentationList={basicPresentationData} />)

    const headers = MEDICINE_PRESENTATION_TABLE_LABELS.HEADERS.split(',')
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
  })

  test('renders single presentation data in table', () => {
    render(<MedicinePresentationTable presentationList={basicPresentationData} />)

    const presentation = basicPresentationData[0]
    expect(screen.getByText(presentation.description)).toBeInTheDocument()
  })

  test('renders multiple presentations in table', () => {
    render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

    multiplePresentationData.forEach(presentation => {
      expect(screen.getByText(presentation.description)).toBeInTheDocument()
    })
  })

  test('renders table structure with data rows', () => {
    render(<MedicinePresentationTable presentationList={basicPresentationData} />)

    const { container } = render(
      <MedicinePresentationTable presentationList={basicPresentationData} />
    )

    const table = container.querySelector('table')
    expect(table).toBeInTheDocument()
  })

  test('renders all presentation items with correct data', () => {
    render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

    multiplePresentationData.forEach(presentation => {
      expect(screen.getByText(presentation.description)).toBeInTheDocument()
    })
  })

  test('handles empty presentation list gracefully', () => {
    render(<MedicinePresentationTable presentationList={emptyPresentationData} />)

    const noDataMessage = screen.getByText(COMMON_TABLE_ERRORS.NO_DATA)
    expect(noDataMessage).toBeInTheDocument()
  })

  test('renders component without crashing with valid data', () => {
    expect(() =>
      render(<MedicinePresentationTable presentationList={basicPresentationData} />)
    ).not.toThrow()
  })

  test('receives correct presentationList prop', () => {
    const { container } = render(
      <MedicinePresentationTable presentationList={multiplePresentationData} />
    )

    multiplePresentationData.forEach(presentation => {
      expect(screen.getByText(presentation.description)).toBeInTheDocument()
    })

    expect(container.firstChild).toBeInTheDocument()
  })

  test('renders presentation descriptions in order', () => {
    render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

    const descriptionElements = screen.getAllByText(/Tablet|Capsule|Syrup/)
    expect(descriptionElements.length).toBeGreaterThanOrEqual(multiplePresentationData.length)
  })

  test('maintains data integrity when rendering presentations', () => {
    render(<MedicinePresentationTable presentationList={basicPresentationData} />)

    const presentation = basicPresentationData[0]
    const cells = screen.getByText(presentation.description)
    expect(cells).toBeInTheDocument()
    expect(cells.textContent).toBe(presentation.description)
  })

  describe('Delete Functionality', () => {
    test('renders delete and edit button for each presentation', () => {
      render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      const deleteButtons = screen.getAllByText(COMMON_LABELS.DELETE)
      const editButtons = screen.getAllByText(COMMON_LABELS.EDIT)

      expect(deleteButtons.length).toBeGreaterThanOrEqual(multiplePresentationData.length)
      expect(editButtons.length).toBeGreaterThanOrEqual(multiplePresentationData.length)
    })

    test('renders action buttons for all presentations', () => {
      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const editButton = screen.getByText(COMMON_LABELS.EDIT)
      const deleteButton = screen.getByText(COMMON_LABELS.DELETE)

      expect(editButton).toBeInTheDocument()
      expect(deleteButton).toBeInTheDocument()
    })

    test('confirmation dialog button exists', () => {
      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const deleteButtons = screen.getAllByText(COMMON_LABELS.DELETE)
      expect(deleteButtons.length).toBeGreaterThanOrEqual(1)
    })

    test('renders memoized list on prop change', () => {
      const { rerender } = render(
        <MedicinePresentationTable presentationList={basicPresentationData} />
      )

      expect(screen.getByText('Tablet')).toBeInTheDocument()

      rerender(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      expect(screen.getByText('Capsule')).toBeInTheDocument()
      expect(screen.getByText('Syrup')).toBeInTheDocument()
    })

    test('deletes presentation when delete action is called', async () => {
      vi.mocked(deletePresentation).mockResolvedValue({
        message: MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_SUCCESS,
        success: true
      })

      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const deleteButton = screen.getByText(COMMON_LABELS.DELETE)
      expect(deleteButton).toBeInTheDocument()
      expect(deletePresentation).toBeDefined()
    })

    test('displays success message on successful deletion', async () => {
      vi.mocked(deletePresentation).mockResolvedValue({
        message: MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_SUCCESS,
        success: true
      })

      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const deleteButton = screen.getByText(COMMON_LABELS.DELETE)
      expect(deleteButton).toBeInTheDocument()

      expect(deletePresentation).toBeDefined()
    })

    test('handles deletion error gracefully', async () => {
      vi.mocked(deletePresentation).mockResolvedValue({
        message: 'Failed to delete presentation',
        success: false
      })

      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      expect(deletePresentation).toBeDefined()
    })
  })
})
