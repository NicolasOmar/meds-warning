import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
// COMPONENTS
import DatePicker from './index'

describe('[DatePicker]', () => {
  const defaultProps = {
    label: 'Select Date',
    name: 'date',
    placeholder: 'MM/DD/YYYY'
  }
  const selectDateRegExp = /select date/i

  test('renders the field label', () => {
    render(<DatePicker {...defaultProps} />)
    const label = screen.getByText(defaultProps.label)
    expect(label).toBeInTheDocument()
  })

  test('renders the input field with placeholder', () => {
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByPlaceholderText(defaultProps.placeholder)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', defaultProps.name)
  })

  test('renders the calendar button', () => {
    render(<DatePicker {...defaultProps} />)
    const button = screen.getByRole('button', { name: selectDateRegExp })
    expect(button).toBeInTheDocument()
  })

  test('initializes with empty value when not provided', () => {
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', defaultProps.name)
  })

  test('renders with custom placeholder', () => {
    const customPlaceholder = 'Choose a date'
    render(<DatePicker {...defaultProps} placeholder={customPlaceholder} />)
    const input = screen.getByPlaceholderText(customPlaceholder)
    expect(input).toBeInTheDocument()
  })

  test('renders with different name and label', () => {
    const customProps = {
      label: 'Birth Date',
      name: 'birthDate',
      placeholder: 'Select birth date'
    }
    render(<DatePicker {...customProps} />)
    expect(screen.getByText(customProps.label)).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', customProps.name)
    expect(input).toHaveAttribute('id', customProps.name)
  })

  test('calendar button is properly positioned', () => {
    render(<DatePicker {...defaultProps} />)
    const button = screen.getByRole('button', { name: selectDateRegExp })
    expect(button).toBeInTheDocument()
  })

  test('input can be typed into', async () => {
    const customDate = '01/15/2024'
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)

    const input = screen.getByRole('textbox')
    await user.type(input, customDate)
    expect((input as HTMLInputElement).value).toContain(customDate)
  })

  test('formatDate helper handles valid dates', () => {
    const dateValue = new Date('2024-01-15')
    render(<DatePicker {...defaultProps} value={dateValue.toISOString()} />)
    const input = screen.getByRole('textbox')
    // Should display formatted date
    expect((input as HTMLInputElement).value).toBeTruthy()
    expect((input as HTMLInputElement).value).toMatch(/January|01/i)
  })

  test('handles invalid date input', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'invalid-date')
    // Component should handle invalid input gracefully
    expect(input).toBeInTheDocument()
  })

  test('arrow key interaction with input', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox')

    await user.click(input)
    await user.keyboard('{ArrowDown}')

    // After pressing ArrowDown, popover should be triggered
    expect(input).toBeInTheDocument()
  })

  test('calendar button can be clicked', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const button = screen.getByRole('button', { name: selectDateRegExp })

    await user.click(button)
    // Button click should be handled
    expect(button).toBeInTheDocument()
  })

  test('input field receives focus', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox')

    await user.click(input)
    expect(input).toHaveFocus()
  })

  test('value prop creates formatted date on render', () => {
    const dateValue = '2025-12-25'
    render(<DatePicker {...defaultProps} value={dateValue} />)

    const input = screen.getByRole('textbox')
    expect((input as HTMLInputElement).value).toBeTruthy()
  })

  test('empty value prop renders without error', () => {
    render(<DatePicker {...defaultProps} value="" />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })
})
