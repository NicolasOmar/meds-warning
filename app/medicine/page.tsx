// CORE
// import { prisma } from '@prisma/index'
import { getAllMedicinePresentations } from 'api/medicine'
// COMPONENTS
import MedicineForm from '@form-components/MedicineForm'

export default async function MedicinePage() {
  const listOfData = await getAllMedicinePresentations()

  return <MedicineForm listOfPresentations={listOfData ?? []} />
}
