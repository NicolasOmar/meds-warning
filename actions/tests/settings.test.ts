import { describe, test, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@prisma/index'
// ACTIONS
import { updateSettings } from '../settings'
// SHARED
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { SETTINGS_FORM_LABELS, SETTINGS_FORM_ERRORS } from '@shared-constants/forms'

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

// MOCKS
import {
  validSettingsData,
  validSettingsData2,
  validSettingsData3,
  minDaysSettingsData,
  maxDaysSettingsData,
  invalidMinDaysSettingsData,
  invalidMaxDaysSettingsData,
  invalidNegativeDaysSettingsData,
  invalidStringDaysSettingsData,
  emptyDaysSettingsData
} from './settings.mocks.json'

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
    settings: {
      updateMany: vi.fn()
    }
  }
}))

describe('Settings Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[updateSettings]', () => {
    test('updates settings with valid data and calls prisma.settings.updateMany', async () => {
      vi.mocked(prisma.settings.updateMany).mockResolvedValue({ count: 1 })

      const formData = populateFormData(validSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe(SETTINGS_FORM_LABELS.UPDATE_SUCCESS)
      expect(result.success).toBe(true)
      expect(result.errors).toBeUndefined()
      expect(prisma.settings.updateMany).toHaveBeenCalled()
    })

    test('calls prisma.settings.updateMany with correct parameters', async () => {
      vi.mocked(prisma.settings.updateMany).mockResolvedValue({ count: 1 })

      const formData = populateFormData(validSettingsData)
      await updateSettings({}, formData)

      expect(prisma.settings.updateMany).toHaveBeenCalledWith({
        data: {
          daysToNotify: validSettingsData.daysToNotify
        }
      })
    })

    test('updates settings with different valid daysToNotify value', async () => {
      vi.mocked(prisma.settings.updateMany).mockResolvedValue({ count: 1 })

      const formData = populateFormData(validSettingsData2)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe(SETTINGS_FORM_LABELS.UPDATE_SUCCESS)
      expect(result.success).toBe(true)
      expect(prisma.settings.updateMany).toHaveBeenCalledWith({
        data: {
          daysToNotify: validSettingsData2.daysToNotify
        }
      })
    })

    test('updates settings with another valid daysToNotify value', async () => {
      vi.mocked(prisma.settings.updateMany).mockResolvedValue({ count: 1 })

      const formData = populateFormData(validSettingsData3)
      const result = await updateSettings({}, formData)

      expect(result.success).toBe(true)
      expect(prisma.settings.updateMany).toHaveBeenCalledWith({
        data: {
          daysToNotify: validSettingsData3.daysToNotify
        }
      })
    })

    test('updates settings with minimum valid days value (1)', async () => {
      vi.mocked(prisma.settings.updateMany).mockResolvedValue({ count: 1 })

      const formData = populateFormData(minDaysSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe(SETTINGS_FORM_LABELS.UPDATE_SUCCESS)
      expect(result.success).toBe(true)
      expect(prisma.settings.updateMany).toHaveBeenCalledWith({
        data: {
          daysToNotify: minDaysSettingsData.daysToNotify
        }
      })
    })

    test('updates settings with maximum valid days value (365)', async () => {
      vi.mocked(prisma.settings.updateMany).mockResolvedValue({ count: 1 })

      const formData = populateFormData(maxDaysSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe(SETTINGS_FORM_LABELS.UPDATE_SUCCESS)
      expect(result.success).toBe(true)
      expect(prisma.settings.updateMany).toHaveBeenCalledWith({
        data: {
          daysToNotify: maxDaysSettingsData.daysToNotify
        }
      })
    })

    test('returns error when daysToNotify is below minimum (0)', async () => {
      const formData = populateFormData(invalidMinDaysSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
      expect(result.errors?.daysToNotify).toBeDefined()
      expect(prisma.settings.updateMany).not.toHaveBeenCalled()
    })

    test('returns error when daysToNotify exceeds maximum (366)', async () => {
      const formData = populateFormData(invalidMaxDaysSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
      expect(result.errors?.daysToNotify).toBeDefined()
      expect(prisma.settings.updateMany).not.toHaveBeenCalled()
    })

    test('returns error when daysToNotify is negative', async () => {
      const formData = populateFormData(invalidNegativeDaysSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
      expect(result.errors?.daysToNotify).toBeDefined()
      expect(prisma.settings.updateMany).not.toHaveBeenCalled()
    })

    test('converts string number to number type', async () => {
      vi.mocked(prisma.settings.updateMany).mockResolvedValue({ count: 1 })

      const formData = new FormData()
      formData.append('daysToNotify', '45')

      const result = await updateSettings({}, formData)

      expect(result.success).toBe(true)
      expect(prisma.settings.updateMany).toHaveBeenCalledWith({
        data: {
          daysToNotify: 45
        }
      })
    })

    test('returns error when daysToNotify is not a valid number string', async () => {
      const formData = populateFormData(invalidStringDaysSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
      expect(result.errors?.daysToNotify).toBeDefined()
      expect(prisma.settings.updateMany).not.toHaveBeenCalled()
    })

    test('returns error when daysToNotify is empty string', async () => {
      const formData = populateFormData(emptyDaysSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
      expect(result.errors?.daysToNotify).toBeDefined()
      expect(prisma.settings.updateMany).not.toHaveBeenCalled()
    })

    test('returns success state with correct message', async () => {
      vi.mocked(prisma.settings.updateMany).mockResolvedValue({ count: 1 })

      const formData = populateFormData(validSettingsData)
      const result = await updateSettings({}, formData)

      expect(result).toEqual({
        message: SETTINGS_FORM_LABELS.UPDATE_SUCCESS,
        success: true
      })
    })
  })

  describe('[updateSettings] - Error Handling', () => {
    test('handles database error on settings update', async () => {
      const dbError = new Error('Database connection failed')
      vi.mocked(prisma.settings.updateMany).mockRejectedValueOnce(dbError)

      const formData = populateFormData(validSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe('Database connection failed')
      expect(result.success).toBe(false)
      expect(result.errors).toBeUndefined()
    })

    test('handles Prisma constraint error', async () => {
      const constraintError = new Error('Constraint validation failed')
      vi.mocked(prisma.settings.updateMany).mockRejectedValueOnce(constraintError)

      const formData = populateFormData(validSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe('Constraint validation failed')
      expect(result.success).toBe(false)
    })

    test('handles generic runtime error', async () => {
      const runtimeError = new Error('Transaction timeout')
      vi.mocked(prisma.settings.updateMany).mockRejectedValueOnce(runtimeError)

      const formData = populateFormData(validSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe('Transaction timeout')
      expect(result.success).toBe(false)
    })

    test('handles error with no message', async () => {
      const error = new Error()
      vi.mocked(prisma.settings.updateMany).mockRejectedValueOnce(error)

      const formData = populateFormData(validSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
      expect(result.success).toBe(false)
    })

    test('handles non-Error exceptions', async () => {
      vi.mocked(prisma.settings.updateMany).mockRejectedValueOnce('Unexpected error')

      const formData = populateFormData(validSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
      expect(result.success).toBe(false)
    })

    test('handles database timeout error', async () => {
      const timeoutError = new Error('Query timeout exceeded')
      vi.mocked(prisma.settings.updateMany).mockRejectedValueOnce(timeoutError)

      const formData = populateFormData(validSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe('Query timeout exceeded')
      expect(result.success).toBe(false)
    })

    test('handles network connection error', async () => {
      const networkError = new Error('Network connection lost')
      vi.mocked(prisma.settings.updateMany).mockRejectedValueOnce(networkError)

      const formData = populateFormData(validSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe('Network connection lost')
      expect(result.success).toBe(false)
    })

    test('handles empty error message with fallback', async () => {
      const emptyError = new Error('')
      vi.mocked(prisma.settings.updateMany).mockRejectedValueOnce(emptyError)

      const formData = populateFormData(validSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
      expect(result.success).toBe(false)
    })
  })

  describe('[updateSettings] - Edge Cases', () => {
    test('handles FormData with extra fields gracefully', async () => {
      vi.mocked(prisma.settings.updateMany).mockResolvedValue({ count: 1 })

      const formData = new FormData()
      formData.append('daysToNotify', '30')
      formData.append('extraField', 'should be ignored')
      formData.append('anotherField', 'also ignored')

      const result = await updateSettings({}, formData)

      expect(result.success).toBe(true)
      expect(prisma.settings.updateMany).toHaveBeenCalledWith({
        data: {
          daysToNotify: 30
        }
      })
    })

    test('returns error when daysToNotify is a decimal number', async () => {
      const formData = new FormData()
      formData.append('daysToNotify', '30.7')

      const result = await updateSettings({}, formData)

      // Zod's .int() should reject decimal numbers
      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
      expect(prisma.settings.updateMany).not.toHaveBeenCalled()
    })

    test('handles missing daysToNotify field', async () => {
      const formData = new FormData()

      const result = await updateSettings({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors).toBeDefined()
      expect(prisma.settings.updateMany).not.toHaveBeenCalled()
    })

    test('validates field errors include correct error message for min value', async () => {
      const formData = populateFormData(invalidMinDaysSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.errors?.daysToNotify).toBeDefined()
      expect(result.errors?.daysToNotify).toContain(SETTINGS_FORM_ERRORS.DAYS_TO_NOTIFY_MIN)
    })

    test('validates field errors include correct error message for max value', async () => {
      const formData = populateFormData(invalidMaxDaysSettingsData)
      const result = await updateSettings({}, formData)

      expect(result.errors?.daysToNotify).toBeDefined()
      expect(result.errors?.daysToNotify).toContain(SETTINGS_FORM_ERRORS.DAYS_TO_NOTIFY_MAX)
    })
  })
})
