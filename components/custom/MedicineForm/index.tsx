'use client'
// CORE
import { FC, useActionState, useEffect } from 'react'
// FORM
import { createMedicineAction } from '@actions/medicine'
// COMPONENTS
import { toast } from 'sonner'
import { FieldGroup, FieldLegend, FieldSet } from '@base-components/field'
import { Button } from '@base-components/button'
import CustomField from '@custom-components/CustomField'
import CustomTextArea from '@custom-components/CustomTextArea'
import DatePicker from '@custom-components/DatePicker'
import CustomSelect from '@custom-components/CustomSelect'
// LIBRARY
import { MEDICINE_FORM_LABELS } from '@constants/labels'

interface MedicineFormStructure {
  listOfPresentations?: { id: number; description: string }[]
}

const generateUserFormStructure = () => ({
  name: {
    name: 'name',
    label: MEDICINE_FORM_LABELS.NAME,
    type: 'text',
    placeholder: MEDICINE_FORM_LABELS.NAME_PLACEHOLDER
  },
  laboratory: {
    name: 'laboratory',
    label: MEDICINE_FORM_LABELS.LABORATORY,
    type: 'text',
    placeholder: MEDICINE_FORM_LABELS.LABORATORY_PLACEHOLDER
  },
  presentation: {
    name: 'presentation',
    label: MEDICINE_FORM_LABELS.PRESENTATION,
    type: 'text',
    placeholder: MEDICINE_FORM_LABELS.PRESENTATION_PLACEHOLDER
  },
  expirationDate: {
    name: 'expirationDate',
    label: MEDICINE_FORM_LABELS.EXPIRATION_DATE,
    placeholder: MEDICINE_FORM_LABELS.EXPIRATION_DATE_PLACEHOLDER
  },
  usedFor: {
    name: 'usedFor',
    label: MEDICINE_FORM_LABELS.USED_FOR,
    type: 'text',
    placeholder: MEDICINE_FORM_LABELS.USED_FOR_PLACEHOLDER
  },
  sideEffects: {
    name: 'sideEffects',
    label: MEDICINE_FORM_LABELS.SIDE_EFFECTS,
    type: 'text',
    placeholder: MEDICINE_FORM_LABELS.SIDE_EFFECTS_PLACEHOLDER
  },
  comments: {
    name: 'comments',
    label: MEDICINE_FORM_LABELS.COMMENTS,
    placeholder: MEDICINE_FORM_LABELS.COMMENTS_PLACEHOLDER
  }
})

const MedicineForm: FC<MedicineFormStructure> = ({ listOfPresentations }) => {
  const medicineFormStructure = generateUserFormStructure()
  const [state, formAction, isPending] = useActionState(createMedicineAction, {})

  useEffect(() => {
    if (state?.message) {
      const toastAction = state.errors ? toast.error : toast.success
      toastAction(state.message)
    }
  }, [state.message, state.errors])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>{MEDICINE_FORM_LABELS.TITLE}</FieldLegend>
          <CustomField {...medicineFormStructure.name} message={state.errors?.name} />
          <CustomField {...medicineFormStructure.laboratory} message={state.errors?.laboratory} />
          <CustomSelect
            label={medicineFormStructure.presentation.label}
            name={medicineFormStructure.presentation.name}
            options={
              listOfPresentations?.map(presentation => ({
                value: presentation.id.toString(),
                label: presentation.description
              })) ?? []
            }
          />
          <DatePicker {...medicineFormStructure.expirationDate} />
          <CustomField {...medicineFormStructure.usedFor} message={state.errors?.usedFor} />
          <CustomField {...medicineFormStructure.sideEffects} message={state.errors?.sideEffects} />
          <CustomTextArea {...medicineFormStructure.comments} />
        </FieldSet>
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {MEDICINE_FORM_LABELS.SUBMIT_BUTTON}
      </Button>
    </form>
  )
}

export default MedicineForm
