import 'dotenv/config'
import { prisma } from '../index'
import { hashPassword } from '../../shared/functions/auth'

async function hashExistingPasswords() {
  console.log('Starting password hashing script...')

  const users = await prisma.user.findMany()

  if (users.length === 0) {
    console.log('No users found in database')
    return
  }

  console.log(`Found ${users.length} users. Hashing passwords...`)

  for (const user of users) {
    const hashedPassword = await hashPassword(user.password)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    console.log(`✓ Hashed password for user: ${user.email}`)
  }

  console.log('Password hashing complete!')
  await prisma.$disconnect()
}

hashExistingPasswords().catch(error => {
  console.error('Error hashing passwords:', error)
  prisma.$disconnect()
  process.exit(1)
})
