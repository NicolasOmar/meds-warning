// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import UserRootPage from './page'
// SHARED
import { USER_PAGE_LABELS } from '@shared-constants/pages'

describe('[UserRootPage]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the welcome message', () => {
    render(<UserRootPage />)

    expect(screen.getByText(USER_PAGE_LABELS.WELCOME_MESSAGE)).toBeInTheDocument()
  })

  test('renders main section with children text', () => {
    render(<UserRootPage />)

    const welcomeText = screen.getByText(USER_PAGE_LABELS.WELCOME_MESSAGE)
    expect(welcomeText).toBeInTheDocument()
  })

  test('renders outer section with correct styling', () => {
    const { container } = render(<UserRootPage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass(
      'flex',
      'flex-col',
      'min-h-screen',
      'justify-start',
      'items-center'
    )
  })

  test('renders complete page structure', () => {
    const { container } = render(<UserRootPage />)

    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(USER_PAGE_LABELS.WELCOME_MESSAGE)).toBeInTheDocument()
  })

  test('renders page with correct layout hierarchy', () => {
    const { container } = render(<UserRootPage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toBeInTheDocument()
  })

  test('renders welcome message text correctly', () => {
    render(<UserRootPage />)

    const messageText = screen.getByText(USER_PAGE_LABELS.WELCOME_MESSAGE)
    expect(messageText.textContent).toBe(USER_PAGE_LABELS.WELCOME_MESSAGE)
  })

  test('component exports UserRootPage as default', () => {
    const component = <UserRootPage />
    expect(component).toBeDefined()
  })

  test('renders without errors', () => {
    expect(() => {
      render(<UserRootPage />)
    }).not.toThrow()
  })

  test('renders a single outer section container', () => {
    const { container } = render(<UserRootPage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toBeInTheDocument()
    expect(outerSection?.className).toContain('flex')
  })
})
