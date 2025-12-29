import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CustomField from './index'

describe('CustomField Component', () => {
  const defaultProps = {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'john@example.com'
  }

  test('renders the field label', () => {
    render(<CustomField {...defaultProps} />)
    const label = screen.getByLabelText('Email')
    expect(label).toBeInTheDocument()
  })

  test('renders the input with correct attributes', () => {
    render(<CustomField {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'email')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('placeholder', 'john@example.com')
    expect(input).toBeRequired()
  })

  test('renders with value prop', () => {
    render(<CustomField {...defaultProps} value="existing@example.com" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('existing@example.com')
  })

  test('renders with text type input', () => {
    const textFieldProps = { ...defaultProps, type: 'text', label: 'Name' }
    render(<CustomField {...textFieldProps} />)
    const input = screen.getByPlaceholderText('john@example.com')
    expect(input).toHaveAttribute('type', 'text')
  })

  test('input is marked as required', () => {
    render(<CustomField {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })
})
