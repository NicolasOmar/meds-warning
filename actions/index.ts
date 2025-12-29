'use server'
// CORE
import { prisma } from '@prisma/index'
// SCHEMAS
import { signUpFormSchema } from './schemas'
// TYPES & ENUMS
import { FindUserActionState, SignUpActionState } from 'ts/forms'

export async function createUserForm(
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

export async function updateUserForm(
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
      message: 'Missing Fields. Failed to Update User.'
    }
  }

  await prisma.userForm.updateMany({
    where: { email: validatedFields.data.email as string },
    data: {
      name: validatedFields.data.name as string,
      lastName: validatedFields.data.lastName as string,
      likedMovie: validatedFields.data.likedMovie as string
    }
  })

  return {
    message: `User with email [${validatedFields.data.email}] has been updated successfully!`
  }
}

export async function subscribeFindUserForm(
  _: FindUserActionState,
  formData: FormData
): Promise<FindUserActionState> {
  const email = formData.get('search') as string

  const userFound = await prisma.userForm.findFirst({
    where: { email: email }
  })

  if (userFound) {
    return {
      email: userFound.email,
      message: `User found: Name - ${userFound.name}, Last Name - ${userFound.lastName}, Liked Movie - ${userFound.likedMovie}, Email - ${userFound.email}`
    }
  } else {
    return {
      message: `No user found with the email [${email}].`
    }
  }
}
