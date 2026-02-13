import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import ForgotPasswordForm from './index'
// SHARED
import { FORGOT_PASSWORD_FORM_LABELS } from '@shared-constants/forms'

vi.mock('@actions/password', () => ({
  handleForgotPasswordAction: vi.fn()
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

vi.mock('@shared-functions/forms', () => ({
  handleCommonFormState: vi.fn()
}))

describe('[ForgotPasswordForm]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders forgot password form with title', () => {
    render(<ForgotPasswordForm />)
    const legend = screen.getByText(FORGOT_PASSWORD_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('renders subtitle', () => {
    render(<ForgotPasswordForm />)
    const subtitle = screen.getByText(FORGOT_PASSWORD_FORM_LABELS.SUBTITLE)
    expect(subtitle).toBeInTheDocument()
  })

  test('renders email input field', () => {
    render(<ForgotPasswordForm />)
    const emailInput = screen.getByLabelText(FORGOT_PASSWORD_FORM_LABELS.EMAIL)
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('renders email placeholder', () => {
    render(<ForgotPasswordForm />)
    const emailInput = screen.getByPlaceholderText(FORGOT_PASSWORD_FORM_LABELS.EMAIL_PLACEHOLDER)
    expect(emailInput).toBeInTheDocument()
  })

  test('renders submit button', () => {
    render(<ForgotPasswordForm />)
    const button = screen.getByRole('button', { name: FORGOT_PASSWORD_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('renders back to login link', () => {
    render(<ForgotPasswordForm />)
    const link = screen.getByText(FORGOT_PASSWORD_FORM_LABELS.BACK_TO_LOGIN)
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/login')
  })

  test('form has correct structure', () => {
    const { container } = render(<ForgotPasswordForm />)
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('flex')
  })

  test('renders within centered container', () => {
    const { container } = render(<ForgotPasswordForm />)
    const wrapper = container.querySelector('.flex.min-h-screen')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass('items-center', 'justify-center')
  })

  test('form has max width constraint', () => {
    const { container } = render(<ForgotPasswordForm />)
    const form = container.querySelector('form')
    expect(form).toHaveClass('max-w-md')
  })

  test('calls handleCommonFormState when component mounts', async () => {
    const { handleCommonFormState } = await import('@shared-functions/forms')
    render(<ForgotPasswordForm />)

    await waitFor(() => {
      expect(handleCommonFormState).toHaveBeenCalled()
    })
  })

  test('displays email input field in all states', () => {
    render(<ForgotPasswordForm />)
    expect(screen.getByLabelText(FORGOT_PASSWORD_FORM_LABELS.EMAIL)).toBeInTheDocument()
  })

  test('renders FieldGroup component', () => {
    const { container } = render(<ForgotPasswordForm />)
    const fieldGroup = container.querySelector('[role="group"]')
    expect(fieldGroup).toBeInTheDocument()
  })
})
