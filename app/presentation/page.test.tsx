// CORE
import { describe, test, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
// COMPONENTS
import PresentationRootPage from './page'
// SHARED
import { ROUTE_URLS } from '@shared-constants/routes'

const mockRedirect = vi.fn()

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args)
}))

describe('[PresentationRootPage]', () => {
  test('redirects exactly once to the presentation list route', () => {
    render(<PresentationRootPage />)

    expect(mockRedirect).toHaveBeenCalledTimes(1)
    expect(mockRedirect).toHaveBeenCalledWith(ROUTE_URLS.PRESENTATION_LIST)
  })
})
