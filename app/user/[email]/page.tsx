// CORE
import { FC } from 'react'
import { notFound } from 'next/navigation'
// API
import { prisma } from '@prisma/index'
// COMPONENTS
import UserForm from '@custom-components/UserForm'
// TYPES
import { userFormType } from '@actions/schemas'

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

  return <UserForm userUpdate={userResponse as userFormType} />
}

export default UpdateUserPage
