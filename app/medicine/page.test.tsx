// CORE
import { describe, test, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
// COMPONENTS
import MedicineRootPage from './page'
// SHARED
import { ROUTE_URLS } from '@shared-constants/routes'

const mockRedirect = vi.fn()

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args)
}))

describe('[MedicineRootPage]', () => {
  test('redirects exactly once to the medicine list route', () => {
    render(<MedicineRootPage />)

    expect(mockRedirect).toHaveBeenCalledTimes(1)
    expect(mockRedirect).toHaveBeenCalledWith(ROUTE_URLS.MEDICINE_LIST)
  })
})
