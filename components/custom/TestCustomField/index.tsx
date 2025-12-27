import { FC } from 'react'
// COMPONENTS
import { Field, FieldLabel } from '@base-components/field'
import { Input } from '@base-components/input'

interface CustomFieldProps {
  label: string
  name: string
  type: string
  value?: string
  placeholder?: string
}

const CustomField: FC<CustomFieldProps> = ({ label, name, type, placeholder, value }) => {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input id={name} name={name} placeholder={placeholder} type={type} value={value} required />
    </Field>
  )
}

export default CustomField
