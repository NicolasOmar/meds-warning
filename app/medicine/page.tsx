// CORE
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicineForm from '@form-components/MedicineForm'

export default async function MedicinePage() {
  const listOfData = await prisma.medicinePresentation.findMany()

  return <MedicineForm listOfPresentations={listOfData ?? []} />
}
