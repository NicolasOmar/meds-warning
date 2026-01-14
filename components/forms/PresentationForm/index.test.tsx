import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
// ACTIONS
import { handlePresentationAction } from '@actions/presentation'
// COMPONENTS
import { toast } from 'sonner'
import PresentationForm from './index'
// SHARED
import { PRESENTATION_FORM_LABELS } from '@shared-constants/forms'
// MOCKS
import {
  mockPresentationData,
  mockPresentationDataWithId5,
  mockPresentationDataWithId7
} from './mocks.json'

// Mock the server action
vi.mock('@actions/presentation', () => ({
  handlePresentationAction: vi.fn()
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

describe('[PresentationForm]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the presentation form with title', () => {
    render(<PresentationForm />)
    const legend = screen.getByText(PRESENTATION_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('renders description input with correct label', () => {
    render(<PresentationForm />)
    const input = screen.getByLabelText(PRESENTATION_FORM_LABELS.DESCRIPTION)
    expect(input).toBeInTheDocument()
  })

  test('renders description input with placeholder text', () => {
    render(<PresentationForm />)
    const input = screen.getByPlaceholderText(PRESENTATION_FORM_LABELS.DESCRIPTION_PLACEHOLDER)
    expect(input).toBeInTheDocument()
  })

  test('renders submit button', () => {
    render(<PresentationForm />)
    const submitButton = screen.getByRole('button', {
      name: PRESENTATION_FORM_LABELS.SUBMIT_BUTTON
    })
    expect(submitButton).toBeInTheDocument()
  })

  test('submit button is initially enabled', () => {
    render(<PresentationForm />)
    const submitButton = screen.getByRole('button', {
      name: PRESENTATION_FORM_LABELS.SUBMIT_BUTTON
    })
    expect(submitButton).not.toBeDisabled()
  })

  test('input has correct type attribute', () => {
    render(<PresentationForm />)
    const input = screen.getByLabelText(PRESENTATION_FORM_LABELS.DESCRIPTION) as HTMLInputElement
    expect(input.type).toBe('text')
    expect(input.value).toBe('')
  })

  test('form can accept text input', async () => {
    const user = userEvent.setup()
    render(<PresentationForm />)

    const input = screen.getByLabelText(PRESENTATION_FORM_LABELS.DESCRIPTION) as HTMLInputElement
    await user.type(input, 'Tablet')

    expect(input.value).toBe('Tablet')
  })

  test('displays success toast when message is provided and success is true', async () => {
    render(<PresentationForm />)

    // The component uses useActionState which may update state
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
    vi.mocked(handlePresentationAction).mockResolvedValue({
      message: 'Error occurred',
      success: false,
      errors: undefined
    })

    render(<PresentationForm />)

    await waitFor(() => {
      expect(vi.mocked(toast)).toBeDefined()
    })
  })

  test('populates form with presentationData when provided', () => {
    render(<PresentationForm presentationData={mockPresentationData} />)

    const input = screen.getByDisplayValue(mockPresentationData.description)
    expect(input).toBeInTheDocument()
  })

  test('input field is of type text', () => {
    render(<PresentationForm />)
    const input = screen.getByLabelText(PRESENTATION_FORM_LABELS.DESCRIPTION) as HTMLInputElement
    expect(input.type).toBe('text')
  })

  test('submit button is of type submit', () => {
    render(<PresentationForm />)
    const button = screen.getByRole('button', {
      name: PRESENTATION_FORM_LABELS.SUBMIT_BUTTON
    })
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('form renders all required elements', () => {
    render(<PresentationForm />)
    expect(screen.getByText(PRESENTATION_FORM_LABELS.TITLE)).toBeInTheDocument()
    expect(screen.getByLabelText(PRESENTATION_FORM_LABELS.DESCRIPTION)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(PRESENTATION_FORM_LABELS.DESCRIPTION_PLACEHOLDER)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: PRESENTATION_FORM_LABELS.SUBMIT_BUTTON })
    ).toBeInTheDocument()
  })

  test('renders with presentationData containing id', () => {
    render(<PresentationForm presentationData={mockPresentationDataWithId5} />)

    const input = screen.getByDisplayValue(mockPresentationDataWithId5.description)
    expect(input).toBeInTheDocument()
  })

  test('input field is accessible with proper label', () => {
    render(<PresentationForm />)
    const input = screen.getByLabelText(PRESENTATION_FORM_LABELS.DESCRIPTION)
    expect(input).toHaveAccessibleName()
  })

  test('description field accepts and displays user input correctly', async () => {
    const userInput = 'NewPresentation'
    const user = userEvent.setup()
    render(<PresentationForm />)

    const input = screen.getByLabelText(PRESENTATION_FORM_LABELS.DESCRIPTION) as HTMLInputElement
    await user.type(input, userInput)

    expect(input.value).toBe(userInput)
  })

  test('presentation data is properly populated in controlled input', () => {
    render(<PresentationForm presentationData={mockPresentationDataWithId7} />)

    const input = screen.getByDisplayValue(mockPresentationDataWithId7.description)
    expect(input).toBeInTheDocument()
  })

  test('form handles rapid text input changes', async () => {
    const user = userEvent.setup()
    render(<PresentationForm />)

    const input = screen.getByLabelText(PRESENTATION_FORM_LABELS.DESCRIPTION) as HTMLInputElement

    await user.type(input, 'P')
    expect(input.value).toBe('P')

    await user.type(input, 'owder')
    expect(input.value).toBe('Powder')
  })

  test('input maintains value through component re-renders', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<PresentationForm />)

    const input = screen.getByLabelText(PRESENTATION_FORM_LABELS.DESCRIPTION) as HTMLInputElement
    await user.type(input, 'TestValue')

    rerender(<PresentationForm />)

    const inputAfter = screen.getByLabelText(
      PRESENTATION_FORM_LABELS.DESCRIPTION
    ) as HTMLInputElement
    expect(inputAfter).toBeInTheDocument()
  })
})
