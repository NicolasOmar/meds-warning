import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import ConceptPage from './page'
// SHARED
import { CONCEPT_PAGE_LABELS } from '@shared-constants/labels'

describe('ConceptPage Component', () => {
  test('renders the concept page', () => {
    const { container } = render(<ConceptPage />)
    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThan(0)
  })

  test('displays the welcome message', () => {
    render(<ConceptPage />)
    const welcomeMessage = screen.getByText(CONCEPT_PAGE_LABELS.WELCOME_MESSAGE)
    expect(welcomeMessage).toBeInTheDocument()
  })

  test('renders with correct styling classes', () => {
    const { container } = render(<ConceptPage />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('flex', 'min-h-screen', 'items-center', 'justify-center')
  })

  test('has proper background styling', () => {
    const { container } = render(<ConceptPage />)
    const outerSection = container.querySelector('section')
    expect(outerSection).toHaveClass('bg-zinc-50', 'dark:bg-black')
  })

  test('contains nested section with proper structure', () => {
    const { container } = render(<ConceptPage />)
    const sections = container.querySelectorAll('section')
    expect(sections.length).toBe(2)
  })

  test('inner section has correct max width', () => {
    const { container } = render(<ConceptPage />)
    const sections = container.querySelectorAll('section')
    const innerSection = sections[1]
    expect(innerSection).toHaveClass('max-w-3xl')
  })

  test('renders with proper padding', () => {
    const { container } = render(<ConceptPage />)
    const innerSection = container.querySelectorAll('section')[1]
    expect(innerSection).toHaveClass('py-32', 'px-16')
  })

  test('welcome message is visible in the document', () => {
    const { container } = render(<ConceptPage />)
    expect(container.textContent).toContain(CONCEPT_PAGE_LABELS.WELCOME_MESSAGE)
  })

  test('section has proper flex layout', () => {
    const { container } = render(<ConceptPage />)
    const innerSection = container.querySelectorAll('section')[1]
    expect(innerSection).toHaveClass('flex-col', 'items-center', 'justify-between')
  })

  test('renders without errors', () => {
    expect(() => render(<ConceptPage />)).not.toThrow()
  })
})
