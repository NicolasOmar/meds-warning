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

    test('renders action buttons for presentations with multiple items', () => {
      render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      const editButtons = screen.getAllByTitle(COMMON_LABELS.EDIT)
      const deleteButtons = screen.getAllByTitle(COMMON_LABELS.DELETE)

      expect(editButtons.length).toBe(3)
      expect(deleteButtons.length).toBe(3)
    })

    test('does not render delete button when only one presentation exists', () => {
      render(<MedicinePresentationTable presentationList={basicPresentationData} />)

      const editButton = screen.getByTitle(COMMON_LABELS.EDIT)
      const deleteButton = screen.queryByTitle(COMMON_LABELS.DELETE)

      expect(editButton).toBeInTheDocument()
      expect(deleteButton).not.toBeInTheDocument()
    })

    test('renders delete dialog button for presentations with replacement options', async () => {
      render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      const deleteDialogButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      expect(deleteDialogButtons.length).toBeGreaterThan(0)
    })

    test('displays delete confirmation dialog with replacement select when delete button is clicked', async () => {
      render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      const deleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButtons[0])

      const confirmDeleteTitle = await screen.findByText(
        MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_QUESTION
      )
      expect(confirmDeleteTitle).toBeInTheDocument()

      const dialogContent = await screen.findByRole('dialog')
      expect(dialogContent.textContent).toContain(multiplePresentationData[0].description)
      expect(dialogContent.textContent).toContain('Replace with:')
    })

    test('calls deletePresentation action with replacement when form is submitted', async () => {
      vi.mocked(deletePresentation).mockResolvedValueOnce({
        message: MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_SUCCESS,
        success: true
      })

      const presentationId = multiplePresentationData[0].id

      render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      const deleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButtons[0])

      await waitFor(() => screen.findByRole('dialog'))

      const confirmButton = screen.getByRole('button', { name: COMMON_LABELS.CONFIRM })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(deletePresentation).toHaveBeenCalledWith(presentationId, expect.any(Number))
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

      render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      const deleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButtons[0])

      await waitFor(() => screen.findByRole('dialog'))

      const confirmButton = screen.getByRole('button', { name: COMMON_LABELS.CONFIRM })
      fireEvent.click(confirmButton)

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

      render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      const deleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButtons[0])

      await waitFor(() => screen.findByRole('dialog'))

      const confirmButton = screen.getByRole('button', { name: COMMON_LABELS.CONFIRM })
      fireEvent.click(confirmButton)

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

      render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      const deleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButtons[0])

      await waitFor(() => screen.findByRole('dialog'))

      const confirmButton = screen.getByRole('button', { name: COMMON_LABELS.CONFIRM })
      fireEvent.click(confirmButton)

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
      expect(dialogContent.textContent).toContain('Replace with:')
    })

    test('handles delete with no response message', async () => {
      vi.mocked(deletePresentation).mockResolvedValueOnce({})

      render(<MedicinePresentationTable presentationList={multiplePresentationData} />)

      const deleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButtons[0])

      await waitFor(() => screen.findByRole('dialog'))

      const confirmButton = screen.getByRole('button', { name: COMMON_LABELS.CONFIRM })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(deletePresentation).toHaveBeenCalledWith(
          multiplePresentationData[0].id,
          expect.any(Number)
        )
      })
    })
  })
})
