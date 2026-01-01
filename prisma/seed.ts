import { prisma } from '.'

async function main() {
  await prisma.medicinePresentation.create({
    data: {
      description: 'Pills'
    }
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
