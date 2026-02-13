import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import ResetPasswordForm from './index'
// SHARED
import { RESET_PASSWORD_FORM_LABELS } from '@shared-constants/forms'

vi.mock('@actions/password', () => ({
  handleResetPasswordAction: vi.fn()
}))

vi.mock('@prisma/index', () => ({
  prisma: {}
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn()
  })
}))

describe('[ResetPasswordForm]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders reset password form with title', () => {
    render(<ResetPasswordForm token="test-token" />)
    const legend = screen.getByText(RESET_PASSWORD_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('renders subtitle', () => {
    render(<ResetPasswordForm token="test-token" />)
    const subtitle = screen.getByText(RESET_PASSWORD_FORM_LABELS.SUBTITLE)
    expect(subtitle).toBeInTheDocument()
  })

  test('renders password input field', () => {
    render(<ResetPasswordForm token="test-token" />)
    const passwordInput = screen.getByLabelText(RESET_PASSWORD_FORM_LABELS.PASSWORD)
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('renders confirm password input field', () => {
    render(<ResetPasswordForm token="test-token" />)
    const confirmInput = screen.getByLabelText(RESET_PASSWORD_FORM_LABELS.CONFIRM_PASSWORD)
    expect(confirmInput).toBeInTheDocument()
    expect(confirmInput).toHaveAttribute('type', 'password')
  })

  test('renders password placeholder', () => {
    render(<ResetPasswordForm token="test-token" />)
    const passwordInput = screen.getByPlaceholderText(
      RESET_PASSWORD_FORM_LABELS.PASSWORD_PLACEHOLDER
    )
    expect(passwordInput).toBeInTheDocument()
  })

  test('renders confirm password placeholder', () => {
    render(<ResetPasswordForm token="test-token" />)
    const confirmInput = screen.getByPlaceholderText(
      RESET_PASSWORD_FORM_LABELS.CONFIRM_PASSWORD_PLACEHOLDER
    )
    expect(confirmInput).toBeInTheDocument()
  })

  test('renders submit button', () => {
    render(<ResetPasswordForm token="test-token" />)
    const button = screen.getByRole('button', { name: RESET_PASSWORD_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('renders back to login link', () => {
    render(<ResetPasswordForm token="test-token" />)
    const link = screen.getByText(RESET_PASSWORD_FORM_LABELS.BACK_TO_LOGIN)
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/login')
  })

  test('includes hidden token input with correct value', () => {
    const { container } = render(<ResetPasswordForm token="test-token-123" />)
    const hiddenInput = container.querySelector('input[type="hidden"][name="token"]')
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput).toHaveValue('test-token-123')
  })

  test('form has correct structure', () => {
    const { container } = render(<ResetPasswordForm token="test-token" />)
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('flex')
  })

  test('renders within centered container', () => {
    const { container } = render(<ResetPasswordForm token="test-token" />)
    const wrapper = container.querySelector('.flex.min-h-screen')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass('items-center', 'justify-center')
  })

  test('form has max width constraint', () => {
    const { container } = render(<ResetPasswordForm token="test-token" />)
    const form = container.querySelector('form')
    expect(form).toHaveClass('max-w-md')
  })

  test('displays password input field in all states', () => {
    render(<ResetPasswordForm token="test-token" />)
    expect(screen.getByLabelText(RESET_PASSWORD_FORM_LABELS.PASSWORD)).toBeInTheDocument()
  })

  test('renders FieldGroup component', () => {
    const { container } = render(<ResetPasswordForm token="test-token" />)
    const fieldGroup = container.querySelector('[role="group"]')
    expect(fieldGroup).toBeInTheDocument()
  })

  test('renders both password fields', () => {
    render(<ResetPasswordForm token="test-token" />)
    expect(screen.getByLabelText(RESET_PASSWORD_FORM_LABELS.PASSWORD)).toBeInTheDocument()
    expect(screen.getByLabelText(RESET_PASSWORD_FORM_LABELS.CONFIRM_PASSWORD)).toBeInTheDocument()
  })
})
