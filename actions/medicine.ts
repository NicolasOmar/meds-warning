'use server'
// CORE
import { prisma } from '@prisma/index'
import * as z from 'zod'
// SCHEMAS
import { MedicineSchema } from '@ts/zod'
// LIBRARY
import { MedicineActionState } from '@ts/states'
import { COMMON_FORM_ERRORS, MEDICINE_FORM_LABELS } from '@constants/labels'

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
      message: COMMON_FORM_ERRORS.FORM_INPUTS_ERROR
    }
  }

  await prisma.medicine.create({
    data: {
      name: validatedFields.data.name,
      laboratory: validatedFields.data.laboratory,
      presentation: +(validatedFields.data.presentation ?? 1),
      expirationDate,
      usedFor: validatedFields.data.usedFor,
      sideEffects: validatedFields.data.sideEffects,
      comments: validatedFields.data.comments
    }
  })

  return {
    message: MEDICINE_FORM_LABELS.SUCCESS
  }
}
