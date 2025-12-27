import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from './page'

describe('Home Component', () => {
  test('renders the welcome message', () => {
    render(<Home />)
    const welcome = screen.getByText('Welcome to this test')
    expect(welcome).toBeInTheDocument()
  })

  test('renders nested sections', () => {
    const { container } = render(<Home />)
    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThan(0)
  })

  test('has correct styling classes', () => {
    render(<Home />)
    const mainSection = screen.getByText('Welcome to this test').parentElement
    expect(mainSection).toHaveClass('flex', 'min-h-screen')
  })
})
