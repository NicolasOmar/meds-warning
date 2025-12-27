import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

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
    const legend = screen.getByText('Create an user')
    expect(legend).toBeInTheDocument()
  })

  test('renders all form field labels', () => {
    render(<UserForm />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Liked Movie')).toBeInTheDocument()
  })

  test('renders the name field with correct type', () => {
    render(<UserForm />)
    const nameInput = screen.getByLabelText('Name')
    expect(nameInput).toHaveAttribute('type', 'text')
    expect(nameInput).toHaveAttribute('name', 'name')
  })

  test('renders the email field with correct type', () => {
    render(<UserForm />)
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('name', 'email')
  })

  test('renders the submit button with subscribe text', () => {
    render(<UserForm />)
    const button = screen.getByRole('button', { name: /subscribe/i })
    expect(button).toBeInTheDocument()
  })

  test('submit button is not disabled initially', () => {
    render(<UserForm />)
    const button = screen.getByRole('button', { name: /subscribe/i })
    expect(button).not.toBeDisabled()
  })

  test('all text inputs are required', () => {
    render(<UserForm />)
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach(input => {
      expect(input).toBeRequired()
    })
  })

  test('email input is required', () => {
    render(<UserForm />)
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toBeRequired()
  })
})
