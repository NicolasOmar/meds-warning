// CORE
import { FC } from 'react'
import { notFound } from 'next/navigation'
// API
import { prisma } from '@prisma/index'
// COMPONENTS
import UserForm from '@form-components/UserForm'
// SHARED
import { UserFormType } from '@shared-types/zod'

interface UpdateUserPageProps {
  params: Promise<{ email: string }>
}

const UpdateUserPage: FC<UpdateUserPageProps> = async ({ params }) => {
  const { email } = await params

  if (!email) {
    notFound()
  }

  const userResponse = await prisma.userForm.findFirst({
    where: {
      email: decodeURIComponent(email)
    }
  })

  if (!userResponse) {
    notFound()
  }

  return <UserForm userUpdate={userResponse as UserFormType} />
}

export default UpdateUserPage
