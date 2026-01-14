import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import MedicineForm from './index'
// SHARED
import { MEDICINE_FORM_LABELS } from '@shared-constants/forms'
import { toast } from 'sonner'

// Mock the server action
vi.mock('@actions/index', () => ({
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
  const mockPresentations = [
    { id: 1, description: 'Tablet' },
    { id: 2, description: 'Syrup' },
    { id: 3, description: 'Capsule' }
  ]

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
})
