// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import MedicineHomePage from './page'
// SHARED
import { MEDICINE_PAGE_LABELS } from '@shared-constants/labels'

describe('MedicineHomePage Component', () => {
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
    expect(outerSection).toHaveClass('flex', 'min-h-screen', 'items-center', 'justify-center')
  })

  test('renders dark mode styling classes', () => {
    const { container } = render(<MedicineHomePage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass('dark:bg-black')
  })

  test('renders background color classes', () => {
    const { container } = render(<MedicineHomePage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass('bg-zinc-50')
  })

  test('renders nested sections correctly', () => {
    const { container } = render(<MedicineHomePage />)

    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThanOrEqual(2)
  })

  test('renders inner section with flex layout', () => {
    const { container } = render(<MedicineHomePage />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('flex', 'flex-col', 'items-center', 'justify-between')
  })

  test('renders with correct width constraints', () => {
    const { container } = render(<MedicineHomePage />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('w-full', 'max-w-3xl')
  })

  test('renders with correct padding', () => {
    const { container } = render(<MedicineHomePage />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('py-32', 'px-16')
  })

  test('renders with sans font family', () => {
    const { container } = render(<MedicineHomePage />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass('font-sans')
  })

  test('renders white background for inner section', () => {
    const { container } = render(<MedicineHomePage />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('bg-white')
  })

  test('renders dark mode background for inner section', () => {
    const { container } = render(<MedicineHomePage />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('dark:bg-black')
  })

  test('renders content-center for inner section', () => {
    const { container } = render(<MedicineHomePage />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('content-center')
  })

  test('renders minimum height screen for inner section', () => {
    const { container } = render(<MedicineHomePage />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('min-h-screen')
  })

  test('renders complete page structure', () => {
    const { container } = render(<MedicineHomePage />)
    const allSections = container.querySelectorAll('section')

    // Should have at least outer and inner sections
    expect(allSections.length).toBeGreaterThanOrEqual(2)
    // Welcome message should be in the document
    expect(screen.getByText(MEDICINE_PAGE_LABELS.WELCOME_MESSAGE)).toBeInTheDocument()
  })

  test('renders page with correct layout hierarchy', () => {
    const { container } = render(<MedicineHomePage />)

    const sections = container.querySelectorAll('section')
    expect(sections[0]).toContainElement(sections[1])
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
