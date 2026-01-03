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
import { Field, FieldLabel } from '@base-components/field'
import { FormFieldProps } from '@ts/interfaces'

interface CustomSelectProps extends FormFieldProps {
  selectLabel?: string
  options: { label: string; value: string }[]
}

const CustomSelect: FC<CustomSelectProps> = ({
  label,
  name,
  placeholder = 'Select a fruit',
  selectLabel = 'Fruits',
  options
}) => {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Select name={name}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{selectLabel}</SelectLabel>
            {options.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default CustomSelect
