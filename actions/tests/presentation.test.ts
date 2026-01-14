import { describe, test, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@prisma/index'
// ACTIONS
import { handlePresentationAction } from '../presentation'
// SHARED
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { PRESENTATION_FORM_LABELS, PRESENTATION_FORM_ERRORS } from '@shared-constants/forms'

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

// MOCKS
import {
  presentationCreationResponse,
  presentationCreationResponse2,
  presentationCreationResponse3,
  missingRequiredFieldsData,
  minimalFormData,
  duplicateDescriptionData,
  presentationWithLongDescription,
  presentationWithSpecialCharacters
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
      findFirst: vi.fn()
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
      vi.mocked(prisma.medicinePresentation.create).mockResolvedValue({
        id: 4,
        description: 'Extended Release Tablet with Enteric Coating'
      })

      const formData = populateFormData(presentationWithLongDescription)
      const result = await handlePresentationAction({}, formData)

      expect(result.success).toBe(true)
      expect(prisma.medicinePresentation.create).toHaveBeenCalled()
    })

    test('creates presentation with special characters in description', async () => {
      vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.medicinePresentation.create).mockResolvedValue({
        id: 5,
        description: 'Tablet (500mg)'
      })

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
})
