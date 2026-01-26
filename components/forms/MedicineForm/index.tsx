'use client'
// CORE
import { FC, useActionState, useEffect } from 'react'
// FORM
import { handleMedicineAction } from '@actions/medicine'
// COMPONENTS
import { FieldGroup, FieldLegend, FieldSet } from '@base-components/field'
import { Button } from '@base-components/button'
import CustomInput from '@custom-components/CustomInput'
import CustomTextArea from '@custom-components/CustomTextArea'
import DatePicker from '@custom-components/DatePicker'
import CustomSelect from '@custom-components/CustomSelect'
// SHARED
import { MEDICINE_FORM_LABELS } from '@shared-constants/forms'
import { MedicinePresentationType, MedicineType } from '@shared-types/zod'
import { MedicineActionState } from '@shared-types/states'
import { handleMedicineFormState } from '@shared-functions/forms'

interface MedicineFormProps {
  presentationsList: MedicinePresentationType[]
  medicineData?: MedicineType
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

const MedicineForm: FC<MedicineFormProps> = ({ presentationsList, medicineData }) => {
  const medicineFormStructure = generateUserFormStructure()
  const customMedicineFormAction = (state: MedicineActionState, formData: FormData) =>
    handleMedicineAction(state, formData, medicineData?.id?.toString())
  const [state, medicineFormAction, isPending] = useActionState(customMedicineFormAction, {})

  useEffect(() => {
    handleMedicineFormState(state)
  }, [state])

  return (
    <form action={medicineFormAction} className="flex flex-col gap-4">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>{MEDICINE_FORM_LABELS.TITLE}</FieldLegend>
          <CustomInput
            {...medicineFormStructure.name}
            message={state.errors?.name}
            value={medicineData?.name ?? ''}
          />
          <CustomInput
            {...medicineFormStructure.laboratory}
            message={state.errors?.laboratory}
            value={medicineData?.laboratory ?? ''}
          />
          <CustomSelect
            {...medicineFormStructure.presentation}
            options={
              presentationsList?.map(presentation => ({
                value: presentation.id!.toString(),
                label: presentation.description
              })) ?? []
            }
            value={medicineData?.presentation?.toString() ?? undefined}
            message={state.errors?.presentation}
          />
          {medicineData ? null : (
            <DatePicker
              {...medicineFormStructure.expirationDate}
              message={state.errors?.expirationDate}
            />
          )}
          <CustomInput
            {...medicineFormStructure.usedFor}
            message={state.errors?.usedFor}
            value={medicineData?.usedFor ?? ''}
          />
          <CustomInput
            {...medicineFormStructure.sideEffects}
            message={state.errors?.sideEffects}
            value={medicineData?.sideEffects ?? ''}
          />
          <CustomTextArea
            {...medicineFormStructure.comments}
            message={state.errors?.comments}
            value={medicineData?.comments ?? ''}
          />
        </FieldSet>
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {MEDICINE_FORM_LABELS.SUBMIT_BUTTON}
      </Button>
    </form>
  )
}

export default MedicineForm
