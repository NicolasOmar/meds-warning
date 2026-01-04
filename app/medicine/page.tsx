// CORE
import { prisma } from '@prisma/index'
// COMPONENTS
import MedicineForm from '@form-components/MedicineForm'

export default async function MedicinePage() {
  const presentationsList = await prisma.medicinePresentation.findMany({})

  return <MedicineForm presentationsList={presentationsList} />
}
