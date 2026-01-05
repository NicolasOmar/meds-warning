// CORE
import { FC } from 'react'
// COMPONENTS
import { Textarea } from '@base-components/textarea'
import FormFieldStructure from '@custom-components/FormFieldStructure'
// SHARED
import { CompleteFormFieldPorps } from '@shared-types/interfaces'

const CustomTextArea: FC<CompleteFormFieldPorps> = ({ label, name, value, placeholder }) => {
  return (
    <FormFieldStructure label={label} name={name} message={undefined}>
      <Textarea placeholder={placeholder} id={name} name={name} defaultValue={value} />
    </FormFieldStructure>
  )
}

export default CustomTextArea
