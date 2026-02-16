import { describe, test, expect, vi, beforeEach } from 'vitest'
import { sendTemplateEmail, EmailTemplateName } from '../email'

const mockCreate = vi.fn()

vi.mock('mailgun.js', () => {
  return {
    default: class Mailgun {
      client() {
        return {
          messages: {
            create: mockCreate
          }
        }
      }
    }
  }
})

describe('[sendTemplateEmail]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.MAILGUN_API_KEY = 'test-api-key'
    process.env.MAILGUN_DOMAIN = 'test-domain.com'
  })

  test('sends email with MedicineToExpire template', async () => {
    const params = {
      nameRecipient: 'John Doe',
      emailRecipient: 'john@example.com',
      subject: 'Your medicine is expiring soon',
      templateName: EmailTemplateName.MedicineToExpire,
      templateVariables: {
        userName: 'John Doe',
        medicineName: 'Aspirin',
        expirationDate: '2026-03-15'
      }
    }

    mockCreate.mockResolvedValue({ id: 'message-id' })

    await sendTemplateEmail(params)

    expect(mockCreate).toHaveBeenCalledWith('test-domain.com', {
      from: 'MedsWarning <postmaster@test-domain.com>',
      to: ['John Doe <john@example.com>'],
      subject: 'Your medicine is expiring soon',
      template: EmailTemplateName.MedicineToExpire,
      'h:X-Mailgun-Variables': JSON.stringify({
        userName: 'John Doe',
        medicineName: 'Aspirin',
        expirationDate: '2026-03-15'
      })
    })
  })

  test('sends email with PasswordReset template', async () => {
    const params = {
      nameRecipient: 'Jane Smith',
      emailRecipient: 'jane@example.com',
      subject: 'Password Reset Request',
      templateName: EmailTemplateName.PasswordReset,
      templateVariables: {
        userName: 'Jane Smith',
        resetPasswordUrl: 'http://localhost:3000/password/reset/token123'
      }
    }

    mockCreate.mockResolvedValue({ id: 'message-id-2' })

    await sendTemplateEmail(params)

    expect(mockCreate).toHaveBeenCalledWith('test-domain.com', {
      from: 'MedsWarning <postmaster@test-domain.com>',
      to: ['Jane Smith <jane@example.com>'],
      subject: 'Password Reset Request',
      template: EmailTemplateName.PasswordReset,
      'h:X-Mailgun-Variables': JSON.stringify({
        userName: 'Jane Smith',
        resetPasswordUrl: 'http://localhost:3000/password/reset/token123'
      })
    })
  })

  test('formats recipient with name and email correctly', async () => {
    const params = {
      nameRecipient: 'Test User',
      emailRecipient: 'test@domain.com',
      subject: 'Test Subject',
      templateName: EmailTemplateName.MedicineToExpire,
      templateVariables: { test: 'value' }
    }

    mockCreate.mockResolvedValue({ id: 'msg-id' })

    await sendTemplateEmail(params)

    const callArgs = mockCreate.mock.calls[0][1]
    expect(callArgs.to).toEqual(['Test User <test@domain.com>'])
  })

  test('includes correct from address with domain', async () => {
    process.env.MAILGUN_DOMAIN = 'mail.example.com'

    const params = {
      nameRecipient: 'User',
      emailRecipient: 'user@test.com',
      subject: 'Test',
      templateName: EmailTemplateName.PasswordReset,
      templateVariables: {}
    }

    mockCreate.mockResolvedValue({ id: 'msg-id' })

    await sendTemplateEmail(params)

    const callArgs = mockCreate.mock.calls[0][1]
    expect(callArgs.from).toBe('MedsWarning <postmaster@mail.example.com>')
  })

  test('stringifies template variables correctly', async () => {
    const complexVariables = {
      userName: 'John',
      medicineName: 'Test Medicine',
      expirationDate: '2026-12-31',
      additionalInfo: 'Some extra info'
    }

    const params = {
      nameRecipient: 'John',
      emailRecipient: 'john@test.com',
      subject: 'Test',
      templateName: EmailTemplateName.MedicineToExpire,
      templateVariables: complexVariables
    }

    mockCreate.mockResolvedValue({ id: 'msg-id' })

    await sendTemplateEmail(params)

    const callArgs = mockCreate.mock.calls[0][1]
    expect(callArgs['h:X-Mailgun-Variables']).toBe(JSON.stringify(complexVariables))
  })

  test('handles empty template variables object', async () => {
    const params = {
      nameRecipient: 'User',
      emailRecipient: 'user@test.com',
      subject: 'Test',
      templateName: EmailTemplateName.PasswordReset,
      templateVariables: {}
    }

    mockCreate.mockResolvedValue({ id: 'msg-id' })

    await sendTemplateEmail(params)

    const callArgs = mockCreate.mock.calls[0][1]
    expect(callArgs['h:X-Mailgun-Variables']).toBe('{}')
  })

  test('uses correct mailgun domain from environment', async () => {
    process.env.MAILGUN_DOMAIN = 'custom-domain.com'

    const params = {
      nameRecipient: 'User',
      emailRecipient: 'user@test.com',
      subject: 'Test',
      templateName: EmailTemplateName.MedicineToExpire,
      templateVariables: {}
    }

    mockCreate.mockResolvedValue({ id: 'msg-id' })

    await sendTemplateEmail(params)

    expect(mockCreate).toHaveBeenCalledWith('custom-domain.com', expect.any(Object))
  })

  test('passes subject exactly as provided', async () => {
    const customSubject = 'Important: Your medicine expires tomorrow!'

    const params = {
      nameRecipient: 'User',
      emailRecipient: 'user@test.com',
      subject: customSubject,
      templateName: EmailTemplateName.MedicineToExpire,
      templateVariables: {}
    }

    mockCreate.mockResolvedValue({ id: 'msg-id' })

    await sendTemplateEmail(params)

    const callArgs = mockCreate.mock.calls[0][1]
    expect(callArgs.subject).toBe(customSubject)
  })

  test('handles special characters in recipient name', async () => {
    const params = {
      nameRecipient: "O'Brien-Smith Jr.",
      emailRecipient: 'obrien@test.com',
      subject: 'Test',
      templateName: EmailTemplateName.PasswordReset,
      templateVariables: {}
    }

    mockCreate.mockResolvedValue({ id: 'msg-id' })

    await sendTemplateEmail(params)

    const callArgs = mockCreate.mock.calls[0][1]
    expect(callArgs.to).toEqual(["O'Brien-Smith Jr. <obrien@test.com>"])
  })

  test('handles template variables with nested data', async () => {
    const params = {
      nameRecipient: 'User',
      emailRecipient: 'user@test.com',
      subject: 'Test',
      templateName: EmailTemplateName.MedicineToExpire,
      templateVariables: {
        userName: 'Test',
        data: {
          nested: 'value',
          count: 123
        }
      }
    }

    mockCreate.mockResolvedValue({ id: 'msg-id' })

    await sendTemplateEmail(params)

    const callArgs = mockCreate.mock.calls[0][1]
    const parsedVariables = JSON.parse(callArgs['h:X-Mailgun-Variables'])
    expect(parsedVariables.data.nested).toBe('value')
    expect(parsedVariables.data.count).toBe(123)
  })
})
