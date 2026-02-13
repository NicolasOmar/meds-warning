import { describe, test, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@prisma/index'
import { handleForgotPasswordAction, handleResetPasswordAction } from '../password'
import {
  FORGOT_PASSWORD_FORM_LABELS,
  RESET_PASSWORD_FORM_LABELS,
  RESET_PASSWORD_FORM_ERRORS
} from '@shared-constants/forms'
import { COMMON_FORM_ERRORS } from '@shared-constants/common'

vi.mock('@prisma/index', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn()
    }
  }
}))

vi.mock('@shared-functions/auth', () => ({
  generateJWT: vi.fn(),
  hashPassword: vi.fn(),
  verifyJWT: vi.fn()
}))

vi.mock('@shared-functions/email', () => ({
  sendPasswordResetEmail: vi.fn()
}))

describe('Password Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[handleForgotPasswordAction]', () => {
    test('sends reset email for existing user', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        lastName: null,
        daysToNotify: 30,
        resetToken: null,
        resetTokenExpiry: null
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(prisma.user.update).mockResolvedValue({ ...mockUser, resetToken: 'token' })

      const { generateJWT } = await import('@shared-functions/auth')
      const { sendPasswordResetEmail } = await import('@shared-functions/email')
      vi.mocked(generateJWT).mockReturnValue('reset-token-123')

      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await handleForgotPasswordAction({}, formData)

      expect(result.message).toBe(FORGOT_PASSWORD_FORM_LABELS.SUCCESS)
      expect(result.success).toBe(true)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          resetToken: 'reset-token-123',
          resetTokenExpiry: expect.any(Date)
        }
      })
      expect(sendPasswordResetEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        resetToken: 'reset-token-123'
      })
    })

    test('returns generic success for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const formData = new FormData()
      formData.append('email', 'nonexistent@example.com')

      const result = await handleForgotPasswordAction({}, formData)

      expect(result.message).toBe(FORGOT_PASSWORD_FORM_LABELS.SUCCESS)
      expect(result.success).toBe(true)
      expect(prisma.user.update).not.toHaveBeenCalled()
    })

    test('returns error for invalid email', async () => {
      const formData = new FormData()
      formData.append('email', 'invalid-email')

      const result = await handleForgotPasswordAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.success).toBe(false)
      expect(result.errors?.email).toBeDefined()
    })

    test('returns error for missing email', async () => {
      const formData = new FormData()

      const result = await handleForgotPasswordAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.success).toBe(false)
      expect(result.errors?.email).toBeDefined()
    })

    test('handles database error on forgot password', async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('Database connection failed'))

      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await handleForgotPasswordAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Database connection failed')
    })

    test('handles error with empty message', async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error(''))

      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await handleForgotPasswordAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
    })

    test('handles non-Error exception', async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue('String error')

      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await handleForgotPasswordAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
    })
  })

  describe('[handleResetPasswordAction]', () => {
    test('resets password with valid token', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'old-hashed-password',
        lastName: null,
        daysToNotify: 30,
        resetToken: 'valid-token',
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000)
      }

      const { verifyJWT, hashPassword } = await import('@shared-functions/auth')
      vi.mocked(verifyJWT).mockReturnValue({
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        iat: 123456,
        exp: 789012
      })
      vi.mocked(hashPassword).mockResolvedValue('new-hashed-password')
      vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser)
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...mockUser,
        password: 'new-hashed-password',
        resetToken: null,
        resetTokenExpiry: null
      })

      const formData = new FormData()
      formData.append('token', 'valid-token')
      formData.append('password', 'newPassword123')
      formData.append('confirmPassword', 'newPassword123')

      const result = await handleResetPasswordAction({}, formData)

      expect(result.message).toBe(RESET_PASSWORD_FORM_LABELS.SUCCESS)
      expect(result.success).toBe(true)
      expect(hashPassword).toHaveBeenCalledWith('newPassword123')
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          password: 'new-hashed-password',
          resetToken: null,
          resetTokenExpiry: null
        }
      })
    })

    test('returns error for invalid token', async () => {
      const { verifyJWT } = await import('@shared-functions/auth')
      vi.mocked(verifyJWT).mockReturnValue(null)

      const formData = new FormData()
      formData.append('token', 'invalid-token')
      formData.append('password', 'newPassword123')
      formData.append('confirmPassword', 'newPassword123')

      const result = await handleResetPasswordAction({}, formData)

      expect(result.message).toBe(RESET_PASSWORD_FORM_ERRORS.INVALID_TOKEN)
      expect(result.success).toBe(false)
    })

    test('returns error for expired token', async () => {
      const { verifyJWT } = await import('@shared-functions/auth')
      vi.mocked(verifyJWT).mockReturnValue({
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        iat: 123456,
        exp: 789012
      })
      vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

      const formData = new FormData()
      formData.append('token', 'expired-token')
      formData.append('password', 'newPassword123')
      formData.append('confirmPassword', 'newPassword123')

      const result = await handleResetPasswordAction({}, formData)

      expect(result.message).toBe(RESET_PASSWORD_FORM_ERRORS.INVALID_TOKEN)
      expect(result.success).toBe(false)
    })

    test('returns error for mismatched passwords', async () => {
      const formData = new FormData()
      formData.append('token', 'valid-token')
      formData.append('password', 'newPassword123')
      formData.append('confirmPassword', 'differentPassword')

      const result = await handleResetPasswordAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.success).toBe(false)
      expect(result.errors?.confirmPassword).toBeDefined()
    })

    test('returns error for short password', async () => {
      const formData = new FormData()
      formData.append('token', 'valid-token')
      formData.append('password', 'short')
      formData.append('confirmPassword', 'short')

      const result = await handleResetPasswordAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.success).toBe(false)
      expect(result.errors?.password).toBeDefined()
    })

    test('returns error for missing token', async () => {
      const formData = new FormData()
      formData.append('password', 'newPassword123')
      formData.append('confirmPassword', 'newPassword123')

      const result = await handleResetPasswordAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.success).toBe(false)
      expect(result.errors?.token).toBeDefined()
    })

    test('handles database error on reset password', async () => {
      const { verifyJWT } = await import('@shared-functions/auth')
      vi.mocked(verifyJWT).mockReturnValue({
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        iat: 123456,
        exp: 789012
      })
      vi.mocked(prisma.user.findFirst).mockRejectedValue(new Error('Database error'))

      const formData = new FormData()
      formData.append('token', 'valid-token')
      formData.append('password', 'newPassword123')
      formData.append('confirmPassword', 'newPassword123')

      const result = await handleResetPasswordAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Database error')
    })

    test('handles error with empty message on reset', async () => {
      const { verifyJWT } = await import('@shared-functions/auth')
      vi.mocked(verifyJWT).mockReturnValue({
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        iat: 123456,
        exp: 789012
      })
      vi.mocked(prisma.user.findFirst).mockRejectedValue(new Error(''))

      const formData = new FormData()
      formData.append('token', 'valid-token')
      formData.append('password', 'newPassword123')
      formData.append('confirmPassword', 'newPassword123')

      const result = await handleResetPasswordAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
    })

    test('handles non-Error exception on reset', async () => {
      const { verifyJWT } = await import('@shared-functions/auth')
      vi.mocked(verifyJWT).mockReturnValue({
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        iat: 123456,
        exp: 789012
      })
      vi.mocked(prisma.user.findFirst).mockRejectedValue('String error')

      const formData = new FormData()
      formData.append('token', 'valid-token')
      formData.append('password', 'newPassword123')
      formData.append('confirmPassword', 'newPassword123')

      const result = await handleResetPasswordAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
    })
  })
})
