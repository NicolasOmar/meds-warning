// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import SettingsForm from './index'
// SHARED
import { SETTINGS_FORM_LABELS } from '@shared-constants/forms'

// Mock useActionState
const mockUseActionState = vi.fn()

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useActionState: (...args: unknown[]) => mockUseActionState(...args)
  }
})

// Mock settings action
vi.mock('@actions/settings', () => ({
  updateSettings: vi.fn()
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('[SettingsForm]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseActionState.mockReturnValue([{}, vi.fn(), false])
  })

  test('renders form with all required elements and correct structure', () => {
    render(<SettingsForm userDaysToNotify={30} />)

    const form = screen
      .getByRole('button', { name: SETTINGS_FORM_LABELS.SUBMIT_BUTTON })
      .closest('form')
    const title = screen.getByText(SETTINGS_FORM_LABELS.TITLE)
    const label = screen.getByText(SETTINGS_FORM_LABELS.DAYS_TO_NOTIFY)
    const input = screen.getByPlaceholderText(SETTINGS_FORM_LABELS.DAYS_TO_NOTIFY_PLACEHOLDER)
    const submitButton = screen.getByRole('button', { name: SETTINGS_FORM_LABELS.SUBMIT_BUTTON })

    expect(form).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).not.toBeDisabled()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  test('input field has correct attributes and accessibility features', () => {
    render(<SettingsForm userDaysToNotify={30} />)

    const input = screen.getByPlaceholderText(SETTINGS_FORM_LABELS.DAYS_TO_NOTIFY_PLACEHOLDER)

    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('placeholder', SETTINGS_FORM_LABELS.DAYS_TO_NOTIFY_PLACEHOLDER)
    expect(input).toHaveAttribute('id', 'daysToNotify')
    expect(input).toHaveValue(30)
  })

  test('displays success toast when message is provided and success is true', async () => {
    const mockToast = await import('sonner')
    mockUseActionState.mockReturnValue([
      { message: SETTINGS_FORM_LABELS.UPDATE_SUCCESS, success: true },
      vi.fn(),
      false
    ])

    render(<SettingsForm userDaysToNotify={30} />)

    expect(mockToast.toast.success).toHaveBeenCalledWith(SETTINGS_FORM_LABELS.UPDATE_SUCCESS)
  })

  test('displays error toast when message is provided and success is false', async () => {
    const mockToast = await import('sonner')
    mockUseActionState.mockReturnValue([
      { message: 'Error occurred', success: false },
      vi.fn(),
      false
    ])

    render(<SettingsForm userDaysToNotify={30} />)

    expect(mockToast.toast.error).toHaveBeenCalledWith('Error occurred')
  })

  test('displays error messages from state.errors', () => {
    mockUseActionState.mockReturnValue([
      { errors: { daysToNotify: ['Invalid number'] }, message: '', success: false },
      vi.fn(),
      false
    ])

    render(<SettingsForm userDaysToNotify={30} />)

    expect(screen.getByText('Invalid number')).toBeInTheDocument()
  })

  test('submit button state changes based on form pending status', () => {
    mockUseActionState.mockReturnValue([{}, vi.fn(), true])

    render(<SettingsForm userDaysToNotify={30} />)

    const submitButton = screen.getByRole('button', { name: SETTINGS_FORM_LABELS.SUBMIT_BUTTON })
    expect(submitButton).toBeDisabled()
  })
})
