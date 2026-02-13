import { describe, test, expect, vi, beforeEach } from 'vitest'
import { sendPasswordResetEmail } from '../email'

const mockCreate = vi.fn()

vi.mock('mailgun.js', () => {
  return {
    default: class Mailgun {
      client() {
        return {
          messages: {
            create: mockCreate
          }
        }
      }
    }
  }
})

describe('[sendPasswordResetEmail]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.MAILGUN_API_KEY = 'test-api-key'
    process.env.MAILGUN_DOMAIN = 'test-domain.com'
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
  })

  test('sends password reset email with correct parameters', async () => {
    const params = {
      to: 'test@example.com',
      resetToken: 'test-token-123'
    }

    mockCreate.mockResolvedValue({ id: 'message-id' })

    await sendPasswordResetEmail(params)

    expect(mockCreate).toHaveBeenCalledWith('test-domain.com', {
      from: 'MedsWarning <postmaster@test-domain.com>',
      to: ['test@example.com'],
      subject: 'Password Reset Request',
      text: expect.stringContaining('http://localhost:3000/password/reset/test-token-123')
    })
  })

  test('includes reset URL in email text', async () => {
    const params = {
      to: 'user@example.com',
      resetToken: 'abc123'
    }

    mockCreate.mockResolvedValue({ id: 'message-id' })

    await sendPasswordResetEmail(params)

    const callArgs = mockCreate.mock.calls[0][1]
    expect(callArgs.text).toContain('password reset')
    expect(callArgs.text).toContain('expire in 1 hour')
    expect(callArgs.text).toContain('/password/reset/abc123')
  })

  test('uses production URL when NEXT_PUBLIC_APP_URL is set', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://production.com'

    const params = {
      to: 'test@example.com',
      resetToken: 'token-xyz'
    }

    mockCreate.mockResolvedValue({ id: 'message-id' })

    await sendPasswordResetEmail(params)

    const callArgs = mockCreate.mock.calls[0][1]
    expect(callArgs.text).toContain('https://production.com/password/reset/token-xyz')
  })

  test('defaults to localhost when NEXT_PUBLIC_APP_URL is not set', async () => {
    delete process.env.NEXT_PUBLIC_APP_URL

    const params = {
      to: 'test@example.com',
      resetToken: 'token-123'
    }

    mockCreate.mockResolvedValue({ id: 'message-id' })

    await sendPasswordResetEmail(params)

    const callArgs = mockCreate.mock.calls[0][1]
    expect(callArgs.text).toContain('http://localhost:3000/password/reset/token-123')
  })
})
