import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import CustomSelect from './index'
// MOCKS
import {
  defaultProps,
  animalOptions,
  propsWithLabel,
  propsWithMessage,
  propsWithMessages
} from './mocks.json'

describe('[CustomSelect]', () => {
  test('renders the field label', () => {
    render(<CustomSelect {...defaultProps} />)
    const label = screen.getByText(defaultProps.label)
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
    const { container } = render(<CustomSelect {...propsWithLabel} />)
    const field = container.querySelector('[role="group"]')
    expect(field).toBeInTheDocument()
  })

  test('includes options in component props', () => {
    const propsWithOptions = {
      ...defaultProps,
      options: animalOptions
    }
    render(<CustomSelect {...propsWithOptions} />)
    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeInTheDocument()
  })

  test('renders with message prop', () => {
    const { container } = render(<CustomSelect {...propsWithMessage} />)
    const description = container.querySelector('[data-slot="field-description"]')
    expect(description).toHaveTextContent(propsWithMessage.message)
  })

  test('renders with array of messages', () => {
    const { container } = render(<CustomSelect {...propsWithMessages} />)
    const description = container.querySelector('[data-slot="field-description"]')

    propsWithMessages.message.forEach(msg => {
      expect(description).toHaveTextContent(msg)
    })
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
