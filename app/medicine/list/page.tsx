// CORE
import { FC } from 'react'
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicineTable from '@table-components/MedicineTable'
// SHARED
import { parseMedicineToDataItem } from '@shared-functions/parsers'
import { getSession } from '@shared-functions/auth'

const ListMedicinePage: FC = async () => {
  const session = await getSession()

  const fetchedMedicineList = parseMedicineToDataItem(
    await prisma.medicine.findMany({
      where: { userId: session!.user.id },
      include: {
        medicinePresentation: true
      }
    })
  )

  return <MedicineTable medicineList={fetchedMedicineList} />
}

export default ListMedicinePage
