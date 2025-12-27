import { describe, test, expect, vi } from 'vitest'
import { notFound } from 'next/navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}))

// Import the component after mocking
import UpdateUserPage from './page'

describe('UpdateUserPage Component', () => {
  test('calls notFound when email param is missing', async () => {
    const params = Promise.resolve({ email: '' })
    await UpdateUserPage({ params })
    expect(notFound).toHaveBeenCalled()
  })

  test('renders the update user section with email', async () => {
    const email = 'test@example.com'
    const params = Promise.resolve({ email })
    const result = await UpdateUserPage({ params })

    // The component is async and returns JSX
    expect(result).toBeDefined()
  })
})
