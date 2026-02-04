// CORE
import { FC } from 'react'
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicineForm from '@form-components/MedicineForm'
import { getSession } from '@shared-functions/auth'

const CreateMedicinePage: FC = async () => {
  const session = await getSession()
  const presentationsList = await prisma.medicinePresentation.findMany({
    where: { userId: session!.user.id }
  })

  return <MedicineForm presentationsList={presentationsList} />
}

export default CreateMedicinePage
