import { redirect } from 'next/navigation'
import { ROUTE_URLS } from '@shared-constants/routes'

export default function PasswordRootPage() {
  redirect(ROUTE_URLS.LOGIN)
}
