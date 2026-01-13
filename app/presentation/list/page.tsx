// CORE
import { FC } from 'react'
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicinePresentationTable from '@table-components/PresentationTable'

const ListMedicinePage: FC = async () => {
  const fetchedPresentationList = await prisma.medicinePresentation.findMany()

  return <MedicinePresentationTable presentationList={fetchedPresentationList} />
}

export default ListMedicinePage
