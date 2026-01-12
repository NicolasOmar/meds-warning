'use client'
// CORE
import { FC, useActionState, useEffect } from 'react'
// FORM
import { createPresentationAction } from '@actions/presentation'
// COMPONENTS
import { toast } from 'sonner'
import { Button } from '@base-components/button'
import { FieldGroup, FieldLegend } from '@base-components/field'
import CustomInput from '@custom-components/CustomInput'
// SHARED
import { PresentationActionState } from '@shared-types/states'
import { PRESENTATION_FORM_LABELS } from '@shared-constants/forms'

const generatePresentationFormStructure = () => ({
  description: {
    name: 'description',
    label: PRESENTATION_FORM_LABELS.DESCRIPTION,
    type: 'text',
    placeholder: PRESENTATION_FORM_LABELS.DESCRIPTION_PLACEHOLDER
  }
})

const PresentationForm: FC = () => {
  const presentationFormStructure = generatePresentationFormStructure()
  const [state, formAction, isPending] = useActionState<PresentationActionState, FormData>(
    createPresentationAction,
    {}
  )

  useEffect(() => {
    if (state?.message) {
      const toastAction = state.success ? toast.success : toast.error

      toastAction(state.message)
      // redirect(ROUTES.PRESENTATION_LIST)
    }
  }, [state.message, state.success])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <FieldLegend>{PRESENTATION_FORM_LABELS.TITLE}</FieldLegend>
        <CustomInput
          {...presentationFormStructure.description}
          message={state.errors?.description}
        />
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {PRESENTATION_FORM_LABELS.SUBMIT_BUTTON}
      </Button>
    </form>
  )
}

export default PresentationForm
