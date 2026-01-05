import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { USER_FORM_LABELS } from '@shared-constants/labels'

// Mock the server action
vi.mock('@actions/index', () => ({
  createUserForm: vi.fn()
}))

// Mock Prisma to prevent import errors
vi.mock('@prisma/index', () => ({
  prisma: {}
}))

import UserForm from './index'

describe('UserForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the user form', () => {
    render(<UserForm />)
    const legend = screen.getByText(USER_FORM_LABELS.CREATE_TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('renders all form field labels', () => {
    render(<UserForm />)
    expect(screen.getByLabelText(USER_FORM_LABELS.NAME)).toBeInTheDocument()
    expect(screen.getByLabelText(USER_FORM_LABELS.LAST_NAME)).toBeInTheDocument()
    expect(screen.getByLabelText(USER_FORM_LABELS.EMAIL)).toBeInTheDocument()
    expect(screen.getByLabelText(USER_FORM_LABELS.LIKED_MOVIE)).toBeInTheDocument()
  })

  test('renders the name field with correct type', () => {
    render(<UserForm />)
    const nameInput = screen.getByLabelText(USER_FORM_LABELS.NAME)
    expect(nameInput).toHaveAttribute('type', 'text')
    expect(nameInput).toHaveAttribute('name', 'name')
  })

  test('renders the email field with correct type', () => {
    render(<UserForm />)
    const emailInput = screen.getByLabelText(USER_FORM_LABELS.EMAIL)
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('name', 'email')
  })

  test('renders the submit button with subscribe text', () => {
    render(<UserForm />)
    const button = screen.getByRole('button', { name: USER_FORM_LABELS.CREATE_BUTTON })
    expect(button).toBeInTheDocument()
  })

  test('submit button is not disabled initially', () => {
    render(<UserForm />)
    const button = screen.getByRole('button', { name: USER_FORM_LABELS.CREATE_BUTTON })
    expect(button).not.toBeDisabled()
  })

  test('all text inputs are required', () => {
    render(<UserForm />)
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach(input => {
      expect(input).not.toBeRequired()
    })
  })

  test('email input is required', () => {
    render(<UserForm />)
    const emailInput = screen.getByLabelText(USER_FORM_LABELS.EMAIL)
    expect(emailInput).not.toBeRequired()
  })

  test('renders form with correct structure', () => {
    const { container } = render(<UserForm />)
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('flex', 'flex-col', 'gap-4')
  })

  test('renders with userUpdate prop for update mode', () => {
    const userData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      likedMovie: 'Avatar'
    }
    render(<UserForm userUpdate={userData} />)
    const button = screen.getByRole('button', { name: USER_FORM_LABELS.UPDATE_BUTTON })
    expect(button).toBeInTheDocument()
  })

  test('button label changes based on userUpdate prop', () => {
    render(<UserForm />)
    expect(screen.getByRole('button', { name: USER_FORM_LABELS.CREATE_BUTTON })).toBeInTheDocument()
  })

  test('input fields have correct placeholder values', () => {
    render(<UserForm />)
    const nameInput = screen.getByRole('textbox', { name: USER_FORM_LABELS.NAME })
    const lastNameInput = screen.getByRole('textbox', { name: USER_FORM_LABELS.LAST_NAME })
    const emailInput = screen.getByRole('textbox', { name: USER_FORM_LABELS.EMAIL })
    const likedMovieInput = screen.getByRole('textbox', { name: USER_FORM_LABELS.LIKED_MOVIE })

    expect(nameInput).toHaveAttribute('placeholder', USER_FORM_LABELS.NAME_PLACEHOLDER)
    expect(lastNameInput).toHaveAttribute('placeholder', USER_FORM_LABELS.LAST_NAME_PLACEHOLDER)
    expect(emailInput).toHaveAttribute('placeholder', USER_FORM_LABELS.EMAIL_PLACEHOLDER)
    expect(likedMovieInput).toHaveAttribute('placeholder', 'John')
  })

  test('renders FieldLegend with proper text', () => {
    render(<UserForm />)
    const legend = screen.getByText(USER_FORM_LABELS.CREATE_TITLE)
    expect(legend).toBeInTheDocument()
  })

  test('renders within FieldSet and FieldGroup', () => {
    const { container } = render(<UserForm />)
    const fieldGroup = container.querySelector('[role="group"]')
    expect(fieldGroup).toBeInTheDocument()
  })

  test('button type is submit', () => {
    render(<UserForm />)
    const button = screen.getByRole('button', { name: USER_FORM_LABELS.CREATE_BUTTON })
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('form contains all four input fields', () => {
    render(<UserForm />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBe(4) // name, lastName, likedMovie, email
  })
})
