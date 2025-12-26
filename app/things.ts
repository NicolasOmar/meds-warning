import z from 'zod'

export const signUpFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  lastName: z.string().optional(),
  likedMovie: z.string().optional(),
  email: z.email('Invalid email address')
})

export type SignUpActionState = {
  errors?: {
    name?: string[]
    lastName?: string[]
    likedMovie?: string[]
    email?: string[]
  }
  message?: string
}
