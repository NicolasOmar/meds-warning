'use server'
// CORE
import * as z from 'zod'
import { prisma } from '@prisma/index'
import { revalidatePath } from 'next/cache'
// SHARED
import { MedicineSchema } from '@shared-types/zod'
import { MedicineActionState } from '@shared-types/states'
import {
  COMMON_FORM_ERRORS,
  MEDICINE_FORM_LABELS,
  MEDICINE_TABLE_LABELS
} from '@shared-constants/labels'
import { ROUTES } from '@shared-constants/routes'

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
        where: { id: +id },
        data: medicineData
      })
    } else {
      await prisma.medicine.create({
        data: medicineData
      })
    }

    revalidatePath(ROUTES.MEDICINE_LIST)

    return {
      message: id ? MEDICINE_FORM_LABELS.UPDATE_SUCCESS : MEDICINE_FORM_LABELS.CREATE_SUCCESS
    }
  } catch (error: unknown) {
    let errorMessage = null

    if (error instanceof Error) {
      errorMessage = error.message.length > 0 ? error.message : COMMON_FORM_ERRORS.SUBMISSION_ERROR
    } else {
      errorMessage = COMMON_FORM_ERRORS.SUBMISSION_ERROR
    }

    return { message: errorMessage }
  }
}

export async function deleteMedicine(id: number): Promise<MedicineActionState> {
  try {
    await prisma.medicine.delete({
      where: { id }
    })

    revalidatePath(ROUTES.MEDICINE_LIST)

    return { message: MEDICINE_TABLE_LABELS.DELETE_SUCCESS }
  } catch (error: unknown) {
    let errorMessage = null

    if (error instanceof Error) {
      errorMessage = error.message.length > 0 ? error.message : MEDICINE_TABLE_LABELS.DELETE_ERROR
    } else {
      errorMessage = MEDICINE_TABLE_LABELS.DELETE_ERROR
    }

    return { message: errorMessage }
  }
}

export async function getMedicines() {
  return await prisma.medicine.findMany({
    include: {
      medicinePresentation: true
    }
  })
}
