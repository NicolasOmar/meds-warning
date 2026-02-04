// CORE
import { redirect } from 'next/navigation'
// SHARED
import { ROUTE_URLS } from '@shared-constants/routes'

const UserRootPage = () => {
  redirect(ROUTE_URLS.USER_CREATE)
}

export default UserRootPage
