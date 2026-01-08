import { prisma } from '.'

async function main() {
  await prisma.medicinePresentation.createMany({
    data: [
      { description: 'Pills' },
      { description: 'Injection' },
      { description: 'Topical' },
      { description: 'Inhalation' }
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
