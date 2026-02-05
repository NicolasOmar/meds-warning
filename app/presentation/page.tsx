// CORE
import { FC } from 'react'
// SHARED
import { PRESENTATION_PAGE_LABELS } from '@shared-constants/pages'

const PresentationRootPage: FC = () => {
  return (
    <section className="flex flex-col items-center gap-4 py-8">
      <p className="text-muted-foreground">{PRESENTATION_PAGE_LABELS.WELCOME_MESSAGE}</p>
    </section>
  )
}

export default PresentationRootPage
