// CORE
import { FC } from 'react'
// SHARED
import { MEDICINE_PAGE_LABELS } from '@shared-constants/pages'

const MedicineRootPage: FC = () => {
  return (
    <section className="flex flex-col items-center gap-4 py-8">
      <p className="text-muted-foreground">{MEDICINE_PAGE_LABELS.WELCOME_MESSAGE}</p>
    </section>
  )
}

export default MedicineRootPage
