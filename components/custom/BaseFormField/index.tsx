import { FC, Fragment } from 'react'
import { Field, FieldDescription, FieldLabel } from '@base-components/field'
import { LayoutProps, FormFieldProps } from '@ts/interfaces'

interface BaseFormFieldProps extends LayoutProps, FormFieldProps {}

const BaseFormField: FC<BaseFormFieldProps> = ({ label, name, message, children }) => {
  return (
    <Field>
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

export default BaseFormField
