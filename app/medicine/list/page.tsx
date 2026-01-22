// CORE
import { FC } from 'react'
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicineTable from '@table-components/MedicineTable'
// SHARED
import { parseMedicineToDataItem } from '@shared-functions/parsers'

const ListMedicinePage: FC = async () => {
  const fetchedMedicineList = parseMedicineToDataItem(
    await prisma.medicine.findMany({
      include: {
        medicinePresentation: true
      }
    })
  )

  return <MedicineTable medicineList={fetchedMedicineList} />
}

export default ListMedicinePage
