import 'dotenv/config'
import { prisma } from '../index'
import { hashPassword } from '../../shared/functions/auth'

async function hashExistingPasswords() {
  const users = await prisma.user.findMany()

  if (users.length === 0) {
    return
  }

  for (const user of users) {
    const hashedPassword = await hashPassword(user.password)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })
  }

  await prisma.$disconnect()
}

hashExistingPasswords().catch(error => {
  console.error('Error hashing passwords:', error)
  prisma.$disconnect()
  process.exit(1)
})
