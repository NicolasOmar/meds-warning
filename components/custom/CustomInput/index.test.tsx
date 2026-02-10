import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import CustomField from './index'
// MOCKS
import { defaultProps, textFieldProps } from './mocks.json'

describe('[CustomField]', () => {
  test('renders the field label', () => {
    render(<CustomField {...defaultProps} />)
    const label = screen.getByLabelText(defaultProps.label)
    expect(label).toBeInTheDocument()
  })

  test('renders the input with correct attributes', () => {
    render(<CustomField {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', defaultProps.name)
    expect(input).toHaveAttribute('type', defaultProps.type)
    expect(input).toHaveAttribute('placeholder', defaultProps.placeholder)
    expect(input).not.toBeRequired()
  })

  test('renders with value prop', () => {
    const customValue = 'existing@example.com'
    render(<CustomField {...defaultProps} value={customValue} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue(customValue)
  })

  test('renders with text type input', () => {
    render(<CustomField {...textFieldProps} />)
    const input = screen.getByPlaceholderText(textFieldProps.placeholder)
    expect(input).toHaveAttribute('type', textFieldProps.type)
  })

  test('input is marked as required', () => {
    render(<CustomField {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).not.toBeRequired()
  })

  test('renders input with readonly attribute when provided', () => {
    render(<CustomField {...defaultProps} disabled={true} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
  })

  test('renders input without readonly attribute by default', () => {
    render(<CustomField {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).not.toHaveAttribute('readonly')
  })
})
