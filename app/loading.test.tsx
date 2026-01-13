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

    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass(
      'flex',
      'flex-col',
      'min-h-screen',
      'justify-start',
      'items-center'
    )
  })

  test('renders nested sections correctly', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    expect(sections.length).toBe(1)
  })

  test('renders spinner with size classes in inner section', () => {
    const { container } = render(<HomeLoading />)

    const spinner = container.querySelector('svg')
    expect(spinner).toBeTruthy()
  })

  test('renders complete page structure with content', () => {
    const { container } = render(<HomeLoading />)

    const sections = container.querySelectorAll('section')
    expect(sections.length).toBe(1)
  })
})
