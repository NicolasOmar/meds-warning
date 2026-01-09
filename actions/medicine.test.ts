import { describe, test, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@prisma/index'
// ACTIONS
import { createMedicineAction } from './medicine'
// SHARED
import { COMMON_FORM_ERRORS, MEDICINE_FORM_LABELS } from '@shared-constants/labels'

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

// MOCKS
import {
  medicineCreationResponse,
  missingRequiredFieldsData,
  emptyNullFormValues,
  presentationStringToNumber,
  convertsDateStringToDateObj,
  minimalFormData,
  medicineUpdateResponse,
  medicineUpdateWithNullFields,
  medicineUpdateOnlyName
} from './mocks.json'

const populateFormData = (
  mockedData: Record<string, string | number | null>,
  avoidKeys: string[] = []
) => {
  const baseFormData = new FormData()

  Object.entries(mockedData).forEach(([key, value]) => {
    if (!avoidKeys.includes(key) && value !== null) {
      baseFormData.append(key, value.toString())
    }
  })

  return baseFormData
}

// Mock dependencies
vi.mock('@prisma/index', () => ({
  prisma: {
    medicine: {
      create: vi.fn(),
      update: vi.fn()
    }
  }
}))

describe('Medicine Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[createMedicineAction]', () => {
    test('creates medicine with valid data and calls prisma.medicine.create', async () => {
      vi.mocked(prisma.medicine.create).mockResolvedValue({
        ...medicineCreationResponse,
        expirationDate: new Date(medicineCreationResponse.expirationDate)
      })

      const formData = populateFormData(medicineCreationResponse, ['id'])
      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
      expect(result.errors).toBeUndefined()
      expect(prisma.medicine.create).toHaveBeenCalled()
    })

    test('returns error with missing required fields', async () => {
      const formData = populateFormData(missingRequiredFieldsData)
      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
    })

    test('parses empty form values to null', async () => {
      const formData = populateFormData(emptyNullFormValues)
      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('converts presentation string to number', async () => {
      const formData = populateFormData(presentationStringToNumber)
      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('converts date string to Date object', async () => {
      const formData = populateFormData(convertsDateStringToDateObj)
      const result = await createMedicineAction({}, formData)

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
      const formData = populateFormData(minimalFormData)
      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('calls prisma.medicine.create without id parameter', async () => {
      vi.mocked(prisma.medicine.create).mockResolvedValue({
        ...medicineCreationResponse,
        expirationDate: new Date(medicineCreationResponse.expirationDate)
      })

      const formData = populateFormData(medicineCreationResponse, ['id'])
      await createMedicineAction({}, formData)

      expect(prisma.medicine.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Object)
        })
      )
    })
  })

  describe('[createMedicineAction] - Update Mode', () => {
    test('updates medicine with valid data and calls prisma.medicine.update', async () => {
      vi.mocked(prisma.medicine.update).mockResolvedValue({
        ...medicineUpdateResponse,
        expirationDate: new Date(medicineUpdateResponse.expirationDate)
      })

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      const result = await createMedicineAction({}, formData, medicineUpdateResponse.id.toString())

      expect(result.message).toBe(MEDICINE_FORM_LABELS.UPDATE_SUCCESS)
      expect(result.errors).toBeUndefined()
      expect(prisma.medicine.update).toHaveBeenCalled()
    })

    test('converts string id to number for update query', async () => {
      vi.mocked(prisma.medicine.update).mockResolvedValue({
        ...medicineUpdateResponse,
        expirationDate: new Date(medicineUpdateResponse.expirationDate)
      })

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      await createMedicineAction({}, formData, '2')

      expect(prisma.medicine.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 2 },
          data: expect.any(Object)
        })
      )
    })

    test('updates medicine with null optional fields', async () => {
      vi.mocked(prisma.medicine.update).mockResolvedValue({
        ...medicineUpdateWithNullFields,
        expirationDate: null
      })

      const formData = populateFormData(medicineUpdateWithNullFields, ['id'])
      const result = await createMedicineAction(
        {},
        formData,
        medicineUpdateWithNullFields.id.toString()
      )

      expect(result.message).toBe(MEDICINE_FORM_LABELS.UPDATE_SUCCESS)
      expect(prisma.medicine.update).toHaveBeenCalled()
    })

    test('handles update with missing required fields returns error', async () => {
      const formData = populateFormData(missingRequiredFieldsData)
      const result = await createMedicineAction({}, formData, '1')

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
    })

    test('updates medicine with only name and presentation field', async () => {
      vi.mocked(prisma.medicine.update).mockResolvedValue({
        id: medicineUpdateOnlyName.id,
        name: medicineUpdateOnlyName.name,
        laboratory: null,
        presentation: +medicineUpdateOnlyName.presentation,
        expirationDate: null,
        usedFor: null,
        sideEffects: null,
        comments: null
      })

      const formData = populateFormData(medicineUpdateOnlyName, ['id'])
      const result = await createMedicineAction({}, formData, medicineUpdateOnlyName.id.toString())

      expect(result.message).toBe(MEDICINE_FORM_LABELS.UPDATE_SUCCESS)
      expect(prisma.medicine.update).toHaveBeenCalled()
    })

    test('does not call prisma.medicine.update when id is undefined', async () => {
      vi.mocked(prisma.medicine.create).mockResolvedValue({
        ...medicineUpdateResponse,
        expirationDate: new Date(medicineUpdateResponse.expirationDate)
      })

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      await createMedicineAction({}, formData) // No id parameter

      expect(prisma.medicine.update).not.toHaveBeenCalled()
      expect(prisma.medicine.create).toHaveBeenCalled()
    })

    test('calls prisma.medicine.update with correct data structure', async () => {
      vi.mocked(prisma.medicine.update).mockResolvedValue({
        ...medicineUpdateResponse,
        expirationDate: new Date(medicineUpdateResponse.expirationDate)
      })

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      await createMedicineAction({}, formData, '2')

      const callArgs = vi.mocked(prisma.medicine.update).mock.calls[0][0]
      expect(callArgs.where).toEqual({ id: 2 })
      expect(callArgs.data).toHaveProperty('name')
      expect(callArgs.data).toHaveProperty('presentation')
    })
  })

  describe('[createMedicineAction] - Error Handling', () => {
    test('handles database error on medicine creation', async () => {
      const dbError = new Error('Database connection failed')
      vi.mocked(prisma.medicine.create).mockRejectedValueOnce(dbError)

      const formData = populateFormData(medicineCreationResponse, ['id'])
      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe('Database connection failed')
      expect(result.errors).toBeUndefined()
    })

    test('handles database error on medicine update', async () => {
      const dbError = new Error('Record not found')
      vi.mocked(prisma.medicine.update).mockRejectedValueOnce(dbError)

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      const result = await createMedicineAction({}, formData, '999')

      expect(result.message).toBe('Record not found')
      expect(result.errors).toBeUndefined()
    })

    test('handles Prisma unique constraint error on create', async () => {
      const constraintError = new Error('Unique constraint failed on the fields: (`name`)')
      vi.mocked(prisma.medicine.create).mockRejectedValueOnce(constraintError)

      const formData = populateFormData(medicineCreationResponse, ['id'])
      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe('Unique constraint failed on the fields: (`name`)')
    })

    test('handles Prisma unique constraint error on update', async () => {
      const constraintError = new Error('Unique constraint failed on the fields: (`name`)')
      vi.mocked(prisma.medicine.update).mockRejectedValueOnce(constraintError)

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      const result = await createMedicineAction({}, formData, '1')

      expect(result.message).toBe('Unique constraint failed on the fields: (`name`)')
    })

    test('handles generic runtime error on create', async () => {
      const runtimeError = new Error('Invalid input data format')
      vi.mocked(prisma.medicine.create).mockRejectedValueOnce(runtimeError)

      const formData = populateFormData(medicineCreationResponse, ['id'])
      const result = await createMedicineAction({}, formData)

      expect(result.message).toBe('Invalid input data format')
    })

    test('handles generic runtime error on update', async () => {
      const runtimeError = new Error('Transaction timeout')
      vi.mocked(prisma.medicine.update).mockRejectedValueOnce(runtimeError)

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      const result = await createMedicineAction({}, formData, '2')

      expect(result.message).toBe('Transaction timeout')
    })
  })
})
