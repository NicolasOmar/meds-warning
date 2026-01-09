// CORE
import { FC } from 'react'
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicineTable from '@table-components/MedicineTable'

const ListMedicinePage: FC = async () => {
  const fetchedMedicineList = (
    await prisma.medicine.findMany({
      include: {
        medicinePresentation: true
      }
    })
  ).map(medicineItem => ({
    id: medicineItem.id,
    name: medicineItem.name,
    laboratory: medicineItem.laboratory,
    presentation: medicineItem.medicinePresentation?.description ?? '',
    expirationDate: medicineItem.expirationDate?.toISOString().split('T')[0] ?? null,
    usedFor: medicineItem.usedFor,
    sideEffects: medicineItem.sideEffects,
    comments: medicineItem.comments
  }))

  return <MedicineTable medicineList={fetchedMedicineList} />
}

export default ListMedicinePage
