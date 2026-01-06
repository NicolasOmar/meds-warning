import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENT
import ListMedicinePage from './page'

describe('ListMedicinePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the list medicine page', () => {
    render(<ListMedicinePage />)
    expect(screen.getByText('List of Medicines')).toBeInTheDocument()
  })

  test('displays correct heading text', () => {
    render(<ListMedicinePage />)
    const heading = screen.getByText('List of Medicines')
    expect(heading).toBeTruthy()
  })

  test('renders without error', () => {
    expect(() => render(<ListMedicinePage />)).not.toThrow()
  })

  test('component is a functional component', () => {
    const component = <ListMedicinePage />
    expect(component).toBeDefined()
  })

  test('renders div element with correct content', () => {
    const { container } = render(<ListMedicinePage />)
    const div = container.querySelector('div')
    expect(div).toBeInTheDocument()
    expect(div?.textContent).toBe('List of Medicines')
  })

  test('renders in document', () => {
    render(<ListMedicinePage />)
    const content = screen.getByText('List of Medicines')
    expect(content.parentElement).toBeInTheDocument()
  })
})
