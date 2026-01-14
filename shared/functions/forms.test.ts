// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { redirect } from 'next/navigation'
// COMPONENTS
import { toast } from 'sonner'
// SHARED
import { handleMedicineFormState, handlePresentationFormState } from './forms'
import { MEDICINE_FORM_LABELS, PRESENTATION_FORM_LABELS } from '@shared-constants/forms'
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { ROUTES } from '@shared-constants/routes'

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

describe('[Form Utilities]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[handleMedicineFormState]', () => {
    test('does nothing when state is undefined', () => {
      handleMedicineFormState(undefined)

      expect(vi.mocked(toast.success)).not.toHaveBeenCalled()
      expect(vi.mocked(toast.error)).not.toHaveBeenCalled()
      expect(vi.mocked(redirect)).not.toHaveBeenCalled()
    })

    test('does nothing when state message is empty', () => {
      handleMedicineFormState({})

      expect(vi.mocked(toast.success)).not.toHaveBeenCalled()
      expect(vi.mocked(toast.error)).not.toHaveBeenCalled()
      expect(vi.mocked(redirect)).not.toHaveBeenCalled()
    })

    test('calls success toast when state.success is true', () => {
      handleMedicineFormState({
        message: MEDICINE_FORM_LABELS.UPDATE_SUCCESS,
        success: true
      })

      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(MEDICINE_FORM_LABELS.UPDATE_SUCCESS)
    })

    test('calls error toast when state.success is false', () => {
      handleMedicineFormState({
        message: COMMON_FORM_ERRORS.SUBMISSION_ERROR,
        success: false
      })

      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
    })

    test('calls redirect to medicine list on success', () => {
      handleMedicineFormState({
        message: MEDICINE_FORM_LABELS.UPDATE_SUCCESS,
        success: true
      })

      expect(vi.mocked(redirect)).toHaveBeenCalledWith(ROUTES.MEDICINE_LIST)
    })

    test('does not redirect on error', () => {
      handleMedicineFormState({
        message: COMMON_FORM_ERRORS.SUBMISSION_ERROR,
        success: false
      })

      expect(vi.mocked(redirect)).not.toHaveBeenCalled()
    })

    test('handles message and success fields correctly', () => {
      const state = {
        message: MEDICINE_FORM_LABELS.CREATE_SUCCESS,
        success: true,
        errors: undefined
      }

      handleMedicineFormState(state)

      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(MEDICINE_FORM_LABELS.CREATE_SUCCESS)
      expect(vi.mocked(redirect)).toHaveBeenCalledWith(ROUTES.MEDICINE_LIST)
    })
  })

  describe('[handlePresentationFormState]', () => {
    test('does nothing when state is undefined', () => {
      handlePresentationFormState(undefined)

      expect(vi.mocked(toast.success)).not.toHaveBeenCalled()
      expect(vi.mocked(toast.error)).not.toHaveBeenCalled()
      expect(vi.mocked(redirect)).not.toHaveBeenCalled()
    })

    test('does nothing when state message is empty', () => {
      handlePresentationFormState({})

      expect(vi.mocked(toast.success)).not.toHaveBeenCalled()
      expect(vi.mocked(toast.error)).not.toHaveBeenCalled()
      expect(vi.mocked(redirect)).not.toHaveBeenCalled()
    })

    test('calls success toast when state.success is true', () => {
      handlePresentationFormState({
        message: PRESENTATION_FORM_LABELS.CREATE_SUCCESS,
        success: true
      })

      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(PRESENTATION_FORM_LABELS.CREATE_SUCCESS)
    })

    test('calls error toast when state.success is false', () => {
      handlePresentationFormState({
        message: COMMON_FORM_ERRORS.SUBMISSION_ERROR,
        success: false
      })

      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
    })

    test('calls redirect to presentation list on success', () => {
      handlePresentationFormState({
        message: PRESENTATION_FORM_LABELS.CREATE_SUCCESS,
        success: true
      })

      expect(vi.mocked(redirect)).toHaveBeenCalledWith(ROUTES.PRESENTATION_LIST)
    })

    test('does not redirect on error', () => {
      handlePresentationFormState({
        message: 'Error',
        success: false
      })

      expect(vi.mocked(redirect)).not.toHaveBeenCalled()
    })

    test('handles undefined success field', () => {
      handlePresentationFormState({
        message: PRESENTATION_FORM_LABELS.CREATE_SUCCESS,
        success: undefined
      })

      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(PRESENTATION_FORM_LABELS.CREATE_SUCCESS)
      expect(vi.mocked(redirect)).not.toHaveBeenCalled()
    })
  })
})
