// CORE
import { FC } from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicineForm from '@form-components/MedicineForm'

interface UpdateMedicinePageProps {
  params: Promise<{ id: string }>
}

const UpdateMedicinePage: FC<UpdateMedicinePageProps> = async ({ params }) => {
  const { id } = await params
  const presentationsList = await prisma.medicinePresentation.findMany({})

  console.warn(presentationsList)
  console.warn('Updating medicine with ID:', id)

  if (!id || Number.isNaN(+id)) {
    notFound()
  }

  const findedMedicine = await prisma.medicine.findFirst({
    where: { id: +id }
  })

  if (!findedMedicine) {
    notFound()
  }

  return <MedicineForm presentationsList={presentationsList} medicineData={findedMedicine} />
}

export default UpdateMedicinePage
