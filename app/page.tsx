// CORE
import { redirect } from 'next/navigation'
// SHARED
import { ROUTE_URLS } from '@shared-constants/routes'
import { getSession } from '@shared-functions/auth'
import { ROOT_PAGE_LABELS } from '@shared-constants/pages'

export default async function RootPage() {
  const session = await getSession()

  if (!session) {
    redirect(ROUTE_URLS.LOGIN)
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{ROOT_PAGE_LABELS.WELCOME_MESSAGE}</h1>
      <p className="text-muted-foreground">{ROOT_PAGE_LABELS.FIRST_PARAGRAPH}</p>
      <p className="text-muted-foreground">{ROOT_PAGE_LABELS.SECOND_PARAGRAPH}</p>
    </section>
  )
}
