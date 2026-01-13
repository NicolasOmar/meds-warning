// CORE
import { FC } from 'react'
// COMPONENTS
import { Textarea } from '@base-components/textarea'
import FormFieldTemplate from '@template-components/FormFieldTemplate'
// SHARED
import { CompleteFormFieldPorps } from '@shared-types/interfaces'

const CustomTextArea: FC<CompleteFormFieldPorps> = ({ label, name, value, placeholder }) => {
  return (
    <FormFieldTemplate label={label} name={name} message={undefined}>
      <Textarea placeholder={placeholder} id={name} name={name} defaultValue={value} />
    </FormFieldTemplate>
  )
}

export default CustomTextArea
