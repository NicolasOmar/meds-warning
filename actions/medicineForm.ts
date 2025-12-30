import { MedicineActionState } from '@ts/forms'
import { medicineFormSchema } from './schemas'
import { prisma } from '@prisma/index'

export async function createUserForm(
  _: MedicineActionState,
  formData: FormData
): Promise<MedicineActionState> {
  // Validate
  const validatedFields = medicineFormSchema.safeParse({
    name: formData.get('name'),
    laboratory: formData.get('laboratory'),
    presentation: formData.get('presentation'),
    expirationDate: formData.get('expirationDate'),
    usedFor: formData.get('usedFor'),
    sideEffects: formData.get('sideEffects'),
    comments: formData.get('comments')
  })

  // Handle Failure
  if (!validatedFields.success) {
    console.warn(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Subscribe.'
    }
  }

  const medicineAlreadyCreated = await prisma.medicine.findFirst({
    where: { name: validatedFields.data.name as string }
  })

  if (medicineAlreadyCreated === null) {
    await prisma.medicine.create({
      data: { name: validatedFields.data.name as string }
    })

    await prisma.medicine.create({
      data: {
        name: validatedFields.data.name as string,
        laboratory: validatedFields.data.laboratory as string,
        presentation: validatedFields.data.presentation as string,
        expirationDate: validatedFields.data.expirationDate as string,
        usedFor: validatedFields.data.usedFor as string,
        sideEffects: validatedFields.data.sideEffects as string,
        comments: validatedFields.data.comments as string
      }
    })

    return {
      // message: `You have been subscribed successfully with your email [${validatedFields.data.email}]!`
      message: `Success`
    }
  }

  return {
    message: `Error`
  }
}
