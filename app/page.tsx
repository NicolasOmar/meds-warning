// CORE
import { FC } from 'react'
// SHARED
import { ROOT_PAGE_LABELS } from '@shared-constants/pages'

const RootPage: FC = () => {
  return (
    <section className="flex flex-col min-h-screen min-w-full justify-start items-center gap-5 py-16 px-8 font-sans dark:bg-black bg-white">
      <p>{ROOT_PAGE_LABELS.WELCOME_MESSAGE}</p>
      <p>{ROOT_PAGE_LABELS.FIRST_PARAGRAPH}</p>
    </section>
  )
}

export default RootPage
