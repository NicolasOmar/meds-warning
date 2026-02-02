// CORE
import { redirect } from 'next/navigation'
// SHARED
import { ROUTE_URLS } from '@shared-constants/routes'
import { getSession } from '@shared-functions/auth'

export default async function RootPage() {
  const session = await getSession()

  if (session) {
    redirect(ROUTE_URLS.MEDICINE_LIST)
  } else {
    redirect(ROUTE_URLS.LOGIN)
  }
}
