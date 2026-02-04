// CORE
import { FC } from 'react'
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicinePresentationTable from '@table-components/PresentationTable'
import { getSession } from '@shared-functions/auth'

const ListMedicinePresentationPage: FC = async () => {
  const session = await getSession()
  const fetchedPresentationList = await prisma.medicinePresentation.findMany({
    where: { userId: session!.user.id }
  })

  return <MedicinePresentationTable presentationList={fetchedPresentationList} />
}

export default ListMedicinePresentationPage
