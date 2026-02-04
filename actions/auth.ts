'use server'
// CORE
import * as z from 'zod'
import { redirect } from 'next/navigation'
import { prisma } from '@prisma/index'
// SHARED
import { LoginSchema } from '@shared-types/zod'
import { LoginActionState } from '@shared-types/states'
import { LOGIN_FORM_LABELS } from '@shared-constants/forms'
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { ROUTE_URLS } from '@shared-constants/routes'
import { AUTH_ERROR_MESSAGES } from '@shared-constants/auth'
import {
  comparePassword,
  generateJWT,
  setAuthCookie,
  clearAuthCookie
} from '@shared-functions/auth'

export async function handleLoginAction(
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const validatedLoginObject = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })

  if (!validatedLoginObject.success) {
    return {
      errors: z.flattenError(validatedLoginObject.error).fieldErrors,
      message: COMMON_FORM_ERRORS.FORM_INPUTS_ERROR,
      success: false
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: validatedLoginObject.data.email }
    })

    if (!user || !(await comparePassword(validatedLoginObject.data.password, user.password))) {
      return {
        message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
        success: false
      }
    }

    const token = generateJWT({
      userId: user.id,
      email: user.email,
      name: user.name
    })

    await setAuthCookie(token)

    return {
      message: LOGIN_FORM_LABELS.SUCCESS,
      success: true
    }
  } catch (error: unknown) {
    let errorMessage: string = COMMON_FORM_ERRORS.SUBMISSION_ERROR

    if (error instanceof Error && error.message.length > 0) {
      errorMessage = error.message
    }

    return { message: errorMessage, success: false }
  }
}

export async function handleLogoutAction(): Promise<void> {
  await clearAuthCookie()
  redirect(ROUTE_URLS.LOGIN)
}
