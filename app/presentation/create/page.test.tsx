import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import CreatePresentationPage from './page'

// Mock Prisma to prevent import errors
vi.mock('@prisma/index', () => ({
  prisma: {}
}))

// Mock the action
vi.mock('@actions/presentation', () => ({
  handlePresentationAction: vi.fn()
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

describe('[CreatePresentationPage]', () => {
  test('renders the page without crashing', () => {
    expect(() => render(<CreatePresentationPage />)).not.toThrow()
  })

  test('renders PresentationForm component', () => {
    render(<CreatePresentationPage />)
    // The form contains a legend with the title
    const legend = screen.getByText('Presentation Information')
    expect(legend).toBeInTheDocument()
  })

  test('renders description input field', () => {
    render(<CreatePresentationPage />)
    const input = screen.getByPlaceholderText('Brief description of the presentation')
    expect(input).toBeInTheDocument()
  })

  test('renders submit button', () => {
    render(<CreatePresentationPage />)
    const submitButton = screen.getByRole('button', { name: /create presentation/i })
    expect(submitButton).toBeInTheDocument()
  })

  test('is a functional component', () => {
    const { container } = render(<CreatePresentationPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  test('renders form with proper structure', () => {
    const { container } = render(<CreatePresentationPage />)
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
  })
})
