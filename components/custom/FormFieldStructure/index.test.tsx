import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import FormFieldStructure from './index'

describe('FormFieldStructure Component', () => {
  const defaultProps = {
    label: 'Email',
    name: 'email'
  }

  test('renders the label', () => {
    render(
      <FormFieldStructure {...defaultProps}>
        <input type="text" />
      </FormFieldStructure>
    )
    const label = screen.getByText('Email')
    expect(label).toBeInTheDocument()
  })

  test('renders the label with correct htmlFor attribute', () => {
    render(
      <FormFieldStructure {...defaultProps}>
        <input type="text" />
      </FormFieldStructure>
    )
    const label = screen.getByText('Email')
    expect(label).toHaveAttribute('for', 'email')
  })

  test('renders the children', () => {
    render(
      <FormFieldStructure {...defaultProps}>
        <input type="text" />
      </FormFieldStructure>
    )
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  test('renders with message string', () => {
    const propsWithMessage = {
      ...defaultProps,
      message: 'This is a helpful message'
    }
    render(
      <FormFieldStructure {...propsWithMessage}>
        <input type="text" />
      </FormFieldStructure>
    )
    expect(screen.getByText('This is a helpful message')).toBeInTheDocument()
  })

  test('renders without message when not provided', () => {
    render(
      <FormFieldStructure {...defaultProps}>
        <input type="text" />
      </FormFieldStructure>
    )
    const label = screen.getByText('Email')
    expect(label).toBeInTheDocument()
  })

  test('renders with array of messages', () => {
    const propsWithMessages = {
      ...defaultProps,
      message: ['Error 1', 'Error 2', 'Error 3']
    }
    const { container } = render(
      <FormFieldStructure {...propsWithMessages}>
        <input type="text" />
      </FormFieldStructure>
    )
    const description = container.querySelector('[data-slot="field-description"]')
    expect(description).toHaveTextContent('Error 1')
    expect(description).toHaveTextContent('Error 2')
    expect(description).toHaveTextContent('Error 3')
  })

  test('renders with single item in message array', () => {
    const propsWithSingleMessage = {
      ...defaultProps,
      message: ['Single message']
    }
    render(
      <FormFieldStructure {...propsWithSingleMessage}>
        <input type="text" />
      </FormFieldStructure>
    )
    expect(screen.getByText('Single message')).toBeInTheDocument()
  })

  test('renders with empty message array', () => {
    const propsWithEmptyArray = {
      ...defaultProps,
      message: []
    }
    render(
      <FormFieldStructure {...propsWithEmptyArray}>
        <input type="text" />
      </FormFieldStructure>
    )
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  test('has correct structure with field container', () => {
    const { container } = render(
      <FormFieldStructure {...defaultProps}>
        <input type="text" />
      </FormFieldStructure>
    )
    const field = container.querySelector('[class*="flex"]')
    expect(field).toBeInTheDocument()
  })

  test('renders with different label and name', () => {
    const customProps = {
      label: 'Password',
      name: 'password'
    }
    render(
      <FormFieldStructure {...customProps}>
        <input type="password" />
      </FormFieldStructure>
    )
    const label = screen.getByText('Password')
    expect(label).toHaveAttribute('for', 'password')
  })

  test('renders complex children components', () => {
    const complexChildren = (
      <div>
        <input type="text" />
        <span>Helper text</span>
      </div>
    )
    render(
      <FormFieldStructure label="Complex Field" name="complex">
        {complexChildren}
      </FormFieldStructure>
    )
    expect(screen.getByText('Complex Field')).toBeInTheDocument()
    expect(screen.getByText('Helper text')).toBeInTheDocument()
  })

  test('message array items render correctly', () => {
    const propsWithMessages = {
      ...defaultProps,
      message: ['Message A', 'Message B']
    }
    const { container } = render(
      <FormFieldStructure {...propsWithMessages}>
        <input type="text" />
      </FormFieldStructure>
    )
    const description = container.querySelector('[data-slot="field-description"]')
    expect(description).toHaveTextContent('Message A')
    expect(description).toHaveTextContent('Message B')
  })

  test('handles undefined message gracefully', () => {
    const propsWithUndefinedMessage = {
      ...defaultProps,
      message: undefined
    }
    render(
      <FormFieldStructure {...propsWithUndefinedMessage}>
        <input type="text" />
      </FormFieldStructure>
    )
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })
})
