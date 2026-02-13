export enum AUTH_CONSTANTS {
  JWT_SECRET = 'JWT_SECRET',
  COOKIE_NAME = 'meds-warning-token',
  BCRYPT_SALT_ROUNDS = 10,
  JWT_EXPIRES_IN = '7d',
  COOKIE_MAX_AGE = 604800
}

export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 604800,
  path: '/'
}

export enum AUTH_ERROR_MESSAGES {
  INVALID_CREDENTIALS = 'Invalid email or password',
  INVALID_TOKEN = 'Invalid or expired session',
  UNAUTHORIZED = 'You must be logged in to access this page',
  JWT_SECRET_MISSING = 'JWT_SECRET environment variable is not set'
}

export const PUBLIC_ROUTES = ['/login', '/user/create', '/password/forgot', '/password/reset']
