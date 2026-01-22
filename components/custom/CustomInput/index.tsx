import { FC } from 'react'
// COMPONENTS
import { Input } from '@base-components/input'
import FormFieldTemplate from '@template-components/FormFieldTemplate'
// SHARED
import { CompleteFormFieldPorps } from '@shared-types/interfaces'

interface CustomFieldProps extends CompleteFormFieldPorps {
  type: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomInput: FC<CustomFieldProps> = ({
  label,
  name,
  type,
  placeholder,
  value,
  message,
  onChange
}) => {
  return (
    <FormFieldTemplate label={label} name={name} message={message}>
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        defaultValue={value}
        onChange={onChange}
      />
    </FormFieldTemplate>
  )
}

export default CustomInput
