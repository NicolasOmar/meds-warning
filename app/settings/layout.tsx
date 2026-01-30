// CORE
import { FC } from 'react'
// COMPONENTS
import LayoutTemplate from '@template-components/LayoutTemplate'
// SHARED
import { BaseLayoutProps } from '@shared-types/interfaces'

const SettingsLayout: FC<BaseLayoutProps> = ({ children }) => {
  return <LayoutTemplate>{children}</LayoutTemplate>
}

export default SettingsLayout
