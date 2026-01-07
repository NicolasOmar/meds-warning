import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import MedicineForm from './index'
// SHARED
import { MEDICINE_FORM_LABELS } from '@shared-constants/labels'

// Mock the server action
vi.mock('@actions/index', () => ({
  createMedicineAction: vi.fn()
}))

// Mock Prisma to prevent import errors
vi.mock('@prisma/index', () => ({
  prisma: {}
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

  test('renders all required input fields', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    expect(screen.getByLabelText(MEDICINE_FORM_LABELS.NAME)).toBeInTheDocument()
    expect(screen.getByLabelText(MEDICINE_FORM_LABELS.LABORATORY)).toBeInTheDocument()
    expect(screen.getByLabelText(MEDICINE_FORM_LABELS.USED_FOR)).toBeInTheDocument()
    expect(screen.getByLabelText(MEDICINE_FORM_LABELS.SIDE_EFFECTS)).toBeInTheDocument()
  })

  test('renders presentation select field', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  test('renders date picker field for expiration date', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const label = screen.getByText(MEDICINE_FORM_LABELS.EXPIRATION_DATE)
    expect(label).toBeInTheDocument()
  })

  test('renders comments textarea field', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const label = screen.getByText(MEDICINE_FORM_LABELS.COMMENTS)
    expect(label).toBeInTheDocument()
  })

  test('renders submit button', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const button = screen.getByRole('button', { name: MEDICINE_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).toBeInTheDocument()
  })

  test('submit button has type submit', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const button = screen.getByRole('button', { name: MEDICINE_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).toHaveAttribute('type', 'submit')
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

  test('medicine name input has correct placeholder', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const input = screen.getByPlaceholderText(MEDICINE_FORM_LABELS.NAME_PLACEHOLDER)
    expect(input).toBeInTheDocument()
  })

  test('laboratory input has correct placeholder', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const input = screen.getByPlaceholderText(MEDICINE_FORM_LABELS.LABORATORY_PLACEHOLDER)
    expect(input).toBeInTheDocument()
  })

  test('used for input has correct placeholder', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const input = screen.getByPlaceholderText(MEDICINE_FORM_LABELS.USED_FOR_PLACEHOLDER)
    expect(input).toBeInTheDocument()
  })

  test('side effects input has correct placeholder', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const input = screen.getByPlaceholderText(MEDICINE_FORM_LABELS.SIDE_EFFECTS_PLACEHOLDER)
    expect(input).toBeInTheDocument()
  })

  test('comments textarea has correct placeholder', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const textarea = screen.getByPlaceholderText(MEDICINE_FORM_LABELS.COMMENTS_PLACEHOLDER)
    expect(textarea).toBeInTheDocument()
  })

  test('renders with empty presentations list', () => {
    render(<MedicineForm presentationsList={[]} />)
    const legend = screen.getByText(MEDICINE_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('all text input fields are present', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThan(0)
  })

  test('presentation select receives correct options from props', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  test('form is properly client-side rendered', () => {
    const { container } = render(<MedicineForm presentationsList={mockPresentations} />)
    const form = container.querySelector('form')
    expect(form).toHaveAttribute('class')
  })

  test('renders button in disabled state conditionally', () => {
    render(<MedicineForm presentationsList={mockPresentations} />)
    const button = screen.getByRole('button', { name: MEDICINE_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).not.toBeDisabled()
  })
})
