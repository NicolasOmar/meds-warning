// CORE
import { FC } from 'react'
// COMPONENTS
import LayoutTemplate from '@template-components/LayoutTemplate'
// SHARED
import { MEDICINE_MAIN_ROUTES_OBJS } from '@shared-constants/routes'
import { BaseLayoutProps } from '@shared-types/interfaces'

const MedicineLayout: FC<BaseLayoutProps> = ({ children }) => {
  return <LayoutTemplate paths={MEDICINE_MAIN_ROUTES_OBJS}>{children}</LayoutTemplate>
}

export default MedicineLayout
