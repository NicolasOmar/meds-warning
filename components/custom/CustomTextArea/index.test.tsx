import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import CustomTextArea from './index'
// MOCKS
import { defaultProps, propsWithValue, customNameAndLabel, longTextValue } from './mocks.json'

describe('[CustomTextArea]', () => {
  test('renders the field label', () => {
    render(<CustomTextArea {...defaultProps} />)
    const label = screen.getByText(defaultProps.label)
    expect(label).toBeInTheDocument()
  })

  test('renders the textarea with correct attributes', () => {
    render(<CustomTextArea {...defaultProps} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('name', defaultProps.name)
    expect(textarea).toHaveAttribute('placeholder', defaultProps.placeholder)
  })

  test('renders textarea with value prop', () => {
    render(<CustomTextArea {...propsWithValue} />)
    const textarea = screen.getByRole('textbox')
    expect((textarea as HTMLTextAreaElement).value).toBe(propsWithValue.value)
  })

  test('renders with undefined value', () => {
    render(<CustomTextArea {...defaultProps} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  test('renders with custom placeholder', () => {
    const customPlaceholder = 'Write your notes here'
    render(<CustomTextArea {...defaultProps} placeholder={customPlaceholder} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('placeholder', customPlaceholder)
  })

  test('renders textarea with id attribute matching name', () => {
    render(<CustomTextArea {...defaultProps} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('id', 'description')
  })

  test('renders with different name and label', () => {
    render(<CustomTextArea {...customNameAndLabel} />)
    expect(screen.getByText('Comments')).toBeInTheDocument()
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('name', 'comments')
  })

  test('renders with long text value', () => {
    const propsWithLongText = {
      ...defaultProps,
      value: longTextValue
    }
    render(<CustomTextArea {...propsWithLongText} />)
    const textarea = screen.getByRole('textbox')
    expect((textarea as HTMLTextAreaElement).value).toBe(longTextValue)
  })
})
