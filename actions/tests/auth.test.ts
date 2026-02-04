import { describe, test, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@prisma/index'
import { handleLoginAction, handleLogoutAction } from '../auth'
import { AUTH_ERROR_MESSAGES } from '@shared-constants/auth'
import { LOGIN_FORM_LABELS } from '@shared-constants/forms'
import { COMMON_FORM_ERRORS } from '@shared-constants/common'

vi.mock('@prisma/index', () => ({
  prisma: {
    user: {
      findUnique: vi.fn()
    }
  }
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT')
  })
}))

vi.mock('@shared-functions/auth', () => ({
  comparePassword: vi.fn(),
  generateJWT: vi.fn(),
  setAuthCookie: vi.fn(),
  clearAuthCookie: vi.fn()
}))

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[handleLoginAction]', () => {
    test('logs in user with valid credentials', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        lastName: null,
        daysToNotify: 30
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)

      const { comparePassword, generateJWT, setAuthCookie } = await import('@shared-functions/auth')
      vi.mocked(comparePassword).mockResolvedValue(true)
      vi.mocked(generateJWT).mockReturnValue('test-token')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      const result = await handleLoginAction({}, formData)

      expect(result.message).toBe(LOGIN_FORM_LABELS.SUCCESS)
      expect(result.success).toBe(true)
      expect(result.errors).toBeUndefined()
      expect(comparePassword).toHaveBeenCalledWith('password123', 'hashed-password')
      expect(generateJWT).toHaveBeenCalledWith({
        userId: 1,
        email: 'test@example.com',
        name: 'Test User'
      })
      expect(setAuthCookie).toHaveBeenCalledWith('test-token')
    })

    test('returns error for invalid email', async () => {
      const formData = new FormData()
      formData.append('email', 'invalid-email')
      formData.append('password', 'password123')

      const result = await handleLoginAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors?.email).toBeDefined()
    })

    test('returns error for short password', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'short')

      const result = await handleLoginAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.success).toBe(false)
      expect(result.errors?.password).toBeDefined()
    })

    test('returns error for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const formData = new FormData()
      formData.append('email', 'nonexistent@example.com')
      formData.append('password', 'password123')

      const result = await handleLoginAction({}, formData)

      expect(result.message).toBe(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS)
      expect(result.success).toBe(false)
    })

    test('returns error for incorrect password', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        lastName: null,
        daysToNotify: 30
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)

      const { comparePassword } = await import('@shared-functions/auth')
      vi.mocked(comparePassword).mockResolvedValue(false)

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrongpassword')

      const result = await handleLoginAction({}, formData)

      expect(result.message).toBe(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS)
      expect(result.success).toBe(false)
    })

    test('handles database error', async () => {
      const dbError = new Error('Database connection failed')
      vi.mocked(prisma.user.findUnique).mockRejectedValue(dbError)

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      const result = await handleLoginAction({}, formData)

      expect(result.message).toBe('Database connection failed')
      expect(result.success).toBe(false)
    })

    test('handles error with no message', async () => {
      const error = new Error()
      vi.mocked(prisma.user.findUnique).mockRejectedValue(error)

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      const result = await handleLoginAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
      expect(result.success).toBe(false)
    })

    test('returns error for missing email', async () => {
      const formData = new FormData()
      formData.append('password', 'password123')

      const result = await handleLoginAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.success).toBe(false)
      expect(result.errors?.email).toBeDefined()
    })

    test('returns error for missing password', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await handleLoginAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.success).toBe(false)
      expect(result.errors?.password).toBeDefined()
    })
  })

  describe('[handleLogoutAction]', () => {
    test('clears auth cookie and redirects', async () => {
      const { clearAuthCookie } = await import('@shared-functions/auth')
      const { redirect } = await import('next/navigation')

      await expect(handleLogoutAction()).rejects.toThrow('NEXT_REDIRECT')

      expect(clearAuthCookie).toHaveBeenCalled()
      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })
})
