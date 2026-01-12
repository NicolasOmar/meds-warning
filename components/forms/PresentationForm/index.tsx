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

const generatePresentationFormStructure = () => ({
  description: {
    name: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Brief description of the presentation'
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
        <FieldLegend>Presentation Details</FieldLegend>
        <CustomInput {...presentationFormStructure.description} />
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {'Create Presentation'}
      </Button>
    </form>
  )
}

export default PresentationForm
