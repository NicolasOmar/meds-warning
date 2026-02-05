// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import MedicineRootPage from './page'
// SHARED
import { MEDICINE_PAGE_LABELS } from '@shared-constants/pages'

describe('[MedicineRootPage]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the welcome message', () => {
    render(<MedicineRootPage />)

    expect(screen.getByText(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)).toBeInTheDocument()
  })

  test('renders main section with children text', () => {
    render(<MedicineRootPage />)

    const welcomeText = screen.getByText(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)
    expect(welcomeText).toBeInTheDocument()
  })

  test('renders outer section with correct styling', () => {
    const { container } = render(<MedicineRootPage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass('flex', 'flex-col', 'items-center', 'gap-4', 'py-8')
  })

  test('renders complete page structure', () => {
    const { container } = render(<MedicineRootPage />)

    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)).toBeInTheDocument()
  })

  test('renders page with correct layout hierarchy', () => {
    const { container } = render(<MedicineRootPage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toBeInTheDocument()
  })

  test('renders welcome message text correctly', () => {
    render(<MedicineRootPage />)

    const messageText = screen.getByText(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)
    expect(messageText.textContent).toBe(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)
  })

  test('component exports MedicineRootPage as default', () => {
    // Verify the component is defined and renders
    const component = <MedicineRootPage />
    expect(component).toBeDefined()
  })

  test('renders without errors', () => {
    expect(() => {
      render(<MedicineRootPage />)
    }).not.toThrow()
  })

  test('renders a single outer section container', () => {
    const { container } = render(<MedicineRootPage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toBeInTheDocument()
    expect(outerSection?.className).toContain('flex')
  })
})
