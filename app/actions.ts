'use server'

import { SignUpActionState, signUpFormSchema } from './things'

export async function subscribe(
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
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Subscribe.'
    }
  }

  // Handle Success (e.g., save to DB)
  // await db.subscribe(validatedFields.data.email)

  return {
    message: 'You have been subscribed successfully!'
  }
}
