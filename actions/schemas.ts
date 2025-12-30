import z from 'zod'

export const signUpFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  lastName: z.string().optional(),
  likedMovie: z.string().optional(),
  email: z.email('Invalid email address')
})

export type userFormType = z.infer<typeof signUpFormSchema>

export const medicineFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  laboratory: z.string().optional(),
  presentation: z.string().optional(),
  expirationDate: z.string().optional(),
  usedFor: z.string().optional(),
  sideEffects: z.string().optional(),
  comments: z.string().optional()
})

export type MedicineFormType = z.infer<typeof medicineFormSchema>
