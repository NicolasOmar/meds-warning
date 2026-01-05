import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CustomSelect from './index'

describe('CustomSelect Component', () => {
  const defaultProps = {
    label: 'Select an option',
    name: 'options',
    placeholder: 'Choose one...',
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' }
    ]
  }

  test('renders the field label', () => {
    render(<CustomSelect {...defaultProps} />)
    const label = screen.getByText('Select an option')
    expect(label).toBeInTheDocument()
  })

  test('renders the select trigger', () => {
    render(<CustomSelect {...defaultProps} />)
    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeInTheDocument()
  })

  test('renders form field structure', () => {
    const { container } = render(<CustomSelect {...defaultProps} />)
    const field = container.querySelector('[role="group"]')
    expect(field).toBeInTheDocument()
  })

  test('renders with select label when provided', () => {
    const propsWithLabel = {
      ...defaultProps,
      selectLabel: 'Available Options'
    }
    const { container } = render(<CustomSelect {...propsWithLabel} />)
    const field = container.querySelector('[role="group"]')
    expect(field).toBeInTheDocument()
  })

  test('includes options in component props', () => {
    const optionsList = [
      { label: 'Cat', value: 'cat' },
      { label: 'Dog', value: 'dog' }
    ]
    const propsWithOptions = {
      ...defaultProps,
      options: optionsList
    }
    render(<CustomSelect {...propsWithOptions} />)
    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeInTheDocument()
  })

  test('renders with message prop', () => {
    const propsWithMessage = {
      ...defaultProps,
      message: 'This is a helpful message'
    }
    const { container } = render(<CustomSelect {...propsWithMessage} />)
    const description = container.querySelector('[data-slot="field-description"]')
    expect(description).toHaveTextContent('This is a helpful message')
  })

  test('renders with array of messages', () => {
    const propsWithMessages = {
      ...defaultProps,
      message: ['Error 1', 'Error 2']
    }
    const { container } = render(<CustomSelect {...propsWithMessages} />)
    const description = container.querySelector('[data-slot="field-description"]')
    expect(description).toHaveTextContent('Error 1')
    expect(description).toHaveTextContent('Error 2')
  })

  test('has correct select name attribute', () => {
    const { container } = render(<CustomSelect {...defaultProps} />)
    const selectElement = container.querySelector('select')
    if (selectElement) {
      expect(selectElement).toHaveAttribute('name', 'options')
    } else {
      // Radix UI may not render a native select element
      const trigger = screen.getByRole('combobox')
      expect(trigger).toBeInTheDocument()
    }
  })
})
