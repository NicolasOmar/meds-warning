'use client'
// CORE
import { FC, useActionState, useEffect } from 'react'
import { redirect } from 'next/navigation'
// FORM
import { handleMedicineAction } from '@actions/medicine'
// COMPONENTS
import { toast } from 'sonner'
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
import { ROUTES } from '@shared-constants/routes'

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
  const formAction = (state: MedicineActionState, formData: FormData) =>
    handleMedicineAction(state, formData, medicineData?.id?.toString())
  const [state, boundFormAction, isPending] = useActionState(formAction, {})

  useEffect(() => {
    if (state?.message) {
      const toastAction = state.success ? toast.success : toast.error

      toastAction(state.message)

      if (state.success) {
        redirect(ROUTES.MEDICINE_LIST)
      }
    }
  }, [state.message, state.success])

  return (
    <form action={boundFormAction} className="flex flex-col gap-4">
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
          <DatePicker
            {...medicineFormStructure.expirationDate}
            message={state.errors?.expirationDate}
            value={medicineData?.expirationDate?.toISOString() ?? undefined}
          />
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
