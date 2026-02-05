// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import type { ReactNode } from 'react'
// COMPONENTS
import HomeLayout from './layout'
// SHARED
import { ROOT_LAYOUT_LABELS } from '@shared-constants/pages'
import { MAIN_ROUTES_OBJS } from '@shared-constants/routes'
import { getSession } from '@shared-functions/auth'

const mockHeadersGet = vi.fn()

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' })
}))

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className
  }: {
    href: string
    children: ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  )
}))

vi.mock('next/headers', () => ({
  headers: () => ({ get: mockHeadersGet })
}))

vi.mock('@shared-functions/auth', () => ({
  getSession: vi.fn()
}))

vi.mock('@actions/auth', () => ({
  handleLogoutAction: vi.fn()
}))

vi.mock('@base-components/sonner', () => ({
  Toaster: () => null
}))

describe('[HomeLayout]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('metadata exports correct title and description', async () => {
    const { metadata } = await import('./layout')
    expect(metadata.title).toEqual(ROOT_LAYOUT_LABELS.METADATA_TITLE)
    expect(metadata.description).toEqual(ROOT_LAYOUT_LABELS.METADATA_DESCRIPTION)
  })

  test('renders nav links with correct hrefs and logout button when authenticated on non-public route', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      user: { id: 1, email: 'test@test.com', name: 'Test' }
    })
    mockHeadersGet.mockReturnValue('/medicine')

    const component = await HomeLayout({ children: <div>Child</div> })
    render(component)

    MAIN_ROUTES_OBJS.forEach(({ name, path }) => {
      expect(screen.getByText(name).closest('a')).toHaveAttribute('href', path)
    })
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  test('hides header when no session and still renders children', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null)
    mockHeadersGet.mockReturnValue('/medicine')

    const component = await HomeLayout({ children: <div>Unauthenticated Content</div> })
    render(component)

    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    expect(screen.getByText('Unauthenticated Content')).toBeInTheDocument()
  })

  test('falls back to "/" when x-pathname header is missing and shows header for authenticated users', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      user: { id: 1, email: 'test@test.com', name: 'Test' }
    })
    mockHeadersGet.mockReturnValue(null)

    const component = await HomeLayout({ children: <div>Child</div> })
    render(component)

    expect(screen.getByText('Logout')).toBeInTheDocument()
  })
})
