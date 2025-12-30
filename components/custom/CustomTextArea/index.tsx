// CORE
import { FC } from 'react'
// COMPONENTS
import { Label } from '@base-components/label'
import { Textarea } from '@base-components/textarea'

interface CustomTextAreaProps {
  label: string
  name: string
  value?: string
  placeholder?: string
}

const CustomTextArea: FC<CustomTextAreaProps> = ({ label, name, value, placeholder }) => {
  return (
    <section className="grid w-full gap-3">
      <Label htmlFor={name}>{label}</Label>
      <Textarea placeholder={placeholder} id={name} value={value} />
    </section>
  )
}

export default CustomTextArea
