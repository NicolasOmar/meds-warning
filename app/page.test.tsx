// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import RootPage from './page'
// SHARED
import { ROOT_PAGE_LABELS } from '@shared-constants/pages'
import { ROUTE_URLS } from '@shared-constants/routes'
import { getSession } from '@shared-functions/auth'

const mockRedirect = vi.fn()

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args)
    throw new Error('NEXT_REDIRECT')
  }
}))

vi.mock('@shared-functions/auth', () => ({
  getSession: vi.fn()
}))

describe('[RootPage]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('redirects to login when no session exists', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null)

    await expect(RootPage()).rejects.toThrow('NEXT_REDIRECT')

    expect(mockRedirect).toHaveBeenCalledWith(ROUTE_URLS.LOGIN)
  })

  test('renders welcome content when session exists', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      user: { id: 1, email: 'test@example.com', name: 'Test' }
    })

    const component = await RootPage()
    render(component)

    expect(screen.getByText(ROOT_PAGE_LABELS.WELCOME_MESSAGE)).toBeInTheDocument()
    expect(screen.getByText(ROOT_PAGE_LABELS.FIRST_PARAGRAPH)).toBeInTheDocument()
    expect(screen.getByText(ROOT_PAGE_LABELS.SECOND_PARAGRAPH)).toBeInTheDocument()
  })
})
