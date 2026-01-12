'use server'
// CORE
import * as z from 'zod'
import { prisma } from '@prisma/index'
// SHARED
import { COMMON_FORM_ERRORS } from '@shared-constants/labels'
import { PresentationActionState } from '@shared-types/states'
import { MedicinePresentationSchema } from '@shared-types/zod'
import { parseEmptyFormValueToNull } from '@shared-functions/helpers'

export async function createPresentationAction(
  _: PresentationActionState,
  formData: FormData
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
        message: 'Presentation with this description already exists',
        success: false
      }
    }

    await prisma.medicinePresentation.create({
      data: presentationData
    })

    // revalidatePath(ROUTES.PRESENTATION_LIST)

    return {
      message: 'Successfully created presentation',
      success: true
    }
  } catch (error: unknown) {
    let errorMessage = null
    console.warn(error)
    if (error instanceof Error) {
      errorMessage = error.message.length > 0 ? error.message : COMMON_FORM_ERRORS.SUBMISSION_ERROR
    } else {
      errorMessage = COMMON_FORM_ERRORS.SUBMISSION_ERROR
    }

    return { message: errorMessage, success: false }
  }
}
