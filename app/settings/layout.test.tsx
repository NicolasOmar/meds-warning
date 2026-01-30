// CORE
import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import SettingsLayout from './layout'

// Mock LayoutTemplate component
vi.mock('@template-components/LayoutTemplate', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-template">{children}</div>
  )
}))

describe('[SettingsLayout]', () => {
  test('renders the layout without crashing', () => {
    render(
      <SettingsLayout>
        <div>Test Content</div>
      </SettingsLayout>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  test('renders children within layout', () => {
    render(
      <SettingsLayout>
        <p>Child content</p>
      </SettingsLayout>
    )

    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  test('renders LayoutTemplate component', () => {
    render(
      <SettingsLayout>
        <div>Test</div>
      </SettingsLayout>
    )

    const layoutTemplate = screen.getByTestId('layout-template')
    expect(layoutTemplate).toBeInTheDocument()
  })

  test('passes children to LayoutTemplate', () => {
    render(
      <SettingsLayout>
        <span>Settings content</span>
      </SettingsLayout>
    )

    const layoutTemplate = screen.getByTestId('layout-template')
    expect(layoutTemplate).toHaveTextContent('Settings content')
  })

  test('renders with multiple children elements', () => {
    render(
      <SettingsLayout>
        <h1>Title</h1>
        <p>Description</p>
      </SettingsLayout>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  test('is a functional component', () => {
    expect(typeof SettingsLayout).toBe('function')
  })
})
