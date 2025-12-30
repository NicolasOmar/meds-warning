import { FC } from 'react'
// COMPONENTS
import { FieldGroup, FieldLegend } from '@base-components/field'
import CustomField from '@custom-components/CustomField'
// LIBRARY
import { MEDICINE_FORM_LABELS } from '@ts/texts'

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
    type: 'text',
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
    type: 'text',
    placeholder: MEDICINE_FORM_LABELS.COMMENTS_PLACEHOLDER
  }
})

const MedicineForm: FC = () => {
  const medicineFormStructure = generateUserFormStructure()

  return (
    <form>
      <FieldGroup>
        <FieldLegend>Medicine Information</FieldLegend>

        {Object.values(medicineFormStructure).map(({ name, label, type, placeholder }) => (
          <CustomField key={name} name={name} label={label} type={type} placeholder={placeholder} />
        ))}
      </FieldGroup>
    </form>
  )
}

export default MedicineForm
