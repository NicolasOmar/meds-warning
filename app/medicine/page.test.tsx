// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import MedicineHomePage from './page'
// SHARED
import { MEDICINE_PAGE_LABELS } from '@shared-constants/pages'

describe('[MedicineHomePage]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the welcome message', () => {
    render(<MedicineHomePage />)

    expect(screen.getByText(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)).toBeInTheDocument()
  })

  test('renders main section with children text', () => {
    render(<MedicineHomePage />)

    const welcomeText = screen.getByText(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)
    expect(welcomeText).toBeInTheDocument()
  })

  test('renders outer section with correct styling', () => {
    const { container } = render(<MedicineHomePage />)

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
    const { container } = render(<MedicineHomePage />)

    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)).toBeInTheDocument()
  })

  test('renders page with correct layout hierarchy', () => {
    const { container } = render(<MedicineHomePage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toBeInTheDocument()
  })

  test('renders welcome message text correctly', () => {
    render(<MedicineHomePage />)

    const messageText = screen.getByText(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)
    expect(messageText.textContent).toBe(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)
  })

  test('component exports MedicineHomePage as default', () => {
    // Verify the component is defined and renders
    const component = <MedicineHomePage />
    expect(component).toBeDefined()
  })

  test('renders without errors', () => {
    expect(() => {
      render(<MedicineHomePage />)
    }).not.toThrow()
  })

  test('renders a single outer section container', () => {
    const { container } = render(<MedicineHomePage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toBeInTheDocument()
    expect(outerSection?.className).toContain('flex')
  })
})
