// CORE
import { FC } from 'react'
// COMPONENTS
import { Spinner } from '@base-components/spinner'

const HomeLoading: FC = () => (
  <section className="flex flex-col min-h-screen min-w-full justify-start items-center gap-5 py-16 px-8 font-sans dark:bg-black bg-white">
    <Spinner className="size-8" />
  </section>
)

export default HomeLoading
