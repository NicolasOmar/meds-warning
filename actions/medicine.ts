'use server'
// CORE
import * as z from 'zod'
import { prisma } from '@prisma/index'
import { revalidatePath } from 'next/cache'
// SHARED
import { MedicineSchema } from '@shared-types/zod'
import { ExpirationDateActionState, MedicineActionState } from '@shared-types/states'
import { MEDICINE_FORM_LABELS } from '@shared-constants/forms'
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { MEDICINE_TABLE_ERRORS, MEDICINE_TABLE_LABELS } from '@shared-constants/tables'
import { ROUTE_URLS } from '@shared-constants/routes'
import { parseEmptyFormValueToNull } from '@shared-functions/helpers'
import { getSession } from '@shared-functions/auth'

export async function handleMedicineAction(
  _: MedicineActionState,
  formData: FormData,
  id?: string
): Promise<MedicineActionState> {
  const expirationDate = formData.get('expirationDate')
    ? new Date(formData.get('expirationDate') as string)
    : null

  const validatedMedicineObject = MedicineSchema.safeParse({
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
  if (!validatedMedicineObject.success) {
    return {
      errors: z.flattenError(validatedMedicineObject.error).fieldErrors,
      message: COMMON_FORM_ERRORS.FORM_INPUTS_ERROR,
      success: false
    }
  }

  const medicineData = {
    name: validatedMedicineObject.data.name,
    laboratory: validatedMedicineObject.data.laboratory,
    presentation: validatedMedicineObject.data.presentation,
    expirationDate,
    usedFor: validatedMedicineObject.data.usedFor,
    sideEffects: validatedMedicineObject.data.sideEffects,
    comments: validatedMedicineObject.data.comments
  }

  const session = await getSession()

  try {
    if (id) {
      await prisma.medicine.update({
        where: { id: +id, userId: session!.user.id },
        data: medicineData
      })
    } else {
      await prisma.medicine.create({
        data: { ...medicineData, userId: session!.user.id }
      })
    }

    revalidatePath(ROUTE_URLS.MEDICINE_LIST)

    return {
      message: id ? MEDICINE_FORM_LABELS.UPDATE_SUCCESS : MEDICINE_FORM_LABELS.CREATE_SUCCESS,
      success: true
    }
  } catch (error: unknown) {
    let errorMessage = null

    if (error instanceof Error) {
      errorMessage = error.message.length > 0 ? error.message : COMMON_FORM_ERRORS.SUBMISSION_ERROR
    } else {
      errorMessage = COMMON_FORM_ERRORS.SUBMISSION_ERROR
    }

    return { message: errorMessage, success: false }
  }
}

export async function deleteMedicine(id: number): Promise<MedicineActionState> {
  const session = await getSession()

  try {
    await prisma.medicine.delete({
      where: { id, userId: session!.user.id }
    })

    revalidatePath(ROUTE_URLS.MEDICINE_LIST)

    return { message: MEDICINE_TABLE_LABELS.DELETE_SUCCESS, success: true }
  } catch (error: unknown) {
    let errorMessage = null

    if (error instanceof Error) {
      errorMessage = error.message.length > 0 ? error.message : MEDICINE_TABLE_ERRORS.DELETE_ERROR
    } else {
      errorMessage = MEDICINE_TABLE_ERRORS.DELETE_ERROR
    }

    return { message: errorMessage, success: false }
  }
}

export async function getMedicines(name?: string) {
  const session = await getSession()

  return await prisma.medicine.findMany({
    where: {
      userId: session!.user.id,
      name: {
        contains: name ?? '',
        mode: 'insensitive'
      }
    },
    include: {
      medicinePresentation: true
    }
  })
}

export async function handleExpirationDateAction(
  _: ExpirationDateActionState,
  formData: FormData
): Promise<ExpirationDateActionState> {
  const medicineId = formData.get('medicineId') as string
  const expirationDate = formData.get('expirationDate')
    ? new Date(formData.get('expirationDate') as string)
    : null

  const session = await getSession()

  try {
    await prisma.medicine.update({
      where: { id: +medicineId, userId: session!.user.id },
      data: { expirationDate }
    })

    revalidatePath(ROUTE_URLS.MEDICINE_LIST)

    return {
      message: MEDICINE_FORM_LABELS.UPDATE_SUCCESS,
      success: true
    }
  } catch (error: unknown) {
    let errorMessage = null

    if (error instanceof Error) {
      errorMessage = error.message.length > 0 ? error.message : COMMON_FORM_ERRORS.SUBMISSION_ERROR
    } else {
      errorMessage = COMMON_FORM_ERRORS.SUBMISSION_ERROR
    }

    return { message: errorMessage, success: false }
  }
}
