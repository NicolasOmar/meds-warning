import { ReactNode } from 'react'

export interface BaseLayoutProps {
  children: ReactNode
}

export interface LayoutTempalteProps extends BaseLayoutProps {
  paths: {
    name: string
    path: string
  }[]
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
