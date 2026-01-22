import { describe, test, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@prisma/index'
// ACTIONS
import { handleMedicineAction, deleteMedicine, getMedicines } from '../medicine'
// SHARED
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { MEDICINE_TABLE_LABELS } from '@shared-constants/tables'

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
  medicineUpdateOnlyName,
  deleteableMedicineId,
  medicinesListResponse,
  emptyMedicinesListResponse
} from './medicine.mocks.json'
import { MEDICINE_FORM_LABELS } from '@shared-constants/forms'

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
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn()
    }
  }
}))

describe('Medicine Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[handleMedicineAction]', () => {
    test('creates medicine with valid data and calls prisma.medicine.create', async () => {
      vi.mocked(prisma.medicine.create).mockResolvedValue({
        ...medicineCreationResponse,
        expirationDate: new Date(medicineCreationResponse.expirationDate)
      })

      const formData = populateFormData(medicineCreationResponse, ['id'])
      const result = await handleMedicineAction({}, formData)

      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
      expect(result.errors).toBeUndefined()
      expect(prisma.medicine.create).toHaveBeenCalled()
    })

    test('returns error with missing required fields', async () => {
      const formData = populateFormData(missingRequiredFieldsData)
      const result = await handleMedicineAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
    })

    test('parses empty form values to null', async () => {
      const formData = populateFormData(emptyNullFormValues)
      const result = await handleMedicineAction({}, formData)

      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('converts presentation string to number', async () => {
      const formData = populateFormData(presentationStringToNumber)
      const result = await handleMedicineAction({}, formData)

      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('converts date string to Date object', async () => {
      const formData = populateFormData(convertsDateStringToDateObj)
      const result = await handleMedicineAction({}, formData)

      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('returns error for name exceeding max length', async () => {
      const formData = new FormData()
      const longName = 'A'.repeat(51) // Exceeds max length of 50
      formData.append('name', longName)

      const result = await handleMedicineAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
    })

    test('handles medicine with only name and presentation field', async () => {
      const formData = populateFormData(minimalFormData)
      const result = await handleMedicineAction({}, formData)

      expect(result.message).toBe(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
    })

    test('calls prisma.medicine.create without id parameter', async () => {
      vi.mocked(prisma.medicine.create).mockResolvedValue({
        ...medicineCreationResponse,
        expirationDate: new Date(medicineCreationResponse.expirationDate)
      })

      const formData = populateFormData(medicineCreationResponse, ['id'])
      await handleMedicineAction({}, formData)

      expect(prisma.medicine.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Object)
        })
      )
    })
  })

  describe('[handleMedicineAction] - Update Mode', () => {
    test('updates medicine with valid data and calls prisma.medicine.update', async () => {
      vi.mocked(prisma.medicine.update).mockResolvedValue({
        ...medicineUpdateResponse,
        expirationDate: new Date(medicineUpdateResponse.expirationDate)
      })

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      const result = await handleMedicineAction({}, formData, medicineUpdateResponse.id.toString())

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
      await handleMedicineAction({}, formData, '2')

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
      const result = await handleMedicineAction(
        {},
        formData,
        medicineUpdateWithNullFields.id.toString()
      )

      expect(result.message).toBe(MEDICINE_FORM_LABELS.UPDATE_SUCCESS)
      expect(prisma.medicine.update).toHaveBeenCalled()
    })

    test('handles update with missing required fields returns error', async () => {
      const formData = populateFormData(missingRequiredFieldsData)
      const result = await handleMedicineAction({}, formData, '1')

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
      const result = await handleMedicineAction({}, formData, medicineUpdateOnlyName.id.toString())

      expect(result.message).toBe(MEDICINE_FORM_LABELS.UPDATE_SUCCESS)
      expect(prisma.medicine.update).toHaveBeenCalled()
    })

    test('does not call prisma.medicine.update when id is undefined', async () => {
      vi.mocked(prisma.medicine.create).mockResolvedValue({
        ...medicineUpdateResponse,
        expirationDate: new Date(medicineUpdateResponse.expirationDate)
      })

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      await handleMedicineAction({}, formData) // No id parameter

      expect(prisma.medicine.update).not.toHaveBeenCalled()
      expect(prisma.medicine.create).toHaveBeenCalled()
    })

    test('calls prisma.medicine.update with correct data structure', async () => {
      vi.mocked(prisma.medicine.update).mockResolvedValue({
        ...medicineUpdateResponse,
        expirationDate: new Date(medicineUpdateResponse.expirationDate)
      })

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      await handleMedicineAction({}, formData, '2')

      const callArgs = vi.mocked(prisma.medicine.update).mock.calls[0][0]
      expect(callArgs.where).toEqual({ id: 2 })
      expect(callArgs.data).toHaveProperty('name')
      expect(callArgs.data).toHaveProperty('presentation')
    })
  })

  describe('[handleMedicineAction] - Error Handling', () => {
    test('handles database error on medicine creation', async () => {
      const dbError = new Error('Database connection failed')
      vi.mocked(prisma.medicine.create).mockRejectedValueOnce(dbError)

      const formData = populateFormData(medicineCreationResponse, ['id'])
      const result = await handleMedicineAction({}, formData)

      expect(result.message).toBe('Database connection failed')
      expect(result.errors).toBeUndefined()
    })

    test('handles database error on medicine update', async () => {
      const dbError = new Error('Record not found')
      vi.mocked(prisma.medicine.update).mockRejectedValueOnce(dbError)

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      const result = await handleMedicineAction({}, formData, '999')

      expect(result.message).toBe('Record not found')
      expect(result.errors).toBeUndefined()
    })

    test('handles Prisma unique constraint error on create', async () => {
      const constraintError = new Error('Unique constraint failed on the fields: (`name`)')
      vi.mocked(prisma.medicine.create).mockRejectedValueOnce(constraintError)

      const formData = populateFormData(medicineCreationResponse, ['id'])
      const result = await handleMedicineAction({}, formData)

      expect(result.message).toBe('Unique constraint failed on the fields: (`name`)')
    })

    test('handles Prisma unique constraint error on update', async () => {
      const constraintError = new Error('Unique constraint failed on the fields: (`name`)')
      vi.mocked(prisma.medicine.update).mockRejectedValueOnce(constraintError)

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      const result = await handleMedicineAction({}, formData, '1')

      expect(result.message).toBe('Unique constraint failed on the fields: (`name`)')
    })

    test('handles generic runtime error on create', async () => {
      const runtimeError = new Error('Invalid input data format')
      vi.mocked(prisma.medicine.create).mockRejectedValueOnce(runtimeError)

      const formData = populateFormData(medicineCreationResponse, ['id'])
      const result = await handleMedicineAction({}, formData)

      expect(result.message).toBe('Invalid input data format')
    })

    test('handles generic runtime error on update', async () => {
      const runtimeError = new Error('Transaction timeout')
      vi.mocked(prisma.medicine.update).mockRejectedValueOnce(runtimeError)

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      const result = await handleMedicineAction({}, formData, '2')

      expect(result.message).toBe('Transaction timeout')
    })

    test('handles error with no message on update', async () => {
      const runtimeError = new Error()
      vi.mocked(prisma.medicine.update).mockRejectedValueOnce(runtimeError)

      const formData = populateFormData(medicineUpdateResponse, ['id'])
      const result = await handleMedicineAction({}, formData, '2')

      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
    })
  })

  describe('[deleteMedicine]', () => {
    test('deletes medicine with valid id', async () => {
      vi.mocked(prisma.medicine.delete).mockResolvedValueOnce({
        ...medicineCreationResponse,
        expirationDate: new Date(medicineCreationResponse.expirationDate)
      })

      const result = await deleteMedicine(deleteableMedicineId)

      expect(result.message).toBe(MEDICINE_TABLE_LABELS.DELETE_SUCCESS)
      expect(prisma.medicine.delete).toHaveBeenCalledWith({
        where: { id: deleteableMedicineId }
      })
    })

    test('calls prisma.medicine.delete with correct id parameter', async () => {
      vi.mocked(prisma.medicine.delete).mockResolvedValueOnce({
        ...medicineCreationResponse,
        expirationDate: new Date(medicineCreationResponse.expirationDate)
      })

      await deleteMedicine(deleteableMedicineId)

      expect(prisma.medicine.delete).toHaveBeenCalledWith({
        where: { id: deleteableMedicineId }
      })
    })

    test('handles database error on delete', async () => {
      const dbError = new Error('Record not found')
      vi.mocked(prisma.medicine.delete).mockRejectedValueOnce(dbError)

      const result = await deleteMedicine(999)

      expect(result.message).toBe('Record not found')
    })

    test('handles delete with non-existent medicine id', async () => {
      const dbError = new Error('No Medicine found')
      vi.mocked(prisma.medicine.delete).mockRejectedValueOnce(dbError)

      const result = await deleteMedicine(9999)

      expect(result.message).toBe('No Medicine found')
    })

    test('handles generic error on delete', async () => {
      const error = new Error('Database connection timeout')
      vi.mocked(prisma.medicine.delete).mockRejectedValueOnce(error)

      const result = await deleteMedicine(deleteableMedicineId)

      expect(result.message).toBe('Database connection timeout')
    })

    test('handles error with no message on delete', async () => {
      const error = new Error()
      vi.mocked(prisma.medicine.delete).mockRejectedValueOnce(error)

      const result = await deleteMedicine(deleteableMedicineId)

      expect(result.message).toBe(MEDICINE_TABLE_LABELS.DELETE_ERROR)
    })
  })

  describe('[getMedicines]', () => {
    test('returns list of medicines with presentations', async () => {
      const medicinesWithDates = medicinesListResponse.map(med => ({
        ...med,
        expirationDate: new Date(med.expirationDate)
      }))
      vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(medicinesWithDates)

      const result = await getMedicines()

      expect(result).toHaveLength(2)
      expect(prisma.medicine.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: '',
            mode: 'insensitive'
          }
        },
        include: {
          medicinePresentation: true
        }
      })
    })

    test('calls prisma.medicine.findMany with correct parameters', async () => {
      const medicinesWithDates = medicinesListResponse.map(med => ({
        ...med,
        expirationDate: new Date(med.expirationDate)
      }))
      vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(medicinesWithDates)

      await getMedicines()

      expect(prisma.medicine.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: '',
            mode: 'insensitive'
          }
        },
        include: {
          medicinePresentation: true
        }
      })
    })

    test('returns empty array when no medicines exist', async () => {
      vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(emptyMedicinesListResponse)

      const result = await getMedicines()

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    test('returns medicines with all fields populated', async () => {
      const medicinesWithDates = medicinesListResponse.map(med => ({
        ...med,
        expirationDate: new Date(med.expirationDate)
      }))
      vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(medicinesWithDates)

      const result = await getMedicines()

      const firstMedicine = result[0]
      expect(firstMedicine).toHaveProperty('id')
      expect(firstMedicine).toHaveProperty('name')
      expect(firstMedicine).toHaveProperty('laboratory')
      expect(firstMedicine).toHaveProperty('presentation')
      expect(firstMedicine).toHaveProperty('expirationDate')
      expect(firstMedicine).toHaveProperty('usedFor')
      expect(firstMedicine).toHaveProperty('sideEffects')
      expect(firstMedicine).toHaveProperty('comments')
      expect(firstMedicine).toHaveProperty('medicinePresentation')
    })

    test('returns medicines with included medicinePresentation data', async () => {
      const medicinesWithDates = medicinesListResponse.map(med => ({
        ...med,
        expirationDate: new Date(med.expirationDate)
      }))
      vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(medicinesWithDates)

      const result = await getMedicines()

      result.forEach(medicine => {
        expect(medicine.medicinePresentation).toBeDefined()
        expect(medicine.medicinePresentation).toHaveProperty('id')
        expect(medicine.medicinePresentation).toHaveProperty('description')
      })
    })

    test('handles database error on getMedicines', async () => {
      const dbError = new Error('Database connection failed')
      vi.mocked(prisma.medicine.findMany).mockRejectedValueOnce(dbError)

      await expect(getMedicines()).rejects.toThrow('Database connection failed')
    })

    test('handles timeout error on getMedicines', async () => {
      const timeoutError = new Error('Query timeout')
      vi.mocked(prisma.medicine.findMany).mockRejectedValueOnce(timeoutError)

      await expect(getMedicines()).rejects.toThrow('Query timeout')
    })

    test('returns multiple medicines in correct order', async () => {
      const medicinesWithDates = medicinesListResponse.map(med => ({
        ...med,
        expirationDate: new Date(med.expirationDate)
      }))
      vi.mocked(prisma.medicine.findMany).mockResolvedValueOnce(medicinesWithDates)

      const result = await getMedicines()

      expect(result[0].name).toBe('Aspirin')
      expect(result[1].name).toBe('Ibuprofen')
    })
  })
})
