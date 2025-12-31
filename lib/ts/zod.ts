// CORE
import * as z from 'zod'
// CONSTANTS
import { MEDICINE_FORM_ERRORS } from '@constants/labels'

export const MedicineSchema = z.object({
  id: z.number().int().optional(),
  name: z
    .string(MEDICINE_FORM_ERRORS.NAME_REQUIRED)
    .min(1, MEDICINE_FORM_ERRORS.NAME_MIN)
    .max(50, MEDICINE_FORM_ERRORS.NAME_MAX),
  laboratory: z.string().max(50, MEDICINE_FORM_ERRORS.LABORATORY_MAX).nullable(),
  presentation: z.string().max(50, MEDICINE_FORM_ERRORS.PRESENTATION_MAX).nullable(),
  expirationDate: z.date().nullable(),
  usedFor: z.string().max(75, MEDICINE_FORM_ERRORS.USED_FOR_MAX).nullable(),
  sideEffects: z.string().max(100, MEDICINE_FORM_ERRORS.SIDE_EFFECTS_MAX).nullable(),
  comments: z.string().max(200, MEDICINE_FORM_ERRORS.COMMENTS_MAX).nullable()
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
