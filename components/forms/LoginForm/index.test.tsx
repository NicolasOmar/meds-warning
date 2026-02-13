import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginForm from './index'
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

describe('[LoginForm]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders login form with title', () => {
    render(<LoginForm />)
    const legend = screen.getByText(LOGIN_FORM_LABELS.TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('renders email input field', () => {
    render(<LoginForm />)
    const emailInput = screen.getByLabelText(LOGIN_FORM_LABELS.EMAIL)
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('renders password input field', () => {
    render(<LoginForm />)
    const passwordInput = screen.getByLabelText(LOGIN_FORM_LABELS.PASSWORD)
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('renders submit button', () => {
    render(<LoginForm />)
    const button = screen.getByRole('button', { name: LOGIN_FORM_LABELS.SUBMIT_BUTTON })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('renders forgot password link', () => {
    render(<LoginForm />)
    const link = screen.getByText('Forgot password?')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/password/forgot')
  })

  test('renders create account link', () => {
    render(<LoginForm />)
    const link = screen.getByText(LOGIN_FORM_LABELS.CREATE_ACCOUNT)
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/user/create')
  })

  test('renders email placeholder', () => {
    render(<LoginForm />)
    const emailInput = screen.getByPlaceholderText(LOGIN_FORM_LABELS.EMAIL_PLACEHOLDER)
    expect(emailInput).toBeInTheDocument()
  })

  test('renders password placeholder', () => {
    render(<LoginForm />)
    const passwordInput = screen.getByPlaceholderText(LOGIN_FORM_LABELS.PASSWORD_PLACEHOLDER)
    expect(passwordInput).toBeInTheDocument()
  })

  test('form has correct structure', () => {
    const { container } = render(<LoginForm />)
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('flex')
  })

  test('renders within centered container', () => {
    const { container } = render(<LoginForm />)
    const wrapper = container.querySelector('.flex.min-h-screen')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass('items-center', 'justify-center')
  })

  test('form has max width constraint', () => {
    const { container } = render(<LoginForm />)
    const form = container.querySelector('form')
    expect(form).toHaveClass('max-w-md')
  })

  test('renders within FieldSet and FieldGroup', () => {
    const { container } = render(<LoginForm />)
    const fieldGroup = container.querySelector('[role="group"]')
    expect(fieldGroup).toBeInTheDocument()
  })
})
