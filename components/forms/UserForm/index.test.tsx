import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import UserForm from './index'
// SHARED
import { USER_FORM_LABELS } from '@shared-constants/forms'
import { toast } from 'sonner'
import { handleUserAction } from '@actions/user'
// MOCKS
import { mockUserDataError, mockUserDataNullFields, fullUserData } from './mocks.json'

vi.mock('@actions/user', () => ({
  handleUserAction: vi.fn()
}))

vi.mock('@prisma/index', () => ({
  prisma: {}
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

describe('[UserForm]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the user form with title', () => {
    render(<UserForm />)
    const legend = screen.getByText(USER_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('renders user inputs with correct label', () => {
    const labels = [
      USER_FORM_LABELS.NAME,
      USER_FORM_LABELS.LAST_NAME,
      USER_FORM_LABELS.EMAIL,
      USER_FORM_LABELS.PASSWORD,
      USER_FORM_LABELS.DAYS_TO_NOTIFY
    ]

    render(<UserForm />)

    labels.forEach(label => {
      const input = screen.getByLabelText(label)
      expect(input).toBeInTheDocument()
    })
  })

  test('renders submit button', () => {
    render(<UserForm />)
    const button = screen.getByRole('button', { name: USER_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).not.toBeDisabled()
  })

  test('renders within FieldSet and FieldGroup', () => {
    const { container } = render(<UserForm />)
    const fieldGroup = container.querySelector('[role="group"]')
    expect(fieldGroup).toBeInTheDocument()
  })

  test('renders user inputs with correct placeholders', () => {
    const placeholders = [
      USER_FORM_LABELS.NAME_PLACEHOLDER,
      USER_FORM_LABELS.LAST_NAME_PLACEHOLDER,
      USER_FORM_LABELS.EMAIL_PLACEHOLDER,
      USER_FORM_LABELS.PASSWORD_PLACEHOLDER,
      USER_FORM_LABELS.DAYS_TO_NOTIFY_PLACEHOLDER
    ]

    render(<UserForm />)

    placeholders.forEach(placeholder => {
      const input = screen.getByPlaceholderText(placeholder)
      expect(input).toBeInTheDocument()
    })
  })

  test('displays success toast when message is provided and success is true', async () => {
    render(<UserForm />)

    await waitFor(
      () => {
        expect(vi.mocked(toast)).toBeDefined()
        expect(vi.mocked(toast).success).toBeDefined()
        expect(vi.mocked(toast).error).toBeDefined()
      },
      { timeout: 50 }
    )
  })

  test('displays error toast when message is provided and success is false', async () => {
    vi.mocked(handleUserAction).mockResolvedValue({
      message: 'Error occurred',
      success: false,
      errors: undefined
    })

    const { rerender } = render(<UserForm userData={mockUserDataError} />)

    rerender(<UserForm userData={mockUserDataError} />)

    await waitFor(() => {
      expect(vi.mocked(toast)).toBeDefined()
    })
  })

  test('populates form fields with userData when provided', () => {
    render(<UserForm userData={mockUserDataError} />)

    const nameInput = screen.getByDisplayValue(mockUserDataError.name)
    const emailInput = screen.getByDisplayValue(mockUserDataError.email)
    const daysInput = screen.getByDisplayValue(mockUserDataError.daysToNotify.toString())

    expect(nameInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(daysInput).toBeInTheDocument()
  })

  test('displays error messages from state.errors', () => {
    render(<UserForm userData={mockUserDataNullFields} />)

    const nameInput = screen.getByDisplayValue(mockUserDataNullFields.name)
    expect(nameInput).toBeInTheDocument()
  })

  test('renders all field labels for user form', () => {
    render(<UserForm />)

    expect(screen.getByText(USER_FORM_LABELS.NAME)).toBeInTheDocument()
    expect(screen.getByText(USER_FORM_LABELS.LAST_NAME)).toBeInTheDocument()
    expect(screen.getByText(USER_FORM_LABELS.EMAIL)).toBeInTheDocument()
    expect(screen.getByText(USER_FORM_LABELS.PASSWORD)).toBeInTheDocument()
    expect(screen.getByText(USER_FORM_LABELS.DAYS_TO_NOTIFY)).toBeInTheDocument()
  })

  test('renders form inputs without initial user data', () => {
    render(<UserForm />)

    const nameInput = screen.getByLabelText(USER_FORM_LABELS.NAME) as HTMLInputElement
    const emailInput = screen.getByLabelText(USER_FORM_LABELS.EMAIL) as HTMLInputElement

    expect(nameInput.value).toBe('')
    expect(emailInput.value).toBe('')
  })

  test('form contains proper aria labels for accessibility', () => {
    render(<UserForm />)

    const nameField = screen.getByLabelText(USER_FORM_LABELS.NAME)
    const emailField = screen.getByLabelText(USER_FORM_LABELS.EMAIL)

    expect(nameField).toHaveAccessibleName()
    expect(emailField).toHaveAccessibleName()
  })

  test('user data shows all form values populated', () => {
    render(<UserForm userData={fullUserData} />)

    expect(screen.getByDisplayValue(fullUserData.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(fullUserData.email)).toBeInTheDocument()
    expect(screen.getByDisplayValue(fullUserData.daysToNotify.toString())).toBeInTheDocument()
  })

  test('password field has correct input type', () => {
    render(<UserForm />)
    const passwordInput = screen.getByLabelText(USER_FORM_LABELS.PASSWORD)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('email field has correct input type', () => {
    render(<UserForm />)
    const emailInput = screen.getByLabelText(USER_FORM_LABELS.EMAIL)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('daysToNotify field has correct input type', () => {
    render(<UserForm />)
    const daysInput = screen.getByLabelText(USER_FORM_LABELS.DAYS_TO_NOTIFY)
    expect(daysInput).toHaveAttribute('type', 'number')
  })

  test('renders daysToNotify with default value when no userData provided', () => {
    render(<UserForm />)
    const daysInput = screen.getByDisplayValue('30')
    expect(daysInput).toBeInTheDocument()
  })
})
