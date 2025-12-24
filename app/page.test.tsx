import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Component', () => {
  test('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', {
      name: /to get started, edit the page.tsx file/i
    })
    expect(heading).toBeInTheDocument()
  })

  test('renders the description text', () => {
    render(<Home />)
    const description = screen.getByText(/looking for a starting point/i)
    expect(description).toBeInTheDocument()
  })

  test('renders navigation links', () => {
    render(<Home />)
    const deployLink = screen.getByRole('link', { name: /deploy now/i })
    const docsLink = screen.getByRole('link', { name: /documentation/i })

    expect(deployLink).toBeInTheDocument()
    expect(docsLink).toBeInTheDocument()
  })
})
