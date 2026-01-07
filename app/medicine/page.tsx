// CORE
import { FC } from 'react'
// SHARED
import { MEDICINE_PAGE_LABELS } from '@shared-constants/labels'

const MedicineHomePage: FC = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <section className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black content-center">
        {MEDICINE_PAGE_LABELS.WELCOME_MESSAGE}
      </section>
    </section>
  )
}

export default MedicineHomePage
