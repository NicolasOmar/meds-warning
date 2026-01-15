import { describe, test, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@prisma/index'
// ACTIONS
import { handlePresentationAction, deletePresentation, getPresentations } from '../presentation'
// SHARED
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { PRESENTATION_FORM_LABELS, PRESENTATION_FORM_ERRORS } from '@shared-constants/forms'
import { MEDICINE_PRESENTATION_TABLE_LABELS } from '@shared-constants/tables'

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

// MOCKS
import {
  presentationCreationResponse,
  presentationCreationResponse2,
  presentationCreationResponse3,
  presentationWithLongDescriptionResponse,
  presentationWithSpecialCharactersResponse,
  missingRequiredFieldsData,
  minimalFormData,
  duplicateDescriptionData,
  presentationWithLongDescription,
  presentationWithSpecialCharacters,
  presentationsListResponse,
  emptyPresentationsListResponse,
  mockMedicineForDelete,
  mockMedicineForDelete2
} from './presentation.mocks.json'

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
    medicinePresentation: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn()
    },
    medicine: {
      findMany: vi.fn(),
      updateMany: vi.fn()
    }
  }
}))

describe('Presentation Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[handlePresentationAction]', () => {
    test('creates presentation with valid data and calls prisma.medicinePresentation.create', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.create).mockResolvedValue(presentationCreationResponse)

      const formData = populateFormData(presentationCreationResponse, ['id'])
      const result = await handlePresentationAction({}, formData)

      expect(result.message).toBe(PRESENTATION_FORM_LABELS.CREATE_SUCCESS)
      expect(result.success).toBe(true)
      expect(result.errors).toBeUndefined()
      expect(prisma.medicinePresentation.create).toHaveBeenCalled()
    })

    test('returns error with missing required fields (empty description)', async () => {
      const formData = populateFormData(missingRequiredFieldsData)
      const result = await handlePresentationAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
      expect(result.errors?.description).toBeDefined()
      expect(prisma.medicinePresentation.create).not.toHaveBeenCalled()
    })

    test('returns error when presentation with same description already exists', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(
        presentationCreationResponse as unknown as typeof presentationCreationResponse
      )

      const formData = populateFormData(duplicateDescriptionData)
      const result = await handlePresentationAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(PRESENTATION_FORM_ERRORS.ALREADY_CREATED)
      expect(result.errors).toBeUndefined()
      expect(prisma.medicinePresentation.create).not.toHaveBeenCalled()
      expect(prisma.medicinePresentation.findFirst).toHaveBeenCalledWith({
        where: { description: 'Tablet' }
      })
    })

    test('creates presentation with minimal valid data', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.create).mockResolvedValue(presentationCreationResponse)

      const formData = populateFormData(minimalFormData, ['id'])
      const result = await handlePresentationAction({}, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe(PRESENTATION_FORM_LABELS.CREATE_SUCCESS)
      expect(prisma.medicinePresentation.create).toHaveBeenCalled()
    })

    test('creates presentation with long description', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.create).mockResolvedValue(
        presentationWithLongDescriptionResponse
      )

      const formData = populateFormData(presentationWithLongDescription)
      const result = await handlePresentationAction({}, formData)

      expect(result.success).toBe(true)
      expect(prisma.medicinePresentation.create).toHaveBeenCalled()
    })

    test('creates presentation with special characters in description', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.create).mockResolvedValue(
        presentationWithSpecialCharactersResponse
      )

      const formData = populateFormData(presentationWithSpecialCharacters)
      const result = await handlePresentationAction({}, formData)

      expect(result.success).toBe(true)
      expect(prisma.medicinePresentation.create).toHaveBeenCalled()
    })

    test('handles database error gracefully', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.create).mockRejectedValue(
        new Error('Database connection failed')
      )

      const formData = populateFormData(presentationCreationResponse, ['id'])
      const result = await handlePresentationAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Database connection failed')
      expect(result.errors).toBeUndefined()
    })

    test('handles database error with empty message gracefully', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.create).mockRejectedValue(new Error(''))

      const formData = populateFormData(presentationCreationResponse, ['id'])
      const result = await handlePresentationAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
    })

    test('handles non-Error exceptions', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.create).mockRejectedValue('Unknown error')

      const formData = populateFormData(presentationCreationResponse, ['id'])
      const result = await handlePresentationAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
    })

    test('validates required fields are present', async () => {
      const emptyFormData = new FormData()
      const result = await handlePresentationAction({}, emptyFormData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors?.description).toBeDefined()
    })

    test('multiple presentations can be created sequentially', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.create)
        .mockResolvedValueOnce(presentationCreationResponse)
        .mockResolvedValueOnce(presentationCreationResponse2)
        .mockResolvedValueOnce(presentationCreationResponse3)

      const formData1 = populateFormData(presentationCreationResponse, ['id'])
      const result1 = await handlePresentationAction({}, formData1)

      const formData2 = populateFormData(presentationCreationResponse2, ['id'])
      const result2 = await handlePresentationAction({}, formData2)

      const formData3 = populateFormData(presentationCreationResponse3, ['id'])
      const result3 = await handlePresentationAction({}, formData3)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result3.success).toBe(true)
      expect(prisma.medicinePresentation.create).toHaveBeenCalledTimes(3)
    })
  })

  describe('[handlePresentationAction] - Update Mode', () => {
    test('updates presentation with valid data and calls prisma.medicinePresentation.update', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.update).mockResolvedValue(presentationCreationResponse)

      const formData = populateFormData(presentationCreationResponse, ['id'])
      const result = await handlePresentationAction({}, formData, '1')

      expect(result.message).toBe(PRESENTATION_FORM_LABELS.UPDATE_SUCCESS)
      expect(result.success).toBe(true)
      expect(result.errors).toBeUndefined()
      expect(prisma.medicinePresentation.update).toHaveBeenCalled()
    })

    test('converts string id to number for update query', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.update).mockResolvedValue(presentationCreationResponse)

      const formData = populateFormData(presentationCreationResponse, ['id'])
      await handlePresentationAction({}, formData, '2')

      expect(prisma.medicinePresentation.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: expect.any(Object)
      })
    })

    test('returns error when updating with duplicate description', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(
        presentationCreationResponse as unknown as typeof presentationCreationResponse
      )

      const formData = populateFormData(duplicateDescriptionData)
      const result = await handlePresentationAction({}, formData, '1')

      expect(result.success).toBe(false)
      expect(result.message).toBe(PRESENTATION_FORM_ERRORS.ALREADY_CREATED)
      expect(prisma.medicinePresentation.update).not.toHaveBeenCalled()
    })

    test('handles database error on update', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.update).mockRejectedValueOnce(
        new Error('Database error')
      )

      const formData = populateFormData(presentationCreationResponse, ['id'])
      const result = await handlePresentationAction({}, formData, '1')

      expect(result.success).toBe(false)
      expect(result.message).toContain('Database error')
    })

    test('does not call prisma.medicinePresentation.update when id is undefined', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.create).mockResolvedValue(presentationCreationResponse)

      const formData = populateFormData(presentationCreationResponse, ['id'])
      await handlePresentationAction({}, formData)

      expect(prisma.medicinePresentation.update).not.toHaveBeenCalled()
      expect(prisma.medicinePresentation.create).toHaveBeenCalled()
    })

    test('updates presentation with long description', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.update).mockResolvedValue(
        presentationWithLongDescriptionResponse
      )

      const formData = populateFormData(presentationWithLongDescription)
      const result = await handlePresentationAction({}, formData, '4')

      expect(result.success).toBe(true)
      expect(result.message).toBe(PRESENTATION_FORM_LABELS.UPDATE_SUCCESS)
      expect(prisma.medicinePresentation.update).toHaveBeenCalled()
    })
  })

  describe('[deletePresentation]', () => {
    test('deletes presentation with valid id', async () => {
      vi.mocked(prisma.medicine.findMany).mockResolvedValue([mockMedicineForDelete])
      vi.mocked(prisma.medicine.updateMany).mockResolvedValue({ count: 0 })
      vi.mocked(prisma.medicinePresentation.delete).mockResolvedValueOnce(
        presentationCreationResponse
      )

      const result = await deletePresentation(1)

      expect(result.message).toBe(MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_SUCCESS)
      expect(result.success).toBe(true)
      expect(prisma.medicinePresentation.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      })
    })

    test('calls prisma.medicine.findMany before deletion', async () => {
      vi.mocked(prisma.medicine.findMany).mockResolvedValue([mockMedicineForDelete])
      vi.mocked(prisma.medicine.updateMany).mockResolvedValue({ count: 0 })
      vi.mocked(prisma.medicinePresentation.delete).mockResolvedValueOnce(
        presentationCreationResponse
      )

      await deletePresentation(1)

      expect(prisma.medicine.findMany).toHaveBeenCalled()
    })

    test('updates medicines referencing the deleted presentation', async () => {
      vi.mocked(prisma.medicine.findMany).mockResolvedValue([mockMedicineForDelete2])
      vi.mocked(prisma.medicine.updateMany).mockResolvedValue({ count: 1 })
      vi.mocked(prisma.medicinePresentation.delete).mockResolvedValueOnce(
        presentationCreationResponse
      )

      const result = await deletePresentation(1)

      expect(result.success).toBe(true)
      expect(prisma.medicine.updateMany).toHaveBeenCalled()
    })

    test('handles database error on delete', async () => {
      vi.mocked(prisma.medicine.findMany).mockResolvedValue([mockMedicineForDelete])
      vi.mocked(prisma.medicine.updateMany).mockResolvedValue({ count: 0 })
      vi.mocked(prisma.medicinePresentation.delete).mockRejectedValueOnce(
        new Error('Record not found')
      )

      const result = await deletePresentation(999)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Record not found')
    })

    test('handles error with no message on delete', async () => {
      vi.mocked(prisma.medicine.findMany).mockResolvedValue([mockMedicineForDelete])
      vi.mocked(prisma.medicine.updateMany).mockResolvedValue({ count: 0 })
      vi.mocked(prisma.medicinePresentation.delete).mockRejectedValueOnce(new Error())

      const result = await deletePresentation(1)

      expect(result.success).toBe(false)
      expect(result.message).toBe(MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_ERROR)
    })

    test('handles non-Error exceptions on delete', async () => {
      vi.mocked(prisma.medicine.findMany).mockResolvedValue([mockMedicineForDelete])
      vi.mocked(prisma.medicine.updateMany).mockResolvedValue({ count: 0 })
      vi.mocked(prisma.medicinePresentation.delete).mockRejectedValueOnce('Unknown error')

      const result = await deletePresentation(1)

      expect(result.success).toBe(false)
      expect(result.message).toBe(MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_ERROR)
    })

    test('returns success message after successful deletion', async () => {
      vi.mocked(prisma.medicine.findMany).mockResolvedValue([mockMedicineForDelete])
      vi.mocked(prisma.medicine.updateMany).mockResolvedValue({ count: 0 })
      vi.mocked(prisma.medicinePresentation.delete).mockResolvedValueOnce(
        presentationCreationResponse
      )

      const result = await deletePresentation(1)

      expect(result.message).toBe(MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_SUCCESS)
      expect(result.success).toBe(true)
    })
  })

  describe('[getPresentations]', () => {
    test('returns list of presentations', async () => {
      vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(
        presentationsListResponse
      )

      const result = await getPresentations()

      expect(result).toHaveLength(3)
      expect(prisma.medicinePresentation.findMany).toHaveBeenCalled()
    })

    test('returns empty array when no presentations exist', async () => {
      vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(
        emptyPresentationsListResponse
      )

      const result = await getPresentations()

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    test('returns presentations with correct structure', async () => {
      vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(
        presentationsListResponse
      )

      const result = await getPresentations()

      result.forEach(presentation => {
        expect(presentation).toHaveProperty('id')
        expect(presentation).toHaveProperty('description')
      })
    })

    test('handles database error on getPresentations', async () => {
      vi.mocked(prisma.medicinePresentation.findMany).mockRejectedValueOnce(
        new Error('Database connection failed')
      )

      expect(getPresentations()).rejects.toThrow('Database connection failed')
    })

    test('returns multiple presentations in correct order', async () => {
      vi.mocked(prisma.medicinePresentation.findMany).mockResolvedValueOnce(
        presentationsListResponse
      )

      const result = await getPresentations()

      presentationsListResponse.forEach((presentation, index) => {
        expect(result[index].id).toBe(presentation.id)
        expect(result[index].description).toBe(presentation.description)
      })
    })
  })
})
