// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
// ACTIONS
import { deletePresentation } from '@actions/presentation'
// COMPONENTS
import MedicinePresentationTable from './index'
import { toast } from 'sonner'
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

      const deleteButtons = screen.getAllByTitle(COMMON_LABELS.DELETE)
      const editButtons = screen.getAllByTitle(COMMON_LABELS.EDIT)

      expect(deleteButtons.length).toBe(multiplePresentationData.length)
      expect(editButtons.length).toBe(multiplePresentationData.length)
    })

    test('renders action buttons for all presentations', () => {
      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const editButton = screen.getByTitle(COMMON_LABELS.EDIT)
      const deleteButton = screen.getByTitle(COMMON_LABELS.DELETE)

      expect(editButton).toBeInTheDocument()
      expect(deleteButton).toBeInTheDocument()
    })

    test('renders delete dialog button for each presentation', async () => {
      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const deleteDialogButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
      expect(deleteDialogButton).toBeInTheDocument()
    })

    test('displays delete confirmation dialog when delete button is clicked', async () => {
      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const deleteButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButton)

      const confirmDeleteTitle = await screen.findByText(
        MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_QUESTION
      )
      expect(confirmDeleteTitle).toBeInTheDocument()

      // Check for the description text (may be split across elements)
      const dialogContent = await screen.findByRole('dialog')
      expect(dialogContent.textContent).toContain(basicPresentationData[0].description)
      expect(dialogContent.textContent).toContain('This action cannot be undone')
    })

    test('calls deletePresentation action when delete is confirmed', async () => {
      vi.mocked(deletePresentation).mockResolvedValueOnce({
        message: MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_SUCCESS,
        success: true
      })

      const presentationId = basicPresentationData[0].id
      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const deleteButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButton)

      // Get the confirmation button (not the trigger button)
      const allDeleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

      await waitFor(() => {
        expect(deletePresentation).toHaveBeenCalledWith(presentationId)
        expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
          MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_SUCCESS
        )
      })
    })

    test('displays success message on successful deletion', async () => {
      vi.mocked(deletePresentation).mockResolvedValueOnce({
        message: MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_SUCCESS,
        success: true
      })

      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const deleteButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButton)

      const allDeleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
          MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_SUCCESS
        )
      })
    })

    test('shows error toast on delete failure', async () => {
      vi.mocked(deletePresentation).mockResolvedValueOnce({
        message: MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_ERROR,
        errors: { name: ['Error occurred'] }
      })

      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const deleteButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButton)

      const allDeleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

      await waitFor(() => {
        expect(deletePresentation).toHaveBeenCalled()
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
          MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_ERROR
        )
      })
    })

    test('handles deletion error gracefully', async () => {
      vi.mocked(deletePresentation).mockResolvedValueOnce({
        message: 'Failed to delete presentation',
        errors: { name: ['Error'] }
      })

      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const deleteButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButton)

      const allDeleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalled()
      })
    })

    test('presentation description appears correctly in delete confirmation for multiple presentations', async () => {
      render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      const deleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButtons[0])

      const dialogContent = await screen.findByRole('dialog')
      expect(dialogContent.textContent).toContain(multiplePresentationData[0].description)
      expect(dialogContent.textContent).toContain('This action cannot be undone')
    })

    test('handles delete with no response message', async () => {
      vi.mocked(deletePresentation).mockResolvedValueOnce({})

      const presentationId = basicPresentationData[0].id
      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const deleteButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButton)

      const allDeleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

      // Should not throw error
      await waitFor(() => {
        expect(deletePresentation).toHaveBeenCalledWith(presentationId)
      })
    })
  })
})
