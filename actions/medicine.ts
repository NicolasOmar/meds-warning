'use server'
// CORE
import { prisma } from '@prisma/index'
import * as z from 'zod'
// SHARED
import { MedicineSchema } from '@shared-types/zod'
import { MedicineActionState } from '@shared-types/states'
import { COMMON_FORM_ERRORS, MEDICINE_FORM_LABELS } from '@shared-constants/labels'

const parseEmptyFormValueToNull = (value: FormDataEntryValue | null) => {
  return value === '' || value === null ? null : value
}

export async function createMedicineAction(
  _: MedicineActionState,
  formData: FormData,
  id?: string
): Promise<MedicineActionState> {
  const expirationDate = formData.get('expirationDate')
    ? new Date(formData.get('expirationDate') as string)
    : null

  const validatedFields = MedicineSchema.safeParse({
    name: parseEmptyFormValueToNull(formData.get('name')),
    laboratory: parseEmptyFormValueToNull(formData.get('laboratory')),
    presentation: parseEmptyFormValueToNull(formData.get('presentation'))
      ? +(formData.get('presentation') as string)
      : null,
    expirationDate,
    usedFor: parseEmptyFormValueToNull(formData.get('usedFor')),
    sideEffects: parseEmptyFormValueToNull(formData.get('sideEffects')),
    comments: parseEmptyFormValueToNull(formData.get('comments'))
  })

  // Handle Failure
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: COMMON_FORM_ERRORS.FORM_INPUTS_ERROR
    }
  }

  const medicineData = {
    name: validatedFields.data.name,
    laboratory: validatedFields.data.laboratory,
    presentation: validatedFields.data.presentation,
    expirationDate,
    usedFor: validatedFields.data.usedFor,
    sideEffects: validatedFields.data.sideEffects,
    comments: validatedFields.data.comments
  }

  try {
    if (id) {
      await prisma.medicine.update({
        where: { id: parseInt(id, 10) },
        data: medicineData
      })
    } else {
      await prisma.medicine.create({
        data: medicineData
      })
    }

    return {
      message: id ? MEDICINE_FORM_LABELS.UPDATE_SUCCESS : MEDICINE_FORM_LABELS.CREATE_SUCCESS
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    return {
      message: errorMessage || COMMON_FORM_ERRORS.SUBMISSION_ERROR
    }
  }
}
