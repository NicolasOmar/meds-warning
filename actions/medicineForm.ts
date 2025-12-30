'use server'
// CORE
import { prisma } from '@prisma/index'
// SCHEMAS
import { MedicineSchema } from '@schemas/index'
// LIBRARY
import { MedicineActionState } from '@ts/forms'

export async function createMedicineAction(
  _: MedicineActionState,
  formData: FormData
): Promise<MedicineActionState> {
  // Validate
  const validatedFields = MedicineSchema.safeParse({
    name: formData.get('name'),
    laboratory: formData.get('laboratory'),
    presentation: formData.get('presentation'),
    expirationDate: formData.get('expirationDate'),
    usedFor: formData.get('usedFor'),
    sideEffects: formData.get('sideEffects'),
    comments: formData.get('comments')
  })

  console.warn(
    validatedFields.error,
    formData.get('name'),
    formData.get('laboratory'),
    formData.get('presentation'),
    formData.get('expirationDate'),
    formData.get('usedFor'),
    formData.get('sideEffects'),
    formData.get('comments')
  )

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
    const expirationDate = validatedFields.data.expirationDate
      ? new Date(validatedFields.data.expirationDate)
      : new Date()

    await prisma.medicine.create({
      data: {
        name: validatedFields.data.name as string,
        laboratory: validatedFields.data.laboratory as string,
        presentation: validatedFields.data.presentation as string,
        expirationDate,
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
