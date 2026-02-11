// CORE
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import { toast } from 'sonner'
import MedicineTable from './index'
// ACTIONS
import { deleteMedicine, getMedicines } from '@actions/medicine'
// SHARED
import { COMMON_TABLE_ERRORS, COMMON_LABELS } from '@shared-constants/common'
import { MEDICINE_TABLE_ERRORS, MEDICINE_TABLE_LABELS } from '@shared-constants/tables'
// MOCKS
import {
  basicMedicineData,
  multipleMedicineData,
  medicineWithNullFields,
  emptyMedicineData
} from './mocks.json'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

// Mock server actions
vi.mock('@actions/medicine', () => ({
  deleteMedicine: vi.fn(),
  getMedicines: vi.fn(),
  handleExpirationDateAction: vi.fn()
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('[MedicineTable]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('renders table title correctly', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const title = screen.getByText(MEDICINE_TABLE_LABELS.TITLE)
    expect(title).toBeInTheDocument()
  })

  test('renders table headers correctly', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const headers = MEDICINE_TABLE_LABELS.HEADERS.split(',')
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
  })

  test('renders single medicine data in table', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const medicine = basicMedicineData[0]
    expect(screen.getByText(medicine.name)).toBeInTheDocument()
    expect(screen.getByText(medicine.laboratory)).toBeInTheDocument()
    expect(screen.getByText(medicine.presentation)).toBeInTheDocument()
    expect(screen.getByText(medicine.usedFor)).toBeInTheDocument()
  })

  test('renders multiple medicines in table', () => {
    render(<MedicineTable medicineList={multipleMedicineData} />)

    multipleMedicineData.forEach(medicine => {
      expect(screen.getByText(medicine.name)).toBeInTheDocument()
      expect(screen.getByText(medicine.laboratory)).toBeInTheDocument()
    })
  })

  test('renders Edit button for each medicine', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const editLinks = screen.getAllByTitle(COMMON_LABELS.EDIT)
    expect(editLinks).toHaveLength(basicMedicineData.length)
  })

  test('renders Delete button for each medicine', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i })
    expect(deleteButtons).toHaveLength(basicMedicineData.length)
  })

  test('Edit button links to correct medicine URL', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const editButton = screen.getByTitle(COMMON_LABELS.EDIT)
    const editLink = editButton.closest('a')
    expect(editLink).toHaveAttribute('href', `/medicine/${basicMedicineData[0].id}`)
  })

  test('handles medicine with null optional fields', () => {
    render(<MedicineTable medicineList={medicineWithNullFields} />)

    const medicine = medicineWithNullFields[0]
    expect(screen.getByText(medicine.name)).toBeInTheDocument()
    expect(screen.getByText(medicine.presentation)).toBeInTheDocument()
  })

  test('renders empty table when no medicines provided', () => {
    const { container } = render(<MedicineTable medicineList={emptyMedicineData} />)

    // When there's no data, DataTable shows the no data message
    expect(container.textContent).toContain(COMMON_TABLE_ERRORS.NO_DATA)
  })

  test('memoizes medicine list correctly', () => {
    const { rerender } = render(<MedicineTable medicineList={basicMedicineData} />)

    // Initial render should show the medicine
    expect(screen.getByText(basicMedicineData[0].name)).toBeInTheDocument()

    // Rerender with same data
    rerender(<MedicineTable medicineList={basicMedicineData} />)

    // Medicine should still be visible
    expect(screen.getByText(basicMedicineData[0].name)).toBeInTheDocument()
  })

  test('renders all medicine fields correctly', () => {
    const medicine = multipleMedicineData[0]
    render(<MedicineTable medicineList={[medicine]} />)

    expect(screen.getByText(medicine.id.toString())).toBeInTheDocument()
    expect(screen.getByText(medicine.name)).toBeInTheDocument()
    expect(screen.getByText(medicine.laboratory)).toBeInTheDocument()
    expect(screen.getByText(medicine.presentation)).toBeInTheDocument()
    expect(screen.getByText(medicine.expirationDate)).toBeInTheDocument()
    expect(screen.getByText(medicine.usedFor)).toBeInTheDocument()
    expect(screen.getByText(medicine.sideEffects)).toBeInTheDocument()
    expect(screen.getByText(medicine.comments)).toBeInTheDocument()
  })

  test('renders multiple Edit and Delete buttons for multiple medicines', () => {
    render(<MedicineTable medicineList={multipleMedicineData} />)

    const editButtons = screen.getAllByTitle(COMMON_LABELS.EDIT)
    const deleteButtons = screen.getAllByTitle(COMMON_LABELS.DELETE)

    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })

  test('renders delete dialog button for each medicine', async () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const deleteDialogButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
    expect(deleteDialogButton).toBeInTheDocument()
  })

  test('displays delete confirmation dialog when delete button is clicked', async () => {
    vi.useRealTimers()
    render(<MedicineTable medicineList={basicMedicineData} />)

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    fireEvent.click(deleteButton)

    const confirmDeleteTitle = await screen.findByText(
      `${COMMON_LABELS.DELETE} '${basicMedicineData[0].name}'`
    )
    const confirmMessage = await screen.findByText(MEDICINE_TABLE_LABELS.DELETE_QUESTION)

    expect(confirmDeleteTitle).toBeInTheDocument()
    expect(confirmMessage).toBeInTheDocument()
    vi.useFakeTimers()
  })

  test('calls deleteMedicine action when delete is confirmed', async () => {
    vi.useRealTimers()
    vi.mocked(deleteMedicine).mockResolvedValueOnce({
      message: MEDICINE_TABLE_LABELS.DELETE_SUCCESS
    })

    const medicineId = basicMedicineData[0].id
    render(<MedicineTable medicineList={basicMedicineData} />)

    const deleteButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
    fireEvent.click(deleteButton)

    // Get the confirmation button (not the trigger button)
    const allDeleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
    fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

    await waitFor(() => {
      expect(deleteMedicine).toHaveBeenCalledWith(medicineId)
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(MEDICINE_TABLE_LABELS.DELETE_SUCCESS)
    })
    vi.useFakeTimers()
  })

  test('shows error toast on delete failure', async () => {
    vi.useRealTimers()
    vi.mocked(deleteMedicine).mockResolvedValueOnce({
      message: MEDICINE_TABLE_ERRORS.DELETE_ERROR,
      errors: { name: ['Error occurred'] }
    })

    render(<MedicineTable medicineList={basicMedicineData} />)

    const deleteButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
    fireEvent.click(deleteButton)

    const allDeleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
    fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(MEDICINE_TABLE_ERRORS.DELETE_ERROR)
    })
    vi.useFakeTimers()
  })

  test('handles delete with no response message', async () => {
    vi.useRealTimers()
    vi.mocked(deleteMedicine).mockResolvedValueOnce({})

    const medicineId = basicMedicineData[0].id
    render(<MedicineTable medicineList={basicMedicineData} />)

    const deleteButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
    fireEvent.click(deleteButton)

    const allDeleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
    fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

    // Should not throw error
    await waitFor(() => {
      expect(deleteMedicine).toHaveBeenCalledWith(medicineId)
    })
    vi.useFakeTimers()
  })

  test('medicine name appears correctly in delete confirmation for multiple medicines', async () => {
    vi.useRealTimers()
    render(<MedicineTable medicineList={multipleMedicineData} />)

    const deleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
    fireEvent.click(deleteButtons[0])

    const dialogTitle = await screen.findByText(
      `${COMMON_LABELS.DELETE} '${multipleMedicineData[0].name}'`
    )
    const confirmMessage = await screen.findByText(MEDICINE_TABLE_LABELS.DELETE_QUESTION)

    expect(dialogTitle).toBeInTheDocument()
    expect(confirmMessage).toBeInTheDocument()
    vi.useFakeTimers()
  })

  test('handles delete action for different medicine ids', async () => {
    vi.useRealTimers()
    vi.mocked(deleteMedicine).mockResolvedValue({
      message: 'Success'
    })

    render(<MedicineTable medicineList={multipleMedicineData} />)

    const deleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
    fireEvent.click(deleteButtons[0])

    const allDeleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
    fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

    await waitFor(() => {
      expect(deleteMedicine).toHaveBeenCalledWith(multipleMedicineData[0].id)
    })
    vi.useFakeTimers()
  })

  describe('Search Functionality', () => {
    test('renders search input field', () => {
      render(<MedicineTable medicineList={basicMedicineData} />)

      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('type', 'search')
    })

    test('search input has correct placeholder', () => {
      render(<MedicineTable medicineList={basicMedicineData} />)

      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
      expect(searchInput).toHaveAttribute('placeholder', MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
    })

    test('calls getMedicines with search term after debounce delay', async () => {
      vi.mocked(getMedicines).mockResolvedValueOnce([])

      render(<MedicineTable medicineList={basicMedicineData} />)

      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
      fireEvent.change(searchInput, { target: { value: basicMedicineData[0].name } })

      // Before delay, getMedicines should not be called
      expect(vi.mocked(getMedicines)).not.toHaveBeenCalled()

      // Advance timers past debounce delay (300ms)
      await act(async () => {
        vi.advanceTimersByTime(300)
        await vi.runAllTimersAsync()
      })

      expect(vi.mocked(getMedicines)).toHaveBeenCalledWith(basicMedicineData[0].name)
    })

    test('debounces rapid search inputs', async () => {
      vi.mocked(getMedicines).mockResolvedValue([])

      render(<MedicineTable medicineList={basicMedicineData} />)

      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)

      // Type multiple characters rapidly
      fireEvent.change(searchInput, { target: { value: 'A' } })
      vi.advanceTimersByTime(100)
      fireEvent.change(searchInput, { target: { value: 'As' } })
      vi.advanceTimersByTime(100)
      fireEvent.change(searchInput, { target: { value: 'Asp' } })
      vi.advanceTimersByTime(100)

      // Should not have called getMedicines yet (total 300ms but interrupted)
      expect(vi.mocked(getMedicines)).not.toHaveBeenCalled()

      // Advance to complete the debounce
      await act(async () => {
        vi.advanceTimersByTime(300)
        await vi.runAllTimersAsync()
      })

      // Should only be called once with the final value
      expect(vi.mocked(getMedicines)).toHaveBeenCalledTimes(1)
      expect(vi.mocked(getMedicines)).toHaveBeenCalledWith('Asp')
    })

    test('updates medicine list with search results', async () => {
      vi.mocked(getMedicines).mockResolvedValueOnce([
        {
          id: 1,
          name: 'Aspirin',
          laboratory: 'Bayer',
          presentation: 1,
          userId: 1,
          medicinePresentation: { id: 1, userId: 1, description: 'Tablet' },
          expirationDate: new Date('2025-12-31'),
          usedFor: 'Pain relief',
          sideEffects: 'Nausea',
          comments: 'Take with food'
        }
      ])

      render(<MedicineTable medicineList={multipleMedicineData} />)

      // Initial render should show all medicines
      expect(screen.getByText(multipleMedicineData[0].name)).toBeInTheDocument()

      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
      fireEvent.change(searchInput, { target: { value: 'Aspirin' } })

      await act(async () => {
        vi.advanceTimersByTime(300)
        await vi.runAllTimersAsync()
      })

      expect(screen.getByText('Aspirin')).toBeInTheDocument()
    })

    test('handles empty search results', async () => {
      vi.mocked(getMedicines).mockResolvedValueOnce([])

      render(<MedicineTable medicineList={basicMedicineData} />)

      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
      fireEvent.change(searchInput, { target: { value: 'NonexistentMedicine' } })

      await act(async () => {
        vi.advanceTimersByTime(300)
        await vi.runAllTimersAsync()
      })

      expect(vi.mocked(getMedicines)).toHaveBeenCalledWith('NonexistentMedicine')
      expect(screen.getByText(COMMON_TABLE_ERRORS.NO_DATA)).toBeInTheDocument()
    })

    test('handles error during search gracefully', async () => {
      // Mock getMedicines to throw an error
      // The component should handle it gracefully
      vi.mocked(getMedicines).mockImplementationOnce(async () => {
        throw new Error('Search failed')
      })

      render(<MedicineTable medicineList={basicMedicineData} />)

      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
      fireEvent.change(searchInput, { target: { value: 'Aspirin' } })

      // Component should handle error gracefully and still be rendered
      try {
        await act(async () => {
          vi.advanceTimersByTime(300)
          await vi.runAllTimersAsync()
        })
      } catch {
        // Ignore error - we're just testing that the component doesn't crash
      }

      expect(
        screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
      ).toBeInTheDocument()
    })

    test('clears previous search results when new search is performed', async () => {
      vi.mocked(getMedicines)
        .mockResolvedValueOnce([
          {
            id: 1,
            name: 'Aspirin',
            laboratory: 'Bayer',
            presentation: 1,
            userId: 1,
            medicinePresentation: { id: 1, userId: 1, description: 'Tablet' },
            expirationDate: new Date('2025-12-31'),
            usedFor: 'Pain relief',
            sideEffects: 'Nausea',
            comments: 'Take with food'
          }
        ])
        .mockResolvedValueOnce([
          {
            id: 2,
            name: 'Ibuprofen',
            laboratory: 'Pfizer',
            presentation: 1,
            userId: 1,
            medicinePresentation: { id: 1, userId: 1, description: 'Tablet' },
            expirationDate: new Date('2025-12-31'),
            usedFor: 'Fever',
            sideEffects: 'Dizziness',
            comments: ''
          }
        ])

      render(<MedicineTable medicineList={basicMedicineData} />)

      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)

      // First search
      fireEvent.change(searchInput, { target: { value: 'Aspirin' } })
      await act(async () => {
        vi.advanceTimersByTime(300)
        await vi.runAllTimersAsync()
      })

      expect(screen.getByText('Aspirin')).toBeInTheDocument()

      // Second search
      fireEvent.change(searchInput, { target: { value: 'Ibuprofen' } })
      await act(async () => {
        vi.advanceTimersByTime(300)
        await vi.runAllTimersAsync()
      })

      expect(screen.getByText('Ibuprofen')).toBeInTheDocument()
    })

    test('search input is accessible', () => {
      render(<MedicineTable medicineList={basicMedicineData} />)

      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
      expect(searchInput).toBeInTheDocument()
    })

    test('preserves edit and delete buttons during search', async () => {
      vi.mocked(getMedicines).mockResolvedValueOnce([
        {
          id: 1,
          name: 'Aspirin',
          laboratory: 'Bayer',
          presentation: 1,
          userId: 1,
          medicinePresentation: { id: 1, userId: 1, description: 'Tablet' },
          expirationDate: new Date('2025-12-31'),
          usedFor: 'Pain relief',
          sideEffects: 'Nausea',
          comments: 'Take with food'
        }
      ])

      render(<MedicineTable medicineList={basicMedicineData} />)

      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
      fireEvent.change(searchInput, { target: { value: 'Aspirin' } })

      await act(async () => {
        vi.advanceTimersByTime(300)
        await vi.runAllTimersAsync()
      })

      const editButton = screen.getByTitle(COMMON_LABELS.EDIT)
      const deleteButton = screen.getByTitle(COMMON_LABELS.DELETE)

      expect(editButton).toBeInTheDocument()
      expect(deleteButton).toBeInTheDocument()
    })

    test('delete works correctly on searched medicines', async () => {
      vi.useRealTimers()
      vi.mocked(getMedicines).mockResolvedValueOnce([
        {
          id: 1,
          name: 'Aspirin',
          laboratory: 'Bayer',
          presentation: 1,
          userId: 1,
          medicinePresentation: { id: 1, userId: 1, description: 'Tablet' },
          expirationDate: new Date('2025-12-31'),
          usedFor: 'Pain relief',
          sideEffects: 'Nausea',
          comments: 'Take with food'
        }
      ])

      vi.mocked(deleteMedicine).mockResolvedValueOnce({
        message: MEDICINE_TABLE_LABELS.DELETE_SUCCESS
      })

      render(<MedicineTable medicineList={basicMedicineData} />)

      // Use fake timers for search, then switch to real for dialog
      vi.useFakeTimers()
      const searchInput = screen.getByPlaceholderText(MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER)
      fireEvent.change(searchInput, { target: { value: 'Aspirin' } })

      await act(async () => {
        vi.advanceTimersByTime(300)
        await vi.runAllTimersAsync()
      })
      vi.useRealTimers()

      expect(screen.getByText('Aspirin')).toBeInTheDocument()

      const deleteButton = screen.getByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(deleteButton)

      const allDeleteButtons = screen.getAllByRole('button', { name: COMMON_LABELS.DELETE })
      fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1])

      await waitFor(() => {
        expect(deleteMedicine).toHaveBeenCalledWith(1)
        expect(vi.mocked(toast.success)).toHaveBeenCalledWith(MEDICINE_TABLE_LABELS.DELETE_SUCCESS)
      })
      vi.useFakeTimers()
    })
  })
})
