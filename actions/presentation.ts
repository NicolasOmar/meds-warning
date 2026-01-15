'use server'
// CORE
import * as z from 'zod'
import { prisma } from '@prisma/index'
import { revalidatePath } from 'next/cache'
// SHARED
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { MedicineActionState, PresentationActionState } from '@shared-types/states'
import { MedicinePresentationSchema, MedicinePresentationType } from '@shared-types/zod'
import { parseEmptyFormValueToNull } from '@shared-functions/helpers'
import { PRESENTATION_FORM_ERRORS, PRESENTATION_FORM_LABELS } from '@shared-constants/forms'
import { ROUTES } from '@shared-constants/routes'
import { MEDICINE_PRESENTATION_TABLE_LABELS } from '@shared-constants/tables'

export async function handlePresentationAction(
  _: PresentationActionState,
  formData: FormData,
  id?: string
): Promise<PresentationActionState> {
  const validatedPresentationObject = MedicinePresentationSchema.safeParse({
    description: parseEmptyFormValueToNull(formData.get('description'))
  })

  // Handle Failure
  if (!validatedPresentationObject.success) {
    return {
      errors: z.flattenError(validatedPresentationObject.error).fieldErrors,
      message: COMMON_FORM_ERRORS.FORM_INPUTS_ERROR,
      success: false
    }
  }

  const presentationData = {
    id: validatedPresentationObject.data.id,
    description: validatedPresentationObject.data.description
  }

  try {
    const presentationAlreadyExists = await prisma.medicinePresentation.findFirst({
      where: { description: presentationData.description }
    })

    if (presentationAlreadyExists) {
      return {
        message: PRESENTATION_FORM_ERRORS.ALREADY_CREATED,
        success: false
      }
    }

    if (id) {
      await prisma.medicinePresentation.update({
        where: { id: +id },
        data: presentationData
      })
    } else {
      await prisma.medicinePresentation.create({
        data: presentationData
      })
    }

    revalidatePath(ROUTES.PRESENTATION_LIST)

    return {
      message: id
        ? PRESENTATION_FORM_LABELS.UPDATE_SUCCESS
        : PRESENTATION_FORM_LABELS.CREATE_SUCCESS,
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

export async function deletePresentation(presentationId: number): Promise<MedicineActionState> {
  try {
    const availablePresentations = await prisma.medicine.findMany()
    const presentation = availablePresentations.filter(
      presentationItem => presentationItem.presentation !== presentationId
    )[0]

    await prisma.medicine.updateMany({
      where: { presentation: presentationId },
      data: { presentation: presentation.id }
    })

    await prisma.medicinePresentation.delete({
      where: { id: presentationId }
    })

    revalidatePath(ROUTES.PRESENTATION_LIST)

    return { message: MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_SUCCESS, success: true }
  } catch (error: unknown) {
    let errorMessage = null

    if (error instanceof Error) {
      errorMessage =
        error.message.length > 0 ? error.message : MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_ERROR
    } else {
      errorMessage = MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_ERROR
    }

    return { message: errorMessage, success: false }
  }
}

export async function getPresentations(): Promise<MedicinePresentationType[]> {
  return prisma.medicinePresentation.findMany()
}
