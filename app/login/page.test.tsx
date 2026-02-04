import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginPage from './page'
import { LOGIN_FORM_LABELS } from '@shared-constants/forms'

vi.mock('@actions/auth', () => ({
  handleLoginAction: vi.fn()
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

describe('[LoginPage]', () => {
  test('renders LoginForm component', () => {
    render(<LoginPage />)
    const legend = screen.getByText(LOGIN_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('renders email and password fields', () => {
    render(<LoginPage />)
    const emailInput = screen.getByLabelText(LOGIN_FORM_LABELS.EMAIL)
    const passwordInput = screen.getByLabelText(LOGIN_FORM_LABELS.PASSWORD)
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  test('renders submit button', () => {
    render(<LoginPage />)
    const button = screen.getByRole('button', { name: LOGIN_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).toBeInTheDocument()
  })
})
