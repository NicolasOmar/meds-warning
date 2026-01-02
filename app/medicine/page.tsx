// CORE
import { FC } from 'react'
// COMPONENTS
import MedicineForm from '@custom-components/MedicineForm'
import { prisma } from '@prisma/index'

export const MedicinePage: FC = async () => {
  const listOfData = await prisma.medicinePresentation.findMany()
  console.log('listOfData', listOfData)

  return <MedicineForm listOfPresentations={listOfData ?? []} />
}

export default MedicinePage
