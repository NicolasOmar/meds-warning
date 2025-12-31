import { FC, Fragment } from 'react'
// COMPONENTS
import { Field, FieldDescription, FieldLabel } from '@base-components/field'
import { Input } from '@base-components/input'

interface CustomFieldProps {
  label: string
  name: string
  type: string
  value?: string
  placeholder?: string
  message?: string | string[]
}

const CustomField: FC<CustomFieldProps> = ({ label, name, type, placeholder, value, message }) => {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input id={name} name={name} placeholder={placeholder} type={type} defaultValue={value} />
      <FieldDescription>
        {Array.isArray(message)
          ? message.map((msg, index) => <Fragment key={index}>{msg}</Fragment>)
          : message}
      </FieldDescription>
    </Field>
  )
}

export default CustomField
