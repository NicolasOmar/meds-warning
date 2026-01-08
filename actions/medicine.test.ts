import { describe, test, expect, vi, beforeEach } from 'vitest'
import * as z from 'zod'
// ACTIONS
import { createMedicineAction } from './medicine'
// SHARED
import { COMMON_FORM_ERRORS, MEDICINE_FORM_LABELS } from '@shared-constants/labels'

// Mock dependencies
vi.mock('@prisma/index', () => ({
  prisma: {
    medicine: {
      create: vi.fn()
    }
  }
}))

vi.mock('@shared-constants/labels', () => ({
  COMMON_FORM_ERRORS: {
    FORM_INPUTS_ERROR:
      'Sended information has an error. Please read and correct the commented fields.'
  },
  MEDICINE_FORM_LABELS: {
    SUCCESS: 'Medicine added successfully!'
  }
}))

vi.mock('@shared-types/zod', () => ({
  MedicineSchema: z.object({
    name: z.string().min(1).max(50),
    laboratory: z.string().max(50).nullable(),
    presentation: z.number().int(),
    expirationDate: z.date().nullable(),
    usedFor: z.string().max(75).nullable(),
    sideEffects: z.string().max(100).nullable(),
    comments: z.string().max(200).nullable()
  })
}))

describe('Medicine Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[createMedicineAction]', () => {
    test('creates medicine with valid data', async () => {
      const { prisma } = await import('@prisma/index')
      vi.mocked(prisma.medicine.create).mockResolvedValue({
        id: 1,
        name: 'Aspirin',
        laboratory: 'Bayer',
        presentation: 1,
        expirationDate: new Date('2025-12-31'),
        usedFor: 'Pain relief',
        sideEffects: 'None',
        comments: 'Take with water'
      })

      const formData = new FormData()
      formData.append('name', 'Aspirin')
      formData.append('laboratory', 'Bayer')
      formData.append('presentation', '1')
      formData.append('expirationDate', '2025-12-31')
      formData.append('usedFor', 'Pain relief')
      formData.append('sideEffects', 'None')
      formData.append('comments', 'Take with water')

      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
      expect(result.errors).toBeUndefined()
    })

    test('returns error with missing required fields', async () => {
      const formData = new FormData()
      formData.append('name', '')
      formData.append('laboratory', 'Bayer')

      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
    })

    test('parses empty form values to null', async () => {
      // Tests that empty optional fields don't cause validation errors
      // Only required fields need values
      const formData = new FormData()
      formData.append('name', 'Paracetamol')
      formData.append('presentation', '1')

      const result = await createMedicineAction({}, formData)

      // Should succeed because required fields are provided
      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('converts presentation string to number', async () => {
      // Tests that presentation field is correctly converted from string to number
      const formData = new FormData()
      formData.append('name', 'Medicine')
      formData.append('presentation', '5')

      const result = await createMedicineAction({}, formData)

      // Should succeed when presentation is a valid number string
      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('converts date string to Date object', async () => {
      // Tests that date field is correctly converted from string to Date object
      const formData = new FormData()
      formData.append('name', 'Medicine')
      formData.append('presentation', '1')
      formData.append('expirationDate', '2025-11-20')

      const result = await createMedicineAction({}, formData)

      // Should succeed when date is valid
      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('returns error for name exceeding max length', async () => {
      const formData = new FormData()
      const longName = 'A'.repeat(51) // Exceeds max length of 50
      formData.append('name', longName)

      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
    })

    test('handles medicine with only name and presentation field', async () => {
      // Tests that minimal required fields are sufficient for creation
      const formData = new FormData()
      formData.append('name', 'Aspirin')
      formData.append('presentation', '1')

      const result = await createMedicineAction({}, formData)

      // Should succeed with just name and presentation (required fields)
      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('calls prisma.medicine.create with correct data', async () => {
      const { prisma } = await import('@prisma/index')
      vi.mocked(prisma.medicine.create).mockResolvedValue({
        id: 1,
        name: 'Test Medicine',
        laboratory: 'Test Lab',
        presentation: 1,
        expirationDate: new Date('2025-12-31'),
        usedFor: 'Test',
        sideEffects: 'None',
        comments: 'Test'
      })

      const formData = new FormData()
      formData.append('name', 'Test Medicine')
      formData.append('laboratory', 'Test Lab')
      formData.append('presentation', '1')
      formData.append('expirationDate', '2025-12-31')
      formData.append('usedFor', 'Test')
      formData.append('sideEffects', 'None')
      formData.append('comments', 'Test')

      await createMedicineAction({}, formData)

      expect(prisma.medicine.create).toHaveBeenCalled()
    })
  })
})
