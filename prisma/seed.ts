import { prisma } from '.'
import { hashPassword } from '../shared/functions/auth'

async function main() {
  const hashedPassword = await hashPassword('seed')

  const seedUser = await prisma.user.create({
    data: {
      name: 'Seed',
      lastName: 'User',
      email: 'seed@example.com',
      password: hashedPassword,
      daysToNotify: 30
    }
  })

  await prisma.medicinePresentation.createMany({
    data: [
      { description: 'Pills', userId: seedUser.id },
      { description: 'Injection', userId: seedUser.id },
      { description: 'Topical', userId: seedUser.id },
      { description: 'Inhalation', userId: seedUser.id }
    ]
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
