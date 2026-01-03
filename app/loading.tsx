// CORE
import { FC } from 'react'
// COMPONENTS
import { Spinner } from '@base-components/spinner'

const HomeLoading: FC = () => (
  <section className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    <section className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black content-center">
      <Spinner className="size-8" />
    </section>
  </section>
)

export default HomeLoading
