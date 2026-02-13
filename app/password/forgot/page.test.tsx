import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import ForgotPasswordPage from './page'
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

describe('[ForgotPasswordPage]', () => {
  test('renders ForgotPasswordForm component', () => {
    render(<ForgotPasswordPage />)
    const legend = screen.getByText(FORGOT_PASSWORD_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('renders email input field', () => {
    render(<ForgotPasswordPage />)
    const emailInput = screen.getByLabelText(FORGOT_PASSWORD_FORM_LABELS.EMAIL)
    expect(emailInput).toBeInTheDocument()
  })

  test('renders submit button', () => {
    render(<ForgotPasswordPage />)
    const button = screen.getByRole('button', { name: FORGOT_PASSWORD_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).toBeInTheDocument()
  })

  test('renders back to login link', () => {
    render(<ForgotPasswordPage />)
    const link = screen.getByText(FORGOT_PASSWORD_FORM_LABELS.BACK_TO_LOGIN)
    expect(link).toBeInTheDocument()
  })
})
