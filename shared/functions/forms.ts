import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import { MedicineActionState, PresentationActionState } from '@shared-types/states'
import { ROUTES } from '@shared-constants/routes'

export const handleMedicineFormState = (state?: MedicineActionState) => {
  if (state?.message) {
    const toastAction = state.success ? toast.success : toast.error
    toastAction(state.message)

    if (state.success) {
      redirect(ROUTES.MEDICINE_LIST)
    }
  }
}

export const handlePresentationFormState = (state?: PresentationActionState) => {
  if (state?.message) {
    const toastAction = state.success ? toast.success : toast.error
    toastAction(state.message)

    if (state.success) {
      redirect(ROUTES.PRESENTATION_LIST)
    }
  }
}
