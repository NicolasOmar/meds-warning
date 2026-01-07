import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import CreateUserPage from './page'

// Mock the UserForm component to avoid testing the entire form in this page test
vi.mock('@form-components/UserForm', () => ({
  default: () => <div data-testid="user-form">User Form Component</div>
}))

describe('[CreateUserPage]', () => {
  test('renders the create user page', () => {
    render(<CreateUserPage />)
    expect(screen.getByTestId('user-form')).toBeInTheDocument()
  })

  test('renders UserForm component', () => {
    render(<CreateUserPage />)
    const userForm = screen.getByText('User Form Component')
    expect(userForm).toBeInTheDocument()
  })

  test('page exports CreateUserPage as default', () => {
    expect(CreateUserPage).toBeDefined()
  })

  test('renders without errors', () => {
    expect(() => render(<CreateUserPage />)).not.toThrow()
  })

  test('renders a single UserForm component', () => {
    render(<CreateUserPage />)
    const forms = screen.getAllByTestId('user-form')
    expect(forms.length).toBe(1)
  })

  test('UserForm component is in the document', () => {
    const { container } = render(<CreateUserPage />)
    expect(container.querySelector('[data-testid="user-form"]')).toBeInTheDocument()
  })
})
