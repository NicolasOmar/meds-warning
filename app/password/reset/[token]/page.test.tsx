import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import ResetPasswordPage from './page'
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

describe('[ResetPasswordPage]', () => {
  test('renders ResetPasswordForm with token parameter', async () => {
    const params = Promise.resolve({ token: 'test-token-123' })
    const component = await ResetPasswordPage({ params })
    render(component)

    const legend = screen.getByText(RESET_PASSWORD_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('passes token to ResetPasswordForm component', async () => {
    const params = Promise.resolve({ token: 'abc-xyz-token' })
    const component = await ResetPasswordPage({ params })
    const { container } = render(component)

    const hiddenTokenInput = container.querySelector('input[type="hidden"][name="token"]')
    expect(hiddenTokenInput).toHaveValue('abc-xyz-token')
  })

  test('renders password fields', async () => {
    const params = Promise.resolve({ token: 'test-token' })
    const component = await ResetPasswordPage({ params })
    render(component)

    const passwordInput = screen.getByLabelText(RESET_PASSWORD_FORM_LABELS.PASSWORD)
    const confirmPasswordInput = screen.getByLabelText(RESET_PASSWORD_FORM_LABELS.CONFIRM_PASSWORD)
    expect(passwordInput).toBeInTheDocument()
    expect(confirmPasswordInput).toBeInTheDocument()
  })

  test('renders submit button', async () => {
    const params = Promise.resolve({ token: 'test-token' })
    const component = await ResetPasswordPage({ params })
    render(component)

    const button = screen.getByRole('button', { name: RESET_PASSWORD_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).toBeInTheDocument()
  })
})
