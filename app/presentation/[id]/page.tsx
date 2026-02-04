// CORE
import { FC } from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@prisma/index'
// COMPONENTS
import PresentationForm from '@form-components/PresentationForm'
import { getSession } from '@shared-functions/auth'

interface UpdatePresentationPageProps {
  params: Promise<{ id: string }>
}

const UpdatePresentationPage: FC<UpdatePresentationPageProps> = async ({ params }) => {
  const { id } = await params
  const session = await getSession()

  if (!id || Number.isNaN(+id)) {
    notFound()
  }

  const findedPresentation = await prisma.medicinePresentation.findFirst({
    where: { id: +id, userId: session!.user.id }
  })

  if (!findedPresentation) {
    notFound()
  }

  return <PresentationForm presentationData={findedPresentation} />
}

export default UpdatePresentationPage
