'use server'
// CORE
import * as z from 'zod'
import { prisma } from '@prisma/index'
// SHARED
import { UserSchema } from '@shared-types/zod'
import { UserActionState } from '@shared-types/states'
import { USER_FORM_ERRORS, USER_FORM_LABELS } from '@shared-constants/forms'
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { parseEmptyFormValueToNull } from '@shared-functions/helpers'
import { hashPassword, generateJWT, setAuthCookie } from '@shared-functions/auth'

export async function handleUserAction(
  _: UserActionState,
  formData: FormData,
  id?: string,
  email?: string
): Promise<UserActionState> {
  const isEditing = !!id
  const baseDaysToNotify = 30
  const formDataPassword = formData.get('password')
  const formDataRepeatPassword = formData.get('repeatPassword')

  if (!isEditing && formDataPassword !== formDataRepeatPassword) {
    return {
      message: USER_FORM_ERRORS.PASSWORDS_NOT_MATCH,
      success: false
    }
  }

  const validationData = isEditing
    ? {
        name: parseEmptyFormValueToNull(formData.get('name')),
        lastName: parseEmptyFormValueToNull(formData.get('lastName')),
        password: process.env.TEST_PASSWORD,
        email: parseEmptyFormValueToNull(email ?? null),
        daysToNotify: baseDaysToNotify
      }
    : {
        name: parseEmptyFormValueToNull(formData.get('name')),
        lastName: parseEmptyFormValueToNull(formData.get('lastName')),
        password: parseEmptyFormValueToNull(formData.get('password')),
        email: parseEmptyFormValueToNull(formData.get('email')),
        daysToNotify: baseDaysToNotify
      }

  const validatedUserObject = UserSchema.safeParse(validationData)

  if (!validatedUserObject.success) {
    return {
      errors: z.flattenError(validatedUserObject.error).fieldErrors,
      message: COMMON_FORM_ERRORS.FORM_INPUTS_ERROR,
      success: false
    }
  }

  try {
    if (isEditing) {
      await prisma.user.update({
        where: { id: +id },
        data: {
          name: validatedUserObject.data.name,
          lastName: validatedUserObject.data.lastName
        }
      })
    } else {
      const hashedPassword = await hashPassword(validatedUserObject.data.password)
      const userData = {
        name: validatedUserObject.data.name,
        lastName: validatedUserObject.data.lastName,
        password: hashedPassword,
        email: validatedUserObject.data.email,
        daysToNotify: validatedUserObject.data.daysToNotify
      }
      const user = await prisma.user.create({
        data: userData
      })

      await prisma.medicinePresentation.createMany({
        data: [
          { description: 'Pills', userId: user.id },
          { description: 'Injection', userId: user.id },
          { description: 'Topical', userId: user.id },
          { description: 'Inhalation', userId: user.id }
        ]
      })

      const token = generateJWT({
        userId: user.id,
        email: user.email,
        name: user.name
      })

      await setAuthCookie(token)
    }

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
  return await prisma.user.findMany({
    where: {
      email: {
        contains: email ?? '',
        mode: 'insensitive'
      }
    }
  })
}
