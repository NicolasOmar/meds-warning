import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import UserNotFoundPage from './not-found'

describe('UserNotFoundPage Component', () => {
  test('renders the not found heading', () => {
    render(<UserNotFoundPage />)
    const heading = screen.getByRole('heading', { name: /user not found/i })
    expect(heading).toBeInTheDocument()
  })

  test('renders the not found message', () => {
    render(<UserNotFoundPage />)
    const message = screen.getByText(/the user you are looking for does not exist/i)
    expect(message).toBeInTheDocument()
  })

  test('renders both heading and paragraph', () => {
    render(<UserNotFoundPage />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByRole('paragraph')).toBeInTheDocument()
  })
})
