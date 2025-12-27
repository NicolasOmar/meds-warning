import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

// Mock the server action
vi.mock('@actions/index', () => ({
  subscribeFindUserForm: vi.fn()
}))

// Mock Prisma to prevent import errors
vi.mock('@prisma/index', () => ({
  prisma: {}
}))

import { useRouter } from 'next/navigation'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import FindUserForm from './index'

describe('FindUserForm Component', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn()
    } satisfies AppRouterInstance)
  })

  test('renders the find user form', () => {
    render(<FindUserForm />)
    const legend = screen.getByText('Find User Form')
    expect(legend).toBeInTheDocument()
  })

  test('renders the search input field', () => {
    render(<FindUserForm />)
    const input = screen.getByPlaceholderText('Enter the email to start the search')
    expect(input).toBeInTheDocument()
  })

  test('renders the find user button', () => {
    render(<FindUserForm />)
    const button = screen.getByRole('button', { name: /find user/i })
    expect(button).toBeInTheDocument()
  })

  test('button is not disabled initially', () => {
    render(<FindUserForm />)
    const button = screen.getByRole('button', { name: /find user/i })
    expect(button).not.toBeDisabled()
  })

  test('input has correct name and type attributes', () => {
    render(<FindUserForm />)
    const input = screen.getByPlaceholderText('Enter the email to start the search')
    expect(input).toHaveAttribute('name', 'search')
    expect(input).toHaveAttribute('type', 'text')
  })

  test('submit button has type submit', () => {
    render(<FindUserForm />)
    const button = screen.getByRole('button', { name: /find user/i })
    expect(button).toHaveAttribute('type', 'submit')
  })
})
