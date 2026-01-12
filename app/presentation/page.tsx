// CORE
import { FC } from 'react'
// SHARED
import { PRESENTATION_PAGE_LABELS } from '@shared-constants/labels'

const PresentationHomePage: FC = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <section className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black content-center">
        {PRESENTATION_PAGE_LABELS.WELCOME_MESSAGE}
      </section>
    </section>
  )
}

export default PresentationHomePage
