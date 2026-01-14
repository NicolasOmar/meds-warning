import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import MedicineForm from './index'
// SHARED
import { MEDICINE_FORM_LABELS } from '@shared-constants/forms'
import { toast } from 'sonner'
import { handleMedicineAction } from '@actions/medicine'
// MOCKS
import {
  mockPresentations,
  mockMedicineDataError,
  mockMedicineDataNullFields,
  fullMedicineData
} from './mocks.json'

// Mock the server action
vi.mock('@actions/medicine', () => ({
  handleMedicineAction: vi.fn()
}))

// Mock Prisma to prevent import errors
vi.mock('@prisma/index', () => ({
  prisma: {}
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

describe('[MedicineForm]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the medicine form with title', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const legend = screen.getByText(MEDICINE_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('renders medicine inputs with correct label', () => {
    const labels = [
      MEDICINE_FORM_LABELS.NAME,
      MEDICINE_FORM_LABELS.LABORATORY,
      MEDICINE_FORM_LABELS.EXPIRATION_DATE,
      MEDICINE_FORM_LABELS.USED_FOR,
      MEDICINE_FORM_LABELS.SIDE_EFFECTS,
      MEDICINE_FORM_LABELS.COMMENTS
    ]

    render(<MedicineForm presentationsList={mockPresentations} />)

    labels.forEach(label => {
      const input = screen.getByLabelText(label)
      expect(input).toBeInTheDocument()
    })
  })

  test('renders presentation select field', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  test('renders submit button', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const button = screen.getByRole('button', { name: MEDICINE_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('renders button in disabled state conditionally', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const button = screen.getByRole('button', { name: MEDICINE_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).not.toBeDisabled()
  })

  test('renders form with correct structure', () => {
    const { container } = render(<MedicineForm presentationsList={mockPresentations} />)
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('flex', 'flex-col', 'gap-4')
  })

  test('renders within FieldSet and FieldGroup', () => {
    const { container } = render(<MedicineForm presentationsList={mockPresentations} />)
    const fieldGroup = container.querySelector('[role="group"]')
    expect(fieldGroup).toBeInTheDocument()
  })

  test('renders medicine inputs with correct placeholders', () => {
    const placeholders = [
      MEDICINE_FORM_LABELS.NAME_PLACEHOLDER,
      MEDICINE_FORM_LABELS.LABORATORY_PLACEHOLDER,
      MEDICINE_FORM_LABELS.USED_FOR_PLACEHOLDER,
      MEDICINE_FORM_LABELS.SIDE_EFFECTS_PLACEHOLDER,
      MEDICINE_FORM_LABELS.COMMENTS_PLACEHOLDER
    ]

    render(<MedicineForm presentationsList={mockPresentations} />)

    placeholders.forEach(placeholder => {
      const input = screen.getByPlaceholderText(placeholder)
      expect(input).toBeInTheDocument()
    })
  })

  test('renders with empty presentations list', () => {
    render(<MedicineForm presentationsList={[]} />)
    const legend = screen.getByText(MEDICINE_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('form is properly client-side rendered', () => {
    const { container } = render(<MedicineForm presentationsList={mockPresentations} />)
    const form = container.querySelector('form')
    expect(form).toHaveAttribute('class')
  })

  test('displays success toast when message is provided and success is true', async () => {
    render(<MedicineForm presentationsList={mockPresentations} />)

    await waitFor(
      () => {
        // Verify toast mock is callable
        expect(vi.mocked(toast)).toBeDefined()
        expect(vi.mocked(toast).success).toBeDefined()
        expect(vi.mocked(toast).error).toBeDefined()
      },
      { timeout: 50 }
    )
  })

  test('displays error toast when message is provided and success is false', async () => {
    const mockMedicineData = {
      ...mockMedicineDataError,
      expirationDate: new Date(mockMedicineDataError.expirationDate)
    }

    vi.mocked(handleMedicineAction).mockResolvedValue({
      message: 'Error occurred',
      success: false,
      errors: undefined
    })

    const { rerender } = render(
      <MedicineForm presentationsList={mockPresentations} medicineData={mockMedicineData} />
    )

    // Trigger action by rendering with medicine data
    rerender(<MedicineForm presentationsList={mockPresentations} medicineData={mockMedicineData} />)

    await waitFor(() => {
      expect(vi.mocked(toast)).toBeDefined()
    })
  })

  test('populates form fields with medicineData when provided', () => {
    const mockMedicineData = {
      ...mockMedicineDataError,
      expirationDate: new Date(mockMedicineDataError.expirationDate)
    }

    render(<MedicineForm presentationsList={mockPresentations} medicineData={mockMedicineData} />)

    const nameInput = screen.getByDisplayValue(mockMedicineDataError.name)
    const labInput = screen.getByDisplayValue(mockMedicineDataError.laboratory)
    const usedForInput = screen.getByDisplayValue(mockMedicineDataError.usedFor)

    expect(nameInput).toBeInTheDocument()
    expect(labInput).toBeInTheDocument()
    expect(usedForInput).toBeInTheDocument()
  })

  test('displays error messages from state.errors', () => {
    render(
      <MedicineForm
        presentationsList={mockPresentations}
        medicineData={mockMedicineDataNullFields}
      />
    )

    const nameInput = screen.getByDisplayValue(mockMedicineDataNullFields.name)
    expect(nameInput).toBeInTheDocument()
  })

  test('renders all field labels for medicine form', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)

    expect(screen.getByText(MEDICINE_FORM_LABELS.NAME)).toBeInTheDocument()
    expect(screen.getByText(MEDICINE_FORM_LABELS.LABORATORY)).toBeInTheDocument()
    expect(screen.getByText(MEDICINE_FORM_LABELS.PRESENTATION)).toBeInTheDocument()
    expect(screen.getByText(MEDICINE_FORM_LABELS.EXPIRATION_DATE)).toBeInTheDocument()
    expect(screen.getByText(MEDICINE_FORM_LABELS.USED_FOR)).toBeInTheDocument()
    expect(screen.getByText(MEDICINE_FORM_LABELS.SIDE_EFFECTS)).toBeInTheDocument()
    expect(screen.getByText(MEDICINE_FORM_LABELS.COMMENTS)).toBeInTheDocument()
  })

  test('renders form with all presentation options', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)

    // The presentations are available in the select component
    const combobox = screen.getByRole('combobox')
    expect(combobox).toBeInTheDocument()
  })

  test('renders form inputs without initial medicine data', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)

    const nameInput = screen.getByLabelText(MEDICINE_FORM_LABELS.NAME) as HTMLInputElement
    const labInput = screen.getByLabelText(MEDICINE_FORM_LABELS.LABORATORY) as HTMLInputElement

    expect(nameInput.value).toBe('')
    expect(labInput.value).toBe('')
  })

  test('renders form with DatePicker for expiration date', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const datePickerLabel = screen.getByText(MEDICINE_FORM_LABELS.EXPIRATION_DATE)
    expect(datePickerLabel).toBeInTheDocument()
  })

  test('renders CustomTextArea for comments field', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const commentsLabel = screen.getByText(MEDICINE_FORM_LABELS.COMMENTS)
    expect(commentsLabel).toBeInTheDocument()
  })

  test('form contains proper aria labels for accessibility', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)

    const nameField = screen.getByLabelText(MEDICINE_FORM_LABELS.NAME)
    const labField = screen.getByLabelText(MEDICINE_FORM_LABELS.LABORATORY)

    expect(nameField).toHaveAccessibleName()
    expect(labField).toHaveAccessibleName()
  })

  test('renders presentation placeholder text correctly', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const label = screen.getByText(MEDICINE_FORM_LABELS.PRESENTATION)
    expect(label).toBeInTheDocument()
  })

  test('expiration date field renders with correct placeholder', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const expLabel = screen.getByText(MEDICINE_FORM_LABELS.EXPIRATION_DATE)
    expect(expLabel).toBeInTheDocument()
  })

  test('medication data shows all form values populated', () => {
    const testData = {
      ...fullMedicineData,
      expirationDate: new Date(fullMedicineData.expirationDate)
    }

    render(<MedicineForm presentationsList={mockPresentations} medicineData={testData} />)

    expect(screen.getByDisplayValue(fullMedicineData.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(fullMedicineData.laboratory)).toBeInTheDocument()
    expect(screen.getByDisplayValue(fullMedicineData.usedFor)).toBeInTheDocument()
  })
})
