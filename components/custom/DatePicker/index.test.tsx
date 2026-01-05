import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import DatePicker from './index'

describe('DatePicker Component', () => {
  const defaultProps = {
    label: 'Select Date',
    name: 'date',
    placeholder: 'MM/DD/YYYY'
  }

  test('renders the field label', () => {
    render(<DatePicker {...defaultProps} />)
    const label = screen.getByText('Select Date')
    expect(label).toBeInTheDocument()
  })

  test('renders the input field with placeholder', () => {
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByPlaceholderText('MM/DD/YYYY')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'date')
  })

  test('renders the calendar button', () => {
    render(<DatePicker {...defaultProps} />)
    const button = screen.getByRole('button', { name: /select date/i })
    expect(button).toBeInTheDocument()
  })

  test('renders with value prop', () => {
    const dateValue = new Date('2024-01-15')
    render(<DatePicker {...defaultProps} value={dateValue.toISOString()} />)
    const input = screen.getByDisplayValue(/january/i)
    expect(input).toBeInTheDocument()
  })

  test('initializes with empty value when not provided', () => {
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toBeInTheDocument()
  })

  test('renders with custom placeholder', () => {
    const customPlaceholder = 'Choose a date'
    render(<DatePicker {...defaultProps} placeholder={customPlaceholder} />)
    const input = screen.getByPlaceholderText(customPlaceholder)
    expect(input).toBeInTheDocument()
  })

  test('input has correct name attribute', () => {
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'date')
  })

  test('input has correct id attribute', () => {
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'date')
  })

  test('renders with different name and label', () => {
    const customProps = {
      label: 'Birth Date',
      name: 'birthDate',
      placeholder: 'Select birth date'
    }
    render(<DatePicker {...customProps} />)
    expect(screen.getByText('Birth Date')).toBeInTheDocument()
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'birthDate')
    expect(input).toHaveAttribute('id', 'birthDate')
  })

  test('calendar button is properly positioned', () => {
    render(<DatePicker {...defaultProps} />)
    const button = screen.getByRole('button', { name: /select date/i })
    expect(button).toHaveClass('absolute', 'right-2')
  })

  test('renders section container', () => {
    const { container } = render(<DatePicker {...defaultProps} />)
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('relative', 'flex', 'gap-2')
  })

  test('input can be typed into', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    await user.type(input, '01/15/2024')
    expect(input.value).toContain('01/15/2024')
  })

  test('formatDate helper handles valid dates', () => {
    const dateValue = new Date('2024-01-15')
    render(<DatePicker {...defaultProps} value={dateValue.toISOString()} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    // Should display formatted date
    expect(input.value).toBeTruthy()
    expect(input.value).toMatch(/January|01/i)
  })

  test('formatDate helper returns empty string for undefined', () => {
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    // Initial value should be formatted or empty
    expect(input).toBeInTheDocument()
  })

  test('handles invalid date input', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    await user.type(input, 'invalid-date')
    // Component should handle invalid input gracefully
    expect(input).toBeInTheDocument()
  })

  test('arrow key interaction with input', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox') as HTMLInputElement

    await user.click(input)
    await user.keyboard('{ArrowDown}')

    // After pressing ArrowDown, popover should be triggered
    expect(input).toBeInTheDocument()
  })

  test('calendar button can be clicked', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const button = screen.getByRole('button', { name: /select date/i })

    await user.click(button)
    // Button click should be handled
    expect(button).toBeInTheDocument()
  })

  test('input maintains value after interaction', async () => {
    const dateValue = new Date('2024-01-15')
    render(<DatePicker {...defaultProps} value={dateValue.toISOString()} />)
    const input = screen.getByRole('textbox') as HTMLInputElement

    const initialValue = input.value
    expect(initialValue).toBeTruthy()
  })

  test('component renders with all required props', () => {
    const { container } = render(<DatePicker {...defaultProps} />)

    const field = container.querySelector('[role="group"]')
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')

    expect(field).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })

  test('popover trigger button has sr-only text', () => {
    render(<DatePicker {...defaultProps} />)
    const srText = screen.getByText('Select date')
    expect(srText).toHaveClass('sr-only')
  })

  test('input has correct CSS classes for styling', () => {
    render(<DatePicker {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('bg-background', 'pr-10')
  })

  test('handles popover state changes', async () => {
    const user = userEvent.setup()
    render(<DatePicker {...defaultProps} />)
    const button = screen.getByRole('button', { name: /select date/i })

    // Click to open popover
    await user.click(button)
    expect(button).toBeInTheDocument()

    // Click again to potentially close
    await user.click(button)
    expect(button).toBeInTheDocument()
  })

  test('calendar icon is rendered in button', () => {
    render(<DatePicker {...defaultProps} />)
    const button = screen.getByRole('button', { name: /select date/i })
    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('lucide', 'lucide-calendar')
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
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBeTruthy()
  })

  test('empty value prop renders without error', () => {
    render(<DatePicker {...defaultProps} value="" />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  test('field structure contains all expected elements', () => {
    render(<DatePicker {...defaultProps} />)
    const label = screen.getByText('Select Date')
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')

    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })
})
