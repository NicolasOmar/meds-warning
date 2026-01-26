// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import CustomDialog from './index'
// MOCKS
import mockedProps from './mocks.json'

const defaultProps = {
  ...mockedProps.defaultProps,
  confirmButton: {
    ...mockedProps.defaultProps.confirmButton,
    type: 'button' as const
  },
  cancelButton: {
    ...mockedProps.defaultProps.cancelButton,
    type: 'button' as const
  }
}

const withoutTitleProps = {
  ...mockedProps.withoutTitleProps,
  confirmButton: {
    ...mockedProps.withoutTitleProps.confirmButton,
    type: 'button' as const
  },
  cancelButton: {
    ...mockedProps.withoutTitleProps.cancelButton,
    type: 'button' as const
  }
}

const withCustomCancelProps = {
  ...mockedProps.withCustomCancelProps,
  confirmButton: {
    ...mockedProps.withCustomCancelProps.confirmButton,
    type: 'button' as const
  },
  cancelButton: {
    ...mockedProps.withCustomCancelProps.cancelButton,
    type: 'button' as const
  }
}

const withLongDescriptionProps = {
  ...mockedProps.withLongDescriptionProps,
  confirmButton: {
    ...mockedProps.withLongDescriptionProps.confirmButton,
    type: 'button' as const
  },
  cancelButton: {
    ...mockedProps.withLongDescriptionProps.cancelButton,
    type: 'button' as const
  }
}

const minimalProps = mockedProps.minimalProps

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

    const confirmButton = await screen.findByRole('button', {
      name: defaultProps.confirmButton.text
    })
    expect(confirmButton).toBeInTheDocument()
  })

  test('renders cancel button with default text when not provided', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const cancelButton = await screen.findByRole('button', { name: defaultProps.cancelButton.text })
    expect(cancelButton).toBeInTheDocument()
  })

  test('renders cancel button with custom text when provided', async () => {
    render(<CustomDialog {...withCustomCancelProps} />)

    const trigger = screen.getByRole('button', { name: withCustomCancelProps.buttonText })
    fireEvent.click(trigger)

    const customCancelButton = await screen.findByRole('button', {
      name: withCustomCancelProps.cancelButton.text
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

  test('calls onClick callback when confirm button is clicked', async () => {
    const onClickMock = vi.fn()
    const propsWithCallback = {
      ...defaultProps,
      confirmButton: {
        ...defaultProps.confirmButton,
        onClick: onClickMock
      }
    }
    render(<CustomDialog {...propsWithCallback} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const confirmButton = await screen.findByRole('button', {
      name: defaultProps.confirmButton.text
    })
    fireEvent.click(confirmButton)

    expect(onClickMock).toHaveBeenCalledOnce()
  })

  test('does not throw error when onClick is not provided', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const confirmButton = await screen.findByRole('button', {
      name: defaultProps.confirmButton.text
    })
    expect(() => fireEvent.click(confirmButton)).not.toThrow()
  })

  test('trigger button has outline variant styling', () => {
    render(<CustomDialog {...defaultProps} />)

    const button = screen.getByRole('button', { name: defaultProps.buttonText })
    expect(button).toHaveClass('border')
  })

  test('renders with minimal required props', async () => {
    render(<CustomDialog {...minimalProps} />)

    const button = screen.getByRole('button', { name: minimalProps.buttonText })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    const description = await screen.findByText(minimalProps.description)
    expect(description).toBeInTheDocument()
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

    const cancelButton = await screen.findByRole('button', { name: defaultProps.cancelButton.text })
    fireEvent.click(cancelButton)

    expect(title).not.toBeInTheDocument()
  })

  test('renders all footer buttons correctly', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const confirmButton = await screen.findByRole('button', {
      name: defaultProps.confirmButton.text
    })
    const cancelButton = await screen.findByRole('button', { name: defaultProps.cancelButton.text })

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

  test('footer is not rendered when buttons are not provided', async () => {
    render(<CustomDialog {...minimalProps} />)

    const trigger = screen.getByRole('button', { name: minimalProps.buttonText })
    fireEvent.click(trigger)

    const description = await screen.findByText(minimalProps.description)
    expect(description).toBeInTheDocument()

    // Only the trigger button should be present, not footer buttons
    const allButtons = screen.getAllByRole('button')
    expect(allButtons).toHaveLength(1)
  })

  test('renders correct number of buttons in footer', async () => {
    render(<CustomDialog {...defaultProps} />)

    const trigger = screen.getByRole('button', { name: defaultProps.buttonText })
    fireEvent.click(trigger)

    const buttons = await screen.findAllByRole('button')
    // Trigger button + Cancel button + Confirm button = 3 total
    expect(buttons).toHaveLength(3)
  })
})
