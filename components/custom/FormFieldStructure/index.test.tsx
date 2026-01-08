import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import FormFieldStructure from './index'

describe('[FormFieldStructure]', () => {
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
    const label = screen.getByText(defaultProps.label)
    expect(label).toBeInTheDocument()
  })

  test('renders the label with correct htmlFor attribute', () => {
    render(
      <FormFieldStructure {...defaultProps}>
        <input type="text" />
      </FormFieldStructure>
    )
    const label = screen.getByText(defaultProps.label)
    expect(label).toHaveAttribute('for', defaultProps.name)
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
    const helpfulMessage = 'This is a helpful message'
    const propsWithMessage = {
      ...defaultProps,
      message: helpfulMessage
    }
    render(
      <FormFieldStructure {...propsWithMessage}>
        <input type="text" />
      </FormFieldStructure>
    )
    expect(screen.getByText(helpfulMessage)).toBeInTheDocument()
  })

  test('renders without message when not provided', () => {
    render(
      <FormFieldStructure {...defaultProps}>
        <input type="text" />
      </FormFieldStructure>
    )
    const label = screen.getByText(defaultProps.label)
    expect(label).toBeInTheDocument()
  })

  test('renders with array of messages', () => {
    const errorMessages = ['Error 1', 'Error 2', 'Error 3']
    const propsWithMessages = {
      ...defaultProps,
      message: errorMessages
    }
    const { container } = render(
      <FormFieldStructure {...propsWithMessages}>
        <input type="text" />
      </FormFieldStructure>
    )
    const description = container.querySelector('[data-slot="field-description"]')

    errorMessages.forEach(msg => {
      expect(description).toHaveTextContent(msg)
    })
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
    const label = screen.getByText(customProps.label)
    expect(label).toHaveAttribute('for', customProps.name)
  })

  test('renders complex children components', () => {
    const complexFieldConfig = {
      label: 'Complex Field',
      name: 'complex',
      text: 'Helper text'
    }
    const complexChildren = (
      <div>
        <input type="text" />
        <span>{complexFieldConfig.text}</span>
      </div>
    )
    render(
      <FormFieldStructure label={complexFieldConfig.label} name={complexFieldConfig.name}>
        {complexChildren}
      </FormFieldStructure>
    )
    expect(screen.getByText(complexFieldConfig.label)).toBeInTheDocument()
    expect(screen.getByText(complexFieldConfig.text)).toBeInTheDocument()
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
