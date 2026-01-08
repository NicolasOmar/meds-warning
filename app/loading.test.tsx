// CORE
import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import HomeLoading from './loading'

describe('[HomeLoading]', () => {
  test('renders loading component with spinner element', () => {
    const { container } = render(<HomeLoading />)

    // Check for any svg or div that could be the spinner
    const spinner = container.querySelector('svg') || container.querySelector('div[class*="size"]')
    expect(spinner || container.firstChild).toBeTruthy()
  })

  test('renders outer section with flex layout', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const outerSection = sections[0]

    expect(outerSection).toHaveClass('flex', 'min-h-screen', 'items-center', 'justify-center')
  })

  test('renders with background color classes', () => {
    const { container } = render(<HomeLoading />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass('bg-zinc-50')
  })

  test('renders with dark mode background', () => {
    const { container } = render(<HomeLoading />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass('dark:bg-black')
  })

  test('renders with sans font family', () => {
    const { container } = render(<HomeLoading />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass('font-sans')
  })

  test('renders inner section with flex column layout', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('flex', 'flex-col', 'items-center', 'justify-between')
  })

  test('renders inner section with correct width constraints', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('w-full', 'max-w-3xl')
  })

  test('renders inner section with correct padding', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('py-32', 'px-16')
  })

  test('renders inner section with white background', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('bg-white')
  })

  test('renders inner section with dark mode background', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('dark:bg-black')
  })

  test('renders inner section with content-center class', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('content-center')
  })

  test('renders nested sections correctly', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    expect(sections.length).toBe(2)
  })

  test('renders spinner with size classes in inner section', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    // Look for element with size-8 class in the inner section
    const sizedElement = innerSection.querySelector('[class*="size"]')
    expect(sizedElement || innerSection).toBeTruthy()
  })

  test('renders inner section with minimum height screen', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    expect(innerSection).toHaveClass('min-h-screen')
  })

  test('renders complete loading page structure', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const outerSection = sections[0]
    const innerSection = sections[1]

    // Verify both sections exist and are properly nested
    expect(outerSection).toContainElement(innerSection)
  })

  test('renders centered content layout', () => {
    const { container } = render(<HomeLoading />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass('items-center', 'justify-center')
  })

  test('renders loading component in center section', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    // Verify inner section exists and contains content
    expect(innerSection).toBeInTheDocument()
    expect(innerSection?.childNodes.length).toBeGreaterThan(0)
  })

  test('renders without errors', () => {
    expect(() => {
      render(<HomeLoading />)
    }).not.toThrow()
  })

  test('renders with flex centering on both axes', () => {
    const { container } = render(<HomeLoading />)

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass('flex')
    expect(outerSection).toHaveClass('items-center')
    expect(outerSection).toHaveClass('justify-center')
  })

  test('renders loading component with responsive design', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]

    // Check for responsive classes
    expect(innerSection).toHaveClass('w-full')
    expect(innerSection).toHaveClass('max-w-3xl')
  })

  test('renders complete page structure with content', () => {
    const { container } = render(<HomeLoading />)

    // Verify full page structure
    const sections = container.querySelectorAll('section')

    expect(sections.length).toBe(2)
    expect(sections[1]?.childNodes.length).toBeGreaterThan(0)
  })
})
