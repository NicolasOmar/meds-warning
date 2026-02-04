import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { AUTH_CONSTANTS, AUTH_ERROR_MESSAGES, COOKIE_CONFIG } from '@shared-constants/auth'
import type { JWTPayload, Session } from '@shared-types/auth'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const secret = process.env[AUTH_CONSTANTS.JWT_SECRET]

  if (!secret) {
    throw new Error(AUTH_ERROR_MESSAGES.JWT_SECRET_MISSING)
  }

  return jwt.sign(payload, secret, {
    expiresIn: AUTH_CONSTANTS.JWT_EXPIRES_IN
  })
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const secret = process.env[AUTH_CONSTANTS.JWT_SECRET]

    if (!secret) {
      throw new Error(AUTH_ERROR_MESSAGES.JWT_SECRET_MISSING)
    }

    const decoded = jwt.verify(token, secret) as JWTPayload
    return decoded
  } catch {
    return null
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_CONSTANTS.COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const payload = verifyJWT(token)

  if (!payload) {
    return null
  }

  return {
    user: {
      id: payload.userId,
      email: payload.email,
      name: payload.name
    }
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_CONSTANTS.COOKIE_NAME, token, COOKIE_CONFIG)
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_CONSTANTS.COOKIE_NAME)
}
