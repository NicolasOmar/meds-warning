import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import PresentationHomePage from './page'
import { PRESENTATION_PAGE_LABELS } from '@shared-constants/pages'

// Mock Prisma to prevent import errors
vi.mock('@prisma/index', () => ({
  prisma: {}
}))

describe('[PresentationHomePage]', () => {
  test('renders the welcome message', () => {
    render(<PresentationHomePage />)
    const welcome = screen.getByText(PRESENTATION_PAGE_LABELS.WELCOME_MESSAGE)
    expect(welcome).toBeInTheDocument()
  })

  test('renders main section container', () => {
    const { container } = render(<PresentationHomePage />)
    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThanOrEqual(1)
  })
})
