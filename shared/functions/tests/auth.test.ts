import { describe, test, expect, vi, beforeEach } from 'vitest'
import {
  hashPassword,
  comparePassword,
  generateJWT,
  verifyJWT,
  getSession,
  setAuthCookie,
  clearAuthCookie
} from '../auth'
import { AUTH_CONSTANTS, AUTH_ERROR_MESSAGES } from '@shared-constants/auth'

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn()
  }))
}))

describe('Auth Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env[AUTH_CONSTANTS.JWT_SECRET] = 'test-secret-key-for-testing-only'
  })

  describe('[hashPassword]', () => {
    test('hashes password successfully', async () => {
      const password = 'myPassword123'
      const hashed = await hashPassword(password)

      expect(hashed).toBeDefined()
      expect(hashed).not.toBe(password)
      expect(hashed.length).toBeGreaterThan(20)
    })

    test('generates different hashes for same password', async () => {
      const password = 'myPassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2)
    })

    test('handles empty password', async () => {
      const hashed = await hashPassword('')
      expect(hashed).toBeDefined()
    })
  })

  describe('[comparePassword]', () => {
    test('returns true for matching password', async () => {
      const password = 'myPassword123'
      const hashed = await hashPassword(password)
      const match = await comparePassword(password, hashed)

      expect(match).toBe(true)
    })

    test('returns false for non-matching password', async () => {
      const password = 'myPassword123'
      const hashed = await hashPassword(password)
      const match = await comparePassword('wrongPassword', hashed)

      expect(match).toBe(false)
    })

    test('returns false for empty password against hash', async () => {
      const password = 'myPassword123'
      const hashed = await hashPassword(password)
      const match = await comparePassword('', hashed)

      expect(match).toBe(false)
    })
  })

  describe('[generateJWT]', () => {
    test('generates JWT token with valid payload', () => {
      const payload = {
        userId: 1,
        email: 'test@example.com',
        name: 'Test User'
      }

      const token = generateJWT(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    test('throws error when JWT_SECRET is missing', () => {
      delete process.env[AUTH_CONSTANTS.JWT_SECRET]

      expect(() =>
        generateJWT({
          userId: 1,
          email: 'test@example.com',
          name: 'Test'
        })
      ).toThrow(AUTH_ERROR_MESSAGES.JWT_SECRET_MISSING)
    })

    test('generates different tokens for different payloads', () => {
      const payload1 = { userId: 1, email: 'test1@example.com', name: 'User 1' }
      const payload2 = { userId: 2, email: 'test2@example.com', name: 'User 2' }

      const token1 = generateJWT(payload1)
      const token2 = generateJWT(payload2)

      expect(token1).not.toBe(token2)
    })
  })

  describe('[verifyJWT]', () => {
    test('verifies valid JWT token', () => {
      const payload = {
        userId: 1,
        email: 'test@example.com',
        name: 'Test User'
      }

      const token = generateJWT(payload)
      const decoded = verifyJWT(token)

      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(1)
      expect(decoded?.email).toBe('test@example.com')
      expect(decoded?.name).toBe('Test User')
    })

    test('returns null for invalid token', () => {
      const decoded = verifyJWT('invalid-token')
      expect(decoded).toBeNull()
    })

    test('returns null for expired token', () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDAxMDB9.test'
      const decoded = verifyJWT(expiredToken)
      expect(decoded).toBeNull()
    })

    test('returns null when JWT_SECRET is missing', () => {
      const payload = { userId: 1, email: 'test@example.com', name: 'Test' }
      const token = generateJWT(payload)

      delete process.env[AUTH_CONSTANTS.JWT_SECRET]

      const decoded = verifyJWT(token)
      expect(decoded).toBeNull()
    })
  })

  describe('[getSession]', () => {
    test('returns session for valid token', async () => {
      const payload = {
        userId: 1,
        email: 'test@example.com',
        name: 'Test User'
      }
      const token = generateJWT(payload)

      const { cookies } = await import('next/headers')
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: token }),
        set: vi.fn(),
        delete: vi.fn()
      } as never)

      const session = await getSession()

      expect(session).toBeDefined()
      expect(session?.user.id).toBe(1)
      expect(session?.user.email).toBe('test@example.com')
      expect(session?.user.name).toBe('Test User')
    })

    test('returns null when no token exists', async () => {
      const { cookies } = await import('next/headers')
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
        set: vi.fn(),
        delete: vi.fn()
      } as never)

      const session = await getSession()
      expect(session).toBeNull()
    })

    test('returns null for invalid token', async () => {
      const { cookies } = await import('next/headers')
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: 'invalid-token' }),
        set: vi.fn(),
        delete: vi.fn()
      } as never)

      const session = await getSession()
      expect(session).toBeNull()
    })
  })

  describe('[setAuthCookie]', () => {
    test('sets cookie with token', async () => {
      const token = 'test-token'
      const mockSet = vi.fn()

      const { cookies } = await import('next/headers')
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn(),
        set: mockSet,
        delete: vi.fn()
      } as never)

      await setAuthCookie(token)

      expect(mockSet).toHaveBeenCalledWith(
        AUTH_CONSTANTS.COOKIE_NAME,
        token,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 604800,
          path: '/'
        })
      )
    })
  })

  describe('[clearAuthCookie]', () => {
    test('deletes auth cookie', async () => {
      const mockDelete = vi.fn()

      const { cookies } = await import('next/headers')
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn(),
        set: vi.fn(),
        delete: mockDelete
      } as never)

      await clearAuthCookie()

      expect(mockDelete).toHaveBeenCalledWith(AUTH_CONSTANTS.COOKIE_NAME)
    })
  })
})
