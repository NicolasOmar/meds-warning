import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import FormFieldTemplate from './index'

describe('[FormFieldTemplate]', () => {
  const defaultProps = {
    label: 'Email',
    name: 'email'
  }

  test('renders the label', () => {
    render(
      <FormFieldTemplate {...defaultProps}>
        <input type="text" />
      </FormFieldTemplate>
    )
    const label = screen.getByText(defaultProps.label)
    expect(label).toBeInTheDocument()
  })

  test('renders the label with correct htmlFor attribute', () => {
    render(
      <FormFieldTemplate {...defaultProps}>
        <input type="text" />
      </FormFieldTemplate>
    )
    const label = screen.getByText(defaultProps.label)
    expect(label).toHaveAttribute('for', defaultProps.name)
  })

  test('renders the children', () => {
    render(
      <FormFieldTemplate {...defaultProps}>
        <input type="text" />
      </FormFieldTemplate>
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
      <FormFieldTemplate {...propsWithMessage}>
        <input type="text" />
      </FormFieldTemplate>
    )
    expect(screen.getByText(helpfulMessage)).toBeInTheDocument()
  })

  test('renders without message when not provided', () => {
    render(
      <FormFieldTemplate {...defaultProps}>
        <input type="text" />
      </FormFieldTemplate>
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
      <FormFieldTemplate {...propsWithMessages}>
        <input type="text" />
      </FormFieldTemplate>
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
      <FormFieldTemplate {...propsWithSingleMessage}>
        <input type="text" />
      </FormFieldTemplate>
    )
    expect(screen.getByText('Single message')).toBeInTheDocument()
  })

  test('renders with empty message array', () => {
    const propsWithEmptyArray = {
      ...defaultProps,
      message: []
    }
    render(
      <FormFieldTemplate {...propsWithEmptyArray}>
        <input type="text" />
      </FormFieldTemplate>
    )
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  test('has correct structure with field container', () => {
    const { container } = render(
      <FormFieldTemplate {...defaultProps}>
        <input type="text" />
      </FormFieldTemplate>
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
      <FormFieldTemplate {...customProps}>
        <input type="password" />
      </FormFieldTemplate>
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
      <FormFieldTemplate label={complexFieldConfig.label} name={complexFieldConfig.name}>
        {complexChildren}
      </FormFieldTemplate>
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
      <FormFieldTemplate {...propsWithUndefinedMessage}>
        <input type="text" />
      </FormFieldTemplate>
    )
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })
})
