'use server'
// CORE
import { prisma } from '@prisma/index'
import * as z from 'zod'
// SCHEMAS
import { MedicineSchema } from '@ts/zod'
// LIBRARY
import { MedicineActionState } from '@ts/states'

const parseEmptyStringToNull = (value: FormDataEntryValue | null) => {
  return value === '' ? null : value
}

export async function createMedicineAction(
  _: MedicineActionState,
  formData: FormData
): Promise<MedicineActionState> {
  const expirationDate = formData.get('expirationDate')
    ? new Date(formData.get('expirationDate') as string)
    : null

  const validatedFields = MedicineSchema.safeParse({
    name: parseEmptyStringToNull(formData.get('name')),
    laboratory: parseEmptyStringToNull(formData.get('laboratory')),
    presentation: parseEmptyStringToNull(formData.get('presentation')),
    expirationDate,
    usedFor: parseEmptyStringToNull(formData.get('usedFor')),
    sideEffects: parseEmptyStringToNull(formData.get('sideEffects')),
    comments: parseEmptyStringToNull(formData.get('comments'))
  })

  // Handle Failure
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: 'Missing Fields. Failed to Subscribe.'
    }
  }

  const medicineAlreadyCreated = await prisma.medicine.findFirst({
    where: { name: validatedFields.data.name as string }
  })

  if (medicineAlreadyCreated === null) {
    await prisma.medicine.create({
      data: {
        name: validatedFields.data.name,
        laboratory: validatedFields.data.laboratory ?? null,
        presentation: validatedFields.data.presentation ?? null,
        expirationDate,
        usedFor: validatedFields.data.usedFor ?? null,
        sideEffects: validatedFields.data.sideEffects ?? null,
        comments: validatedFields.data.comments ?? null
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
