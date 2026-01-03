import { ReactNode } from 'react'

export interface LayoutProps {
  children: ReactNode
}

export interface BaseFormFieldProps {
  label: string
  name: string
  message?: string | string[]
}

export interface FormFieldStructureProps extends LayoutProps, BaseFormFieldProps {}

export interface ExtendedFormFieldProps extends BaseFormFieldProps {
  placeholder?: string
  value?: string
}
