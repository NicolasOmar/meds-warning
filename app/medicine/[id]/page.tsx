// CORE
import { FC } from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicineForm from '@form-components/MedicineForm'
import { getSession } from '@shared-functions/auth'

interface UpdateMedicinePageProps {
  params: Promise<{ id: string }>
}

const UpdateMedicinePage: FC<UpdateMedicinePageProps> = async ({ params }) => {
  const { id } = await params
  const session = await getSession()
  const presentationsList = await prisma.medicinePresentation.findMany({
    where: { userId: session!.user.id }
  })

  if (!id || Number.isNaN(+id)) {
    notFound()
  }

  const findedMedicine = await prisma.medicine.findFirst({
    where: { id: +id, userId: session!.user.id }
  })

  if (!findedMedicine) {
    notFound()
  }

  return <MedicineForm presentationsList={presentationsList} medicineData={findedMedicine} />
}

export default UpdateMedicinePage
