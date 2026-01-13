// CORE
import { FC } from 'react'
// COMPONENTS
import LayoutTemplate from '@template-components/LayoutTemplate'
// SHARED
import { PRESENTATION_MAIN_ROUTES_OBJS } from '@shared-constants/routes'
import { BaseLayoutProps } from '@shared-types/interfaces'

const PresentationLayout: FC<BaseLayoutProps> = ({ children }) => {
  return <LayoutTemplate paths={PRESENTATION_MAIN_ROUTES_OBJS}>{children}</LayoutTemplate>
}

export default PresentationLayout
