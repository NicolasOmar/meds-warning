import { toast } from 'sonner'
import { redirect } from 'next/navigation'
// SHARED
import { BaseActionState } from '@shared-types/states'

export const handleCommonFormState = (redirectPath: string, state?: BaseActionState) => {
  if (state?.message) {
    const toastAction = state.success ? toast.success : toast.error
    toastAction(state.message)

    if (state.success) {
      redirect(redirectPath)
    }
  }
}
