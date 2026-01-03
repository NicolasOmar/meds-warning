// CORE
import { FC } from 'react'
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicineForm from '@form-components/MedicineForm'

export const MedicinePage: FC = async () => {
  const listOfData = await prisma.medicinePresentation.findMany()

  return <MedicineForm listOfPresentations={listOfData ?? []} />
}

export default MedicinePage
