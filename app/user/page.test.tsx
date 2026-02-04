// CORE
import { describe, test, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import UserRootPage from './page'
// SHARED
import { ROUTE_URLS } from '@shared-constants/routes'

const mockRedirect = vi.fn()

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args)
    throw new Error('NEXT_REDIRECT')
  }
}))

describe('[UserRootPage]', () => {
  test('redirects to USER_CREATE route and calls redirect with correct path', () => {
    expect(() => {
      render(<UserRootPage />)
    }).toThrow('NEXT_REDIRECT')

    expect(mockRedirect).toHaveBeenCalledWith(ROUTE_URLS.USER_CREATE)
  })

  test('component exports UserRootPage as default', () => {
    expect(UserRootPage).toBeDefined()
    expect(typeof UserRootPage).toBe('function')
  })
})
