import {prisma} from '../prisma/index'

export const getAllMedicinePresentations = async () => {
  const presentations = await prisma.medicinePresentation.findMany()
  return presentations
}