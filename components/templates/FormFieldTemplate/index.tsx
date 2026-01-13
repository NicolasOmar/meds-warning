import { FC, Fragment } from 'react'
// COMPONENTS
import { Field, FieldDescription, FieldLabel } from '@base-components/field'
// SHARED
import { BaseLayoutProps, BaseFormFieldProps } from '@shared-types/interfaces'

interface FormFieldStructureProps extends BaseLayoutProps, BaseFormFieldProps {}

const FormFieldTemplate: FC<FormFieldStructureProps> = ({ label, name, message, children }) => {
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

export default FormFieldTemplate
