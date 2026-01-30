// CORE
import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import SettingsRootPage from './page'

// Mock SettingsForm component
vi.mock('@form-components/SettingsForm', () => ({
  default: () => <div>Mocked SettingsForm</div>
}))

describe('[SettingsRootPage]', () => {
  test('renders the page without crashing', () => {
    render(<SettingsRootPage />)

    expect(screen.getByText('Mocked SettingsForm')).toBeInTheDocument()
  })

  test('renders SettingsForm component', () => {
    render(<SettingsRootPage />)

    const form = screen.getByText('Mocked SettingsForm')
    expect(form).toBeInTheDocument()
  })

  test('is a functional component', () => {
    expect(typeof SettingsRootPage).toBe('function')
  })
})
