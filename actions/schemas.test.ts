import { describe, test, expect } from 'vitest'
import { signUpFormSchema } from './schemas'

describe('Zod Schemas', () => {
  describe('signUpFormSchema', () => {
    test('validates correct data successfully', () => {
      const validData = {
        name: 'John',
        lastName: 'Doe',
        likedMovie: 'The Matrix',
        email: 'john@example.com'
      }

      const result = signUpFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    test('validates data with optional fields missing', () => {
      const validData = {
        name: 'John',
        email: 'john@example.com'
      }

      const result = signUpFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    test('fails when name is empty', () => {
      const invalidData = {
        name: '',
        email: 'john@example.com'
      }

      const result = signUpFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined()
      }
    })

    test('fails when name is missing', () => {
      const invalidData = {
        email: 'john@example.com'
      }

      const result = signUpFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined()
      }
    })

    test('fails when email is invalid', () => {
      const invalidData = {
        name: 'John',
        email: 'not-an-email'
      }

      const result = signUpFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined()
      }
    })

    test('fails when email is missing', () => {
      const invalidData = {
        name: 'John'
      }

      const result = signUpFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined()
      }
    })

    test('allows optional lastName', () => {
      const validData = {
        name: 'John',
        email: 'john@example.com',
        lastName: undefined
      }

      const result = signUpFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    test('allows optional likedMovie', () => {
      const validData = {
        name: 'John',
        email: 'john@example.com',
        likedMovie: undefined
      }

      const result = signUpFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    test('validates email format correctly', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
        'user_name@example.com'
      ]

      validEmails.forEach(email => {
        const result = signUpFormSchema.safeParse({
          name: 'John',
          email
        })
        expect(result.success).toBe(true)
      })
    })

    test('rejects invalid email formats', () => {
      const invalidEmails = ['test@', '@example.com', 'test example@example.com', 'test@.com']

      invalidEmails.forEach(email => {
        const result = signUpFormSchema.safeParse({
          name: 'John',
          email
        })
        expect(result.success).toBe(false)
      })
    })

    test('includes all required fields in parsed data', () => {
      const validData = {
        name: 'John',
        lastName: 'Doe',
        likedMovie: 'The Matrix',
        email: 'john@example.com'
      }

      const result = signUpFormSchema.safeParse(validData)
      if (result.success) {
        expect(result.data).toHaveProperty('name')
        expect(result.data).toHaveProperty('email')
        expect(result.data.name).toBe('John')
        expect(result.data.email).toBe('john@example.com')
      }
    })
  })
})
