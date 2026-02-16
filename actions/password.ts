'use server'
// CORE
import * as z from 'zod'
import { prisma } from '@prisma/index'
// SHARED
import { ForgotPasswordSchema, ResetPasswordSchema } from '@shared-types/zod'
import { ForgotPasswordActionState, ResetPasswordActionState } from '@shared-types/states'
import {
  FORGOT_PASSWORD_FORM_LABELS,
  RESET_PASSWORD_FORM_LABELS,
  RESET_PASSWORD_FORM_ERRORS
} from '@shared-constants/forms'
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { generateJWT, hashPassword, verifyJWT } from '@shared-functions/auth'
import { EmailTemplateName, sendTemplateEmail } from '@shared-functions/email'

export async function handleForgotPasswordAction(
  _: ForgotPasswordActionState,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const validatedData = ForgotPasswordSchema.safeParse({
    email: formData.get('email')
  })

  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      message: COMMON_FORM_ERRORS.FORM_INPUTS_ERROR,
      success: false
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: validatedData.data.email }
    })

    if (user) {
      const resetToken = generateJWT({
        userId: user.id,
        email: user.email,
        name: user.name
      })

      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry
        }
      })

      await sendTemplateEmail({
        nameRecipient: user.name,
        emailRecipient: user.email,
        subject: 'Password Reset Request',
        templateName: EmailTemplateName.PasswordReset,
        templateVariables: {
          userName: user.name,
          resetPasswordUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/password/reset/${resetToken}`
        }
      })
    }

    return {
      message: FORGOT_PASSWORD_FORM_LABELS.SUCCESS,
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

export async function handleResetPasswordAction(
  _: ResetPasswordActionState,
  formData: FormData
): Promise<ResetPasswordActionState> {
  const validatedData = ResetPasswordSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  })

  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      message: COMMON_FORM_ERRORS.FORM_INPUTS_ERROR,
      success: false
    }
  }

  try {
    const payload = verifyJWT(validatedData.data.token)

    if (!payload) {
      return {
        message: RESET_PASSWORD_FORM_ERRORS.INVALID_TOKEN,
        success: false
      }
    }

    const user = await prisma.user.findFirst({
      where: {
        id: payload.userId,
        resetToken: validatedData.data.token,
        resetTokenExpiry: {
          gte: new Date()
        }
      }
    })

    if (!user) {
      return {
        message: RESET_PASSWORD_FORM_ERRORS.INVALID_TOKEN,
        success: false
      }
    }

    const hashedPassword = await hashPassword(validatedData.data.password)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return {
      message: RESET_PASSWORD_FORM_LABELS.SUCCESS,
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
