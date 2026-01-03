import { ReactNode } from 'react'

export interface LayoutProps {
  children: ReactNode
}

export interface FormFieldProps {
  label: string
  name: string
  placeholder?: string
  value?: string
  message?: string | string[]
}
