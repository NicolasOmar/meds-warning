import { describe, test, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
// COMPONENTS
import PasswordRootPage from './page'
// SHARED
import { ROUTE_URLS } from '@shared-constants/routes'

const mockRedirect = vi.fn()

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args)
    throw new Error('NEXT_REDIRECT')
  }
}))

describe('[PasswordRootPage]', () => {
  test('redirects to LOGIN route', () => {
    expect(() => {
      PasswordRootPage()
    }).toThrow('NEXT_REDIRECT')

    expect(mockRedirect).toHaveBeenCalledWith(ROUTE_URLS.LOGIN)
  })

  test('component is defined', () => {
    expect(PasswordRootPage).toBeDefined()
    expect(typeof PasswordRootPage).toBe('function')
  })
})
