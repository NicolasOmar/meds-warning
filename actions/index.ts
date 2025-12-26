'use server'

import { SignUpActionState } from 'ts/forms'
import { signUpFormSchema } from './schemas'
import { prisma } from '@prisma/index'

export async function subscribeUserForm(
  _: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> {
  // Validate
  const validatedFields = signUpFormSchema.safeParse({
    name: formData.get('name'),
    lastName: formData.get('lastName'),
    likedMovie: formData.get('likedMovie'),
    email: formData.get('email')
  })

  // Handle Failure
  if (!validatedFields.success) {
    console.warn(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Subscribe.'
    }
  }

  const userAlreadyCreated = await prisma.user.findUnique({
    where: { email: validatedFields.data.email as string }
  })

  if (userAlreadyCreated === null) {
    await prisma.user.create({
      data: { email: validatedFields.data.email as string }
    })

    await prisma.userForm.create({
      data: {
        name: validatedFields.data.name as string,
        lastName: validatedFields.data.lastName as string,
        likedMovie: validatedFields.data.likedMovie as string,
        email: validatedFields.data.email as string
      }
    })

    return {
      message: `You have been subscribed successfully with your email [${validatedFields.data.email}]!`
    }
  }

  return {
    message: `Sorry, your email [${validatedFields.data.email}] has been already subscribed!`
  }
}

export async function subscribeFindUserForm(
  _: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> {
  const email = formData.get('search') as string

  const userFound = await prisma.userForm.findFirst({
    where: { email: email }
  })

  if (userFound) {
    return {
      message: `User found: Name - ${userFound.name}, Last Name - ${userFound.lastName}, Liked Movie - ${userFound.likedMovie}, Email - ${userFound.email}`
    }
  } else {
    return {
      message: `No user found with the email [${email}].`
    }
  }
}
