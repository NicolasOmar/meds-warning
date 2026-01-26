// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { redirect } from 'next/navigation'
// COMPONENTS
import { toast } from 'sonner'
// SHARED
import { handleCommonFormState } from '../forms'
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

  describe('[handleCommonFormState]', () => {
    test('does nothing when state is undefined', () => {
      handleCommonFormState(ROUTES.MEDICINE_LIST, undefined)

      expect(toast.success).not.toHaveBeenCalled()
      expect(toast.error).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    test('does nothing when state message is empty', () => {
      handleCommonFormState(ROUTES.MEDICINE_LIST, { message: '', success: true })

      expect(toast.success).not.toHaveBeenCalled()
      expect(toast.error).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    test('does nothing when state message is undefined', () => {
      handleCommonFormState(ROUTES.MEDICINE_LIST, { success: true })

      expect(toast.success).not.toHaveBeenCalled()
      expect(toast.error).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    test('calls success toast when state.success is true', () => {
      const message = 'Operation successful!'
      handleCommonFormState(ROUTES.MEDICINE_LIST, { message, success: true })

      expect(toast.success).toHaveBeenCalledWith(message)
      expect(toast.error).not.toHaveBeenCalled()
    })

    test('calls error toast when state.success is false', () => {
      const message = 'Operation failed!'
      handleCommonFormState(ROUTES.MEDICINE_LIST, { message, success: false })

      expect(toast.error).toHaveBeenCalledWith(message)
      expect(toast.success).not.toHaveBeenCalled()
    })

    test('calls error toast when state.success is undefined', () => {
      const message = 'Something went wrong'
      handleCommonFormState(ROUTES.MEDICINE_LIST, { message })

      expect(toast.error).toHaveBeenCalledWith(message)
      expect(toast.success).not.toHaveBeenCalled()
    })

    test('calls redirect when state.success is true', () => {
      const message = 'Redirecting...'
      handleCommonFormState(ROUTES.PRESENTATION_LIST, { message, success: true })

      expect(redirect).toHaveBeenCalledWith(ROUTES.PRESENTATION_LIST)
    })

    test('does not redirect when state.success is false', () => {
      const message = 'Error occurred'
      handleCommonFormState(ROUTES.MEDICINE_LIST, { message, success: false })

      expect(redirect).not.toHaveBeenCalled()
    })

    test('does not redirect when state.success is undefined', () => {
      const message = 'Error occurred'
      handleCommonFormState(ROUTES.MEDICINE_LIST, { message })

      expect(redirect).not.toHaveBeenCalled()
    })

    test('redirects to correct path for different routes', () => {
      const message = 'Success'
      handleCommonFormState(ROUTES.PRESENTATION_CREATE, { message, success: true })

      expect(redirect).toHaveBeenCalledWith(ROUTES.PRESENTATION_CREATE)
    })

    test('handles long message strings', () => {
      const message = 'A'.repeat(200)
      handleCommonFormState(ROUTES.MEDICINE_LIST, { message, success: true })

      expect(toast.success).toHaveBeenCalledWith(message)
      expect(redirect).toHaveBeenCalledWith(ROUTES.MEDICINE_LIST)
    })

    test('handles special characters in message', () => {
      const message = 'Error: Unable to connect! @#$%^&*()'
      handleCommonFormState(ROUTES.MEDICINE_LIST, { message, success: false })

      expect(toast.error).toHaveBeenCalledWith(message)
      expect(redirect).not.toHaveBeenCalled()
    })

    test('handles message with line breaks', () => {
      const message = 'First line\nSecond line'
      handleCommonFormState(ROUTES.MEDICINE_LIST, { message, success: true })

      expect(toast.success).toHaveBeenCalledWith(message)
    })

    test('toast is called before redirect on success', () => {
      const message = 'Created successfully'
      const callOrder: string[] = []

      vi.mocked(toast.success).mockImplementationOnce(() => {
        callOrder.push('toast')
        return ''
      })
      vi.mocked(redirect).mockImplementationOnce(() => {
        callOrder.push('redirect')
        throw new Error('NEXT_REDIRECT')
      })

      try {
        handleCommonFormState(ROUTES.MEDICINE_LIST, { message, success: true })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        // redirect throws in Next.js, this is expected
      }

      expect(callOrder).toEqual(['toast', 'redirect'])
    })

    test('handles state with errors property', () => {
      const message = 'Validation failed'
      const state = {
        message,
        success: false,
        errors: { field: ['Error message'] }
      }
      handleCommonFormState(ROUTES.MEDICINE_LIST, state)

      expect(toast.error).toHaveBeenCalledWith(message)
      expect(redirect).not.toHaveBeenCalled()
    })

    test('handles multiple calls with different states', () => {
      handleCommonFormState(ROUTES.MEDICINE_LIST, { message: 'First', success: true })
      handleCommonFormState(ROUTES.PRESENTATION_LIST, { message: 'Second', success: false })

      expect(toast.success).toHaveBeenCalledWith('First')
      expect(toast.error).toHaveBeenCalledWith('Second')
      expect(redirect).toHaveBeenCalledTimes(1)
      expect(redirect).toHaveBeenCalledWith(ROUTES.MEDICINE_LIST)
    })
  })
})
