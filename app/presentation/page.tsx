// CORE
import { FC } from 'react'
import { redirect } from 'next/navigation'
// SHARED
import { ROUTE_URLS } from '@shared-constants/routes'

const PresentationRootPage: FC = () => redirect(ROUTE_URLS.PRESENTATION_LIST)

export default PresentationRootPage
