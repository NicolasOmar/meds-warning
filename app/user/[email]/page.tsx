import { FC } from 'react'
import { notFound } from 'next/navigation'

interface UpdateUserPageProps {
  params: Promise<{ email: string }>
}

const UpdateUserPage: FC<UpdateUserPageProps> = async ({ params }) => {
  const { email } = await params

  if (!email) {
    notFound()
  }

  return <section>Update user {email}</section>
}

export default UpdateUserPage
