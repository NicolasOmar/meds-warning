import { ReactNode } from 'react'

export interface LayoutProps {
  children: ReactNode
}

export interface BaseFormFieldProps {
  label: string
  name: string
  message?: string | string[]
}

export interface CompleteFormFieldPorps extends BaseFormFieldProps {
  placeholder?: string
  value?: string
}
