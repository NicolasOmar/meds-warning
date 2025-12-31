import * as z from 'zod'

export const MedicineSchema = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  laboratory: z.string().optional(),
  presentation: z.string().optional(),
  expirationDate: z.date().optional(),
  usedFor: z.string().optional(),
  sideEffects: z.string().optional(),
  comments: z.string().optional()
})

export type MedicineType = z.infer<typeof MedicineSchema>

export const UserSchema = z.object({
  email: z.string()
})

export type UserType = z.infer<typeof UserSchema>

export const UserFormSchema = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  lastName: z.string().optional(),
  likedMovie: z.string().optional(),
  email: z.string()
})

export type UserFormType = z.infer<typeof UserFormSchema>
