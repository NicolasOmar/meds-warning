// CORE
import { FC } from 'react'
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicineForm from '@form-components/MedicineForm'

const MedicinePage: FC = async () => {
  const presentationsList = await prisma.medicinePresentation.findMany({})

  return <MedicineForm presentationsList={presentationsList} />
}

export default MedicinePage
