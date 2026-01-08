// CORE
import { FC } from 'react'
// COMPONENTS
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@base-components/select'
import FormFieldStructure from '@custom-components/FormFieldStructure'
// SHARED
import { CompleteFormFieldPorps } from '@shared-types/interfaces'

interface CustomSelectProps extends CompleteFormFieldPorps {
  selectLabel?: string
  options: { label: string; value: string }[]
  value?: string
}

const CustomSelect: FC<CustomSelectProps> = ({
  label,
  name,
  placeholder,
  selectLabel,
  options,
  value,
  message
}) => {
  return (
    <FormFieldStructure label={label} name={name} message={message}>
      <Select name={name} defaultValue={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {selectLabel ? <SelectLabel>{selectLabel}</SelectLabel> : null}
            {options.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormFieldStructure>
  )
}

export default CustomSelect
