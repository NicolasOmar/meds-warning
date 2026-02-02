'use server'
// CORE
import * as z from 'zod'
import { prisma } from '@prisma/index'
import { revalidatePath } from 'next/cache'
// SHARED
import { UserSchema } from '@shared-types/zod'
import { UserActionState } from '@shared-types/states'
import { USER_FORM_LABELS } from '@shared-constants/forms'
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { ROUTE_URLS } from '@shared-constants/routes'
import { parseEmptyFormValueToNull } from '@shared-functions/helpers'

export async function handleUserAction(
  _: UserActionState,
  formData: FormData,
  id?: string
): Promise<UserActionState> {
  const validatedUserObject = UserSchema.safeParse({
    name: parseEmptyFormValueToNull(formData.get('name')),
    lastName: parseEmptyFormValueToNull(formData.get('lastName')),
    password: parseEmptyFormValueToNull(formData.get('password')),
    email: parseEmptyFormValueToNull(formData.get('email')),
    daysToNotify: parseEmptyFormValueToNull(formData.get('daysToNotify'))
      ? +(formData.get('daysToNotify') as string)
      : null
  })

  if (!validatedUserObject.success) {
    return {
      errors: z.flattenError(validatedUserObject.error).fieldErrors,
      message: COMMON_FORM_ERRORS.FORM_INPUTS_ERROR,
      success: false
    }
  }

  const userData = {
    name: validatedUserObject.data.name,
    lastName: validatedUserObject.data.lastName,
    password: validatedUserObject.data.password,
    email: validatedUserObject.data.email,
    daysToNotify: validatedUserObject.data.daysToNotify
  }

  try {
    if (id) {
      await prisma.userForm.update({
        where: { id: +id },
        data: userData
      })
    } else {
      await prisma.userForm.create({
        data: userData
      })
    }

    revalidatePath(ROUTE_URLS.USER_LIST)

    return {
      message: id ? USER_FORM_LABELS.UPDATE_SUCCESS : USER_FORM_LABELS.CREATE_SUCCESS,
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

export async function getUsers(email?: string) {
  return await prisma.userForm.findMany({
    where: {
      email: {
        contains: email ?? '',
        mode: 'insensitive'
      }
    }
  })
}
