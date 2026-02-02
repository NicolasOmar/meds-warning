// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import UserLayout from './layout'

vi.mock('@shared-constants/routes', () => ({
  USER_MAIN_ROUTES_OBJS: [
    { name: 'Add User', path: '/user/create' },
    { name: 'User List', path: '/user/list' }
  ]
}))

describe('[UserLayout]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders layout with children', () => {
    const testChildren = <div>Test Children Content</div>
    render(<UserLayout>{testChildren}</UserLayout>)

    expect(screen.getByText('Test Children Content')).toBeInTheDocument()
  })

  test('renders navigation buttons', () => {
    render(
      <UserLayout>
        <div>Children</div>
      </UserLayout>
    )

    expect(screen.getByText('Add User')).toBeInTheDocument()
    expect(screen.getByText('User List')).toBeInTheDocument()
  })

  test('renders links with correct paths', () => {
    render(
      <UserLayout>
        <div>Children</div>
      </UserLayout>
    )

    const addUserLink = screen.getByText('Add User').closest('a')
    const userListLink = screen.getByText('User List').closest('a')

    expect(addUserLink).toHaveAttribute('href', '/user/create')
    expect(userListLink).toHaveAttribute('href', '/user/list')
  })

  test('renders ButtonGroup component', () => {
    const { container } = render(
      <UserLayout>
        <div>Children</div>
      </UserLayout>
    )

    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  test('renders all route objects as buttons', () => {
    render(
      <UserLayout>
        <div>Children</div>
      </UserLayout>
    )

    const addUserButton = screen.getByText('Add User')
    const userListButton = screen.getByText('User List')

    expect(addUserButton).toBeInTheDocument()
    expect(userListButton).toBeInTheDocument()
  })

  test('renders main section wrapper', () => {
    const { container } = render(
      <UserLayout>
        <div>Children</div>
      </UserLayout>
    )

    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThan(0)
  })

  test('renders children in the correct position', () => {
    const childrenText = 'Specific Children Content'
    const { container } = render(
      <UserLayout>
        <div>{childrenText}</div>
      </UserLayout>
    )

    expect(screen.getByText(childrenText)).toBeInTheDocument()
    const mainSection = container.querySelector('section')
    expect(mainSection?.textContent).toContain(childrenText)
  })

  test('applies correct styling classes', () => {
    const { container } = render(
      <UserLayout>
        <div>Children</div>
      </UserLayout>
    )

    const mainSection = container.querySelector('section')
    expect(mainSection).toHaveClass('flex', 'flex-col')
  })

  test('renders with multiple navigation routes', () => {
    render(
      <UserLayout>
        <div>Children</div>
      </UserLayout>
    )

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })
})
