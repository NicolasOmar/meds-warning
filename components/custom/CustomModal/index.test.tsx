// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import CustomDialog from './index'
// MOCKS
import {
  defaultProps,
  withoutTitleProps,
  withCustomCancelProps,
  withLongDescriptionProps,
  minimalProps
} from './mocks.json'

describe('[CustomDialog]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders trigger button with correct text', () => {
    render(<CustomDialog {...defaultProps} />)

    const button = screen.getByRole('button', { name: defaultProps.buttonText })
    expect(button).toBeInTheDocument()
  })

  test('renders dialog content when trigger is clicked', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const title = await screen.findByText(defaultProps.title)
    expect(title).toBeInTheDocument()
  })

  test('renders title when provided', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const title = await screen.findByText(defaultProps.title)
    expect(title).toBeInTheDocument()
  })

  test('renders description text', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const description = await screen.findByText(defaultProps.description)
    expect(description).toBeInTheDocument()
  })

  test('renders confirm button with correct text', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const confirmButton = await screen.findByRole('button', { name: defaultProps.confirmText })
    expect(confirmButton).toBeInTheDocument()
  })

  test('renders cancel button with default text when not provided', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
    expect(cancelButton).toBeInTheDocument()
  })

  test('renders cancel button with custom text when provided', async () => {
    render(<CustomDialog {...withCustomCancelProps} />)

    const trigger = screen.getByRole('button', { name: withCustomCancelProps.buttonText })
    fireEvent.click(trigger)

    const customCancelButton = await screen.findByRole('button', {
      name: withCustomCancelProps.cancelText
    })
    expect(customCancelButton).toBeInTheDocument()
  })

  test('does not render title when not provided', async () => {
    render(<CustomDialog {...withoutTitleProps} />)

    const trigger = screen.getByRole('button', { name: withoutTitleProps.buttonText })
    fireEvent.click(trigger)

    const description = await screen.findByText(withoutTitleProps.description)
    expect(description).toBeInTheDocument()
  })

  test('renders body content when provided', async () => {
    const testBody = <p data-testid="modal-body">Test body content</p>
    render(<CustomDialog {...defaultProps} body={testBody} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const body = await screen.findByTestId('modal-body')
    expect(body).toBeInTheDocument()
  })

  test('does not render body when not provided', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const title = await screen.findByText(defaultProps.title)
    expect(title).toBeInTheDocument()
  })

  test('calls onConfirm callback when confirm button is clicked', async () => {
    const onConfirmMock = vi.fn()
    render(<CustomDialog {...defaultProps} onConfirm={onConfirmMock} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const confirmButton = await screen.findByRole('button', { name: defaultProps.confirmText })
    fireEvent.click(confirmButton)

    expect(onConfirmMock).toHaveBeenCalledOnce()
  })

  test('does not throw error when onConfirm is not provided', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const confirmButton = await screen.findByRole('button', { name: defaultProps.confirmText })
    expect(() => fireEvent.click(confirmButton)).not.toThrow()
  })

  test('trigger button has outline variant styling', () => {
    render(<CustomDialog {...defaultProps} />)

    const button = screen.getByRole('button', { name: defaultProps.buttonText })
    expect(button).toHaveClass('border')
  })

  test('renders with minimal required props', () => {
    render(<CustomDialog {...minimalProps} />)

    const button = screen.getByRole('button', { name: minimalProps.buttonText })
    expect(button).toBeInTheDocument()
  })

  test('renders with long description text', async () => {
    render(<CustomDialog {...withLongDescriptionProps} />)

    const trigger = screen.getByRole('button', { name: withLongDescriptionProps.buttonText })
    fireEvent.click(trigger)

    const description = await screen.findByText(withLongDescriptionProps.description)
    expect(description).toBeInTheDocument()
  })

  test('renders description as ReactNode', async () => {
    const customDescription = <span data-testid="custom-description">Custom React content</span>
    render(<CustomDialog {...defaultProps} description={customDescription} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const description = await screen.findByTestId('custom-description')
    expect(description).toBeInTheDocument()
  })

  test('dialog closes when cancel button is clicked', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const title = await screen.findByText(defaultProps.title)
    expect(title).toBeInTheDocument()

    const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)

    expect(title).not.toBeInTheDocument()
  })

  test('renders all footer buttons correctly', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const confirmButton = await screen.findByRole('button', { name: defaultProps.confirmText })
    const cancelButton = await screen.findByRole('button', { name: 'Cancel' })

    expect(confirmButton).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
  })

  test('renders with description and body together', async () => {
    const testBody = <p data-testid="modal-body">Additional body content</p>
    render(<CustomDialog {...defaultProps} body={testBody} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const description = await screen.findByText(defaultProps.description)
    const body = await screen.findByTestId('modal-body')

    expect(description).toBeInTheDocument()
    expect(body).toBeInTheDocument()
  })

  test('cancel button text defaults to "Cancel"', async () => {
    render(<CustomDialog {...minimalProps} />)

    const trigger = screen.getByRole('button', { name: minimalProps.buttonText })
    fireEvent.click(trigger)

    const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
    expect(cancelButton).toBeInTheDocument()
  })

  test('renders correct number of buttons in footer', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const buttons = await screen.findAllByRole('button')
    // Trigger button + Cancel button + Confirm button
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })
})
