'use server'
import * as z from 'zod'
// SHARED
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { SETTINGS_FORM_LABELS } from '@shared-constants/forms'
import { SettingsActionState } from '@shared-types/states'
import { SettingsSchema } from '@shared-types/zod'
import { ROUTE_URLS } from '@shared-constants/routes'
import { prisma } from '@prisma/index'
import { revalidatePath } from 'next/cache'
import { getSession } from '@shared-functions/auth'

export async function updateSettings(
  _: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const validatedSettingsObject = SettingsSchema.safeParse({
    daysToNotify: Number(formData.get('daysToNotify'))
  })

  // Handle Failure
  if (!validatedSettingsObject.success) {
    return {
      errors: z.flattenError(validatedSettingsObject.error).fieldErrors,
      message: COMMON_FORM_ERRORS.FORM_INPUTS_ERROR,
      success: false
    }
  }

  const session = await getSession()

  try {
    await prisma.user.update({
      where: { id: session!.user.id },
      data: {
        daysToNotify: validatedSettingsObject.data.daysToNotify
      }
    })

    revalidatePath(ROUTE_URLS.SETTINGS_ROOT)
  } catch (error) {
    let errorMessage = null

    if (error instanceof Error) {
      errorMessage = error.message.length > 0 ? error.message : COMMON_FORM_ERRORS.SUBMISSION_ERROR
    } else {
      errorMessage = COMMON_FORM_ERRORS.SUBMISSION_ERROR
    }

    return { message: errorMessage, success: false }
  }

  // Simulate successful update
  return {
    message: SETTINGS_FORM_LABELS.UPDATE_SUCCESS,
    success: true
  }
}
