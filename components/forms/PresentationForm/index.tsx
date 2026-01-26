'use client'
// CORE
import { FC, useActionState, useEffect } from 'react'
// FORM
import { handlePresentationAction } from '@actions/presentation'
// COMPONENTS
import { Button } from '@base-components/button'
import { FieldGroup, FieldLegend } from '@base-components/field'
import CustomInput from '@custom-components/CustomInput'
// SHARED
import { PresentationActionState } from '@shared-types/states'
import { PRESENTATION_FORM_LABELS } from '@shared-constants/forms'
import { MedicinePresentationType } from '@shared-types/zod'
import { handlePresentationFormState } from '@shared-functions/forms'

interface PresentationFormProps {
  presentationData?: MedicinePresentationType
}

const generatePresentationFormStructure = () => ({
  description: {
    name: 'description',
    label: PRESENTATION_FORM_LABELS.DESCRIPTION,
    type: 'text',
    placeholder: PRESENTATION_FORM_LABELS.DESCRIPTION_PLACEHOLDER
  }
})

const PresentationForm: FC<PresentationFormProps> = ({ presentationData }) => {
  const presentationFormStructure = generatePresentationFormStructure()
  const customPresentationFormAction = (state: PresentationActionState, formData: FormData) =>
    handlePresentationAction(state, formData, presentationData?.id?.toString())
  const [state, presentationFormAction, isPending] = useActionState<
    PresentationActionState,
    FormData
  >(customPresentationFormAction, {})

  useEffect(() => {
    handlePresentationFormState(state)
  }, [state])

  return (
    <form action={presentationFormAction} className="flex flex-col gap-4">
      <FieldGroup>
        <FieldLegend>{PRESENTATION_FORM_LABELS.TITLE}</FieldLegend>
        <CustomInput
          {...presentationFormStructure.description}
          message={state.errors?.description}
          value={presentationData?.description ?? ''}
        />
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {PRESENTATION_FORM_LABELS.SUBMIT_BUTTON}
      </Button>
    </form>
  )
}

export default PresentationForm
