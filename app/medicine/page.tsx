// CORE
import { FC } from 'react'
import { redirect } from 'next/navigation'
// SHARED
import { ROUTE_URLS } from '@shared-constants/routes'

const MedicineRootPage: FC = () => redirect(ROUTE_URLS.MEDICINE_LIST)

export default MedicineRootPage
