// CORE
import { FC } from 'react'
// COMPONENTS
import { Textarea } from '@base-components/textarea'
import FormFieldStructure from '@custom-components/FormFieldStructure'
// SHARED
import { ExtendedFormFieldProps } from '@shared-types/interfaces'

const CustomTextArea: FC<ExtendedFormFieldProps> = ({ label, name, value, placeholder }) => {
  return (
    <FormFieldStructure label={label} name={name} message={undefined}>
      <Textarea placeholder={placeholder} id={name} name={name} value={value} />
    </FormFieldStructure>
  )
}

export default CustomTextArea
