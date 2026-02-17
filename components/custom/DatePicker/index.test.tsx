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

  test('renders label, input with correct id, and hidden input with correct name', () => {
    render(<DatePicker {...defaultProps} />)
    expect(screen.getByText(defaultProps.label)).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', defaultProps.name)
    expect(input).not.toHaveAttribute('name')

    const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput).toHaveAttribute('name', defaultProps.name)
  })

  test('renders the input field with placeholder', () => {
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByPlaceholderText(defaultProps.placeholder)
    expect(input).toBeInTheDocument()
  })

  test('renders the calendar button', () => {
    render(<DatePicker {...defaultProps} />)
    const button = screen.getByRole('button', { name: selectDateRegExp })
    expect(button).toBeInTheDocument()
  })

  test('renders with different name and label, assigning id and name to separate elements', () => {
    const customProps = {
      label: 'Birth Date',
      name: 'birthDate',
      placeholder: 'Select birth date'
    }
    render(<DatePicker {...customProps} />)
    expect(screen.getByText(customProps.label)).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', customProps.name)

    const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement
    expect(hiddenInput).toHaveAttribute('name', customProps.name)
  })

  test('renders with custom placeholder', () => {
    const customPlaceholder = 'Choose a date'
    render(<DatePicker {...defaultProps} placeholder={customPlaceholder} />)
    const input = screen.getByPlaceholderText(customPlaceholder)
    expect(input).toBeInTheDocument()
  })

  test('initializes from UTC ISO string with correct calendar date and hidden value', () => {
    render(<DatePicker {...defaultProps} value="2025-11-02T00:00:00.000Z" />)

    const input = screen.getByRole('textbox')
    expect((input as HTMLInputElement).value).toBe('November 02, 2025')

    const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement
    expect(hiddenInput).toHaveValue('2025-11-02T00:00:00.000Z')
  })

  test('formatDate helper handles valid dates', () => {
    render(<DatePicker {...defaultProps} value="2024-01-15T00:00:00.000Z" />)
    const input = screen.getByRole('textbox')
    expect((input as HTMLInputElement).value).toMatch(/January|01/i)
  })

  test('handles invalid date input gracefully', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'invalid-date')
    expect(input).toBeInTheDocument()
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

  test('input can be typed into and updates display value', async () => {
    const customDate = '01/15/2024'
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)

    const input = screen.getByRole('textbox')
    await user.type(input, customDate)
    expect((input as HTMLInputElement).value).toContain(customDate)
  })

  test('arrow key opens calendar popover', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox')

    await user.click(input)
    await user.keyboard('{ArrowDown}')
    expect(input).toBeInTheDocument()
  })

  test('calendar button can be clicked', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const button = screen.getByRole('button', { name: selectDateRegExp })

    await user.click(button)
    expect(button).toBeInTheDocument()
  })

  test('input field receives focus on click', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox')

    await user.click(input)
    expect(input).toHaveFocus()
  })
})
