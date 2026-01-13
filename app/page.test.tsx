// CORE
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import HomePage from './page'
// SHARED
import { ROOT_PAGE_LABELS } from '@shared-constants/pages'

describe('[HomePage]', () => {
  test('renders the welcome message', () => {
    render(<HomePage />)
    const welcome = screen.getByText(ROOT_PAGE_LABELS.WELCOME_MESSAGE)
    expect(welcome).toBeInTheDocument()
  })

  test('renders nested sections', () => {
    const { container } = render(<HomePage />)
    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThan(0)
  })
})
