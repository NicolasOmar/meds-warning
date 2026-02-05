import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import PresentationLayout from './layout'
// SHARED
import { PRESENTATION_MAIN_ROUTES_OBJS } from '@shared-constants/routes'

// Mock Prisma to prevent import errors
vi.mock('@prisma/index', () => ({
  prisma: {}
}))

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    )
  }
})

describe('[PresentationLayout]', () => {
  const mockChildren = <div data-testid="layout-children">Test Children</div>

  test('renders the layout without crashing', () => {
    expect(() => render(<PresentationLayout>{mockChildren}</PresentationLayout>)).not.toThrow()
  })

  test('renders children within layout', () => {
    render(<PresentationLayout>{mockChildren}</PresentationLayout>)
    const children = screen.getByTestId('layout-children')
    expect(children).toBeInTheDocument()
  })

  test('renders main section container', () => {
    const { container } = render(<PresentationLayout>{mockChildren}</PresentationLayout>)
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })

  test('renders with flex layout classes', () => {
    const { container } = render(<PresentationLayout>{mockChildren}</PresentationLayout>)
    const section = container.querySelector('section')
    expect(section).toHaveClass('flex', 'flex-col', 'gap-6')
  })

  test('renders navigation links', () => {
    render(<PresentationLayout>{mockChildren}</PresentationLayout>)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  test('renders navigation links for all presentation routes', () => {
    render(<PresentationLayout>{mockChildren}</PresentationLayout>)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(PRESENTATION_MAIN_ROUTES_OBJS.length)
  })

  test('renders links with correct href attributes', () => {
    render(<PresentationLayout>{mockChildren}</PresentationLayout>)
    const links = screen.getAllByRole('link')

    links.forEach((link, index) => {
      if (index < PRESENTATION_MAIN_ROUTES_OBJS.length) {
        expect(link.getAttribute('href')).toBe(PRESENTATION_MAIN_ROUTES_OBJS[index].path)
      }
    })
  })

  test('renders navigation link text correctly', () => {
    render(<PresentationLayout>{mockChildren}</PresentationLayout>)

    PRESENTATION_MAIN_ROUTES_OBJS.forEach(({ name }) => {
      const link = screen.getByText(name)
      expect(link).toBeInTheDocument()
    })
  })
})
