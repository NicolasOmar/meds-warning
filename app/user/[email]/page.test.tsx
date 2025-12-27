import { describe, test, expect, vi, beforeEach } from 'vitest'
import { notFound } from 'next/navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}))

// Mock custom components
vi.mock('@custom-components/UserForm', () => ({
  default: () => <div>UserForm</div>
}))

// Import after mocks are defined
import UpdateUserPage from './page'

describe('UpdateUserPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('calls notFound when email param is missing', async () => {
    const params = Promise.resolve({ email: '' })
    await UpdateUserPage({ params })
    expect(notFound).toHaveBeenCalled()
  })

  test('calls notFound when user is not found in database', async () => {
    const { prisma } = await import('@prisma/index')
    const email = 'notfound@example.com'
    const params = Promise.resolve({ email })

    vi.mocked(prisma.userForm.findFirst).mockResolvedValueOnce(null)

    await UpdateUserPage({ params })
    expect(notFound).toHaveBeenCalled()
  })

  test('renders the update user section with email', async () => {
    const { prisma } = await import('@prisma/index')
    const email = 'test@example.com'
    const params = Promise.resolve({ email })
    const mockUser = { email, name: 'Test User' }

    vi.mocked(prisma.userForm.findFirst).mockResolvedValueOnce(mockUser as never)

    const result = await UpdateUserPage({ params })

    // The component is async and returns JSX
    expect(result).toBeDefined()
    expect(prisma.userForm.findFirst).toHaveBeenCalledWith({
      where: {
        email: decodeURIComponent(email)
      }
    })
  })
})
