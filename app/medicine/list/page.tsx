// CORE
import { FC } from 'react'
import { prisma } from '@prisma/index'
// COMPONENTS
import DataTable from '@custom-components/DataTable'
// SHARED
import { MEDICINE_TABLE_LABELS } from '@shared-constants/labels'

interface MedicineDataItem {
  id: number
  name: string
  laboratory: string | null
  presentation: string
  expirationDate: string | null
  usedFor: string | null
  sideEffects: string | null
  comments: string | null
}

const ListMedicinePage: FC = async () => {
  const createdMedicineList: MedicineDataItem[] = (
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

  return (
    <DataTable
      title={MEDICINE_TABLE_LABELS.TITLE}
      headers={MEDICINE_TABLE_LABELS.HEADERS.split(',')}
      data={createdMedicineList}
    />
  )
}

export default ListMedicinePage
