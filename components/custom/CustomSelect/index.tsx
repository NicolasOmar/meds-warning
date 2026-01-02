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

interface CustomSelectProps {
  placeholder?: string
  selectLabel?: string
  options: { label: string; value: string }[]
}

const CustomSelect: FC<CustomSelectProps> = ({
  placeholder = 'Select a fruit',
  selectLabel = 'Fruits',
  options
}) => {
  return (
    <Select>
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
  )
}

export default CustomSelect
