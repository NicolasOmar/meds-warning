import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CustomTextArea from './index'

describe('CustomTextArea Component', () => {
  const defaultProps = {
    label: 'Description',
    name: 'description',
    placeholder: 'Enter your description here...'
  }

  test('renders the field label', () => {
    render(<CustomTextArea {...defaultProps} />)
    const label = screen.getByText('Description')
    expect(label).toBeInTheDocument()
  })

  test('renders the textarea with correct attributes', () => {
    render(<CustomTextArea {...defaultProps} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('name', 'description')
    expect(textarea).toHaveAttribute('placeholder', 'Enter your description here...')
  })

  test('renders textarea with value prop', () => {
    const valueProps = {
      ...defaultProps,
      value: 'Some existing text'
    }
    render(<CustomTextArea {...valueProps} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toBe('Some existing text')
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
    const customProps = {
      label: 'Comments',
      name: 'comments',
      placeholder: 'Add comments...',
      value: ''
    }
    render(<CustomTextArea {...customProps} />)
    expect(screen.getByText('Comments')).toBeInTheDocument()
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('name', 'comments')
  })

  test('renders with long text value', () => {
    const longText =
      'This is a very long text that spans multiple lines and contains lots of content for testing purposes.'
    const propsWithLongText = {
      ...defaultProps,
      value: longText
    }
    render(<CustomTextArea {...propsWithLongText} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toBe(longText)
  })
})
