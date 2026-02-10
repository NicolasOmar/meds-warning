// CORE
import { FC } from 'react'
// API
import { prisma } from '@prisma/index'
// COMPONENTS
import SettingsForm from '@form-components/SettingsForm'
import UserForm from '@form-components/UserForm'
// SHARED
import { getSession } from '@shared-functions/auth'

const SettingsRootPage: FC = async () => {
  const session = await getSession()
  const loggedUser = await prisma.user.findUnique({
    where: { id: session!.user.id }
  })
  return (
    <>
      <UserForm userData={loggedUser ?? undefined} />
      <SettingsForm userDaysToNotify={loggedUser?.daysToNotify ?? 30} />
    </>
  )
}

export default SettingsRootPage
