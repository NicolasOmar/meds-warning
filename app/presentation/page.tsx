// CORE
import { FC } from 'react'
// SHARED
import { PRESENTATION_PAGE_LABELS } from '@shared-constants/pages'

const PresentationRootPage: FC = () => {
  return (
    <section className="flex flex-col min-h-screen min-w-full justify-start items-center gap-5 py-16 px-8 font-sans dark:bg-black bg-white">
      {PRESENTATION_PAGE_LABELS.WELCOME_MESSAGE}
    </section>
  )
}

export default PresentationRootPage
