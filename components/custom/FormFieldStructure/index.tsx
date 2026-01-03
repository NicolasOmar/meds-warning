import { FC, Fragment } from 'react'
// COMPONENTS
import { Field, FieldDescription, FieldLabel } from '@base-components/field'
// SHARED
import { FormFieldStructureProps } from '@shared-types/interfaces'

const FormFieldStructure: FC<FormFieldStructureProps> = ({ label, name, message, children }) => {
  return (
    <Field className="flex flex-col gap-3">
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {children}
      <FieldDescription>
        {Array.isArray(message)
          ? message.map((msg, index) => <Fragment key={`${name}-msg-${index}`}>{msg}</Fragment>)
          : message}
      </FieldDescription>
    </Field>
  )
}

export default FormFieldStructure
