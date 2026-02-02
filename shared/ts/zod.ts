// CORE
import * as z from 'zod'
// CONSTANTS
import {
  MEDICINE_FORM_ERRORS,
  PRESENTATION_FORM_ERRORS,
  SETTINGS_FORM_ERRORS,
  USER_FORM_ERRORS
} from '@shared-constants/forms'

// MEDCINE SCHEMA
export const MedicineSchema = z.object({
  id: z.number().int().optional(),
  name: z
    .string(MEDICINE_FORM_ERRORS.NAME_REQUIRED)
    .min(1, MEDICINE_FORM_ERRORS.NAME_MIN)
    .max(50, MEDICINE_FORM_ERRORS.NAME_MAX),
  laboratory: z.string().max(50, MEDICINE_FORM_ERRORS.LABORATORY_MAX).nullable(),
  presentation: z.number(MEDICINE_FORM_ERRORS.PRESENTATION_REQUIRED).int(),
  expirationDate: z.date().nullable(),
  usedFor: z.string().max(75, MEDICINE_FORM_ERRORS.USED_FOR_MAX).nullable(),
  sideEffects: z.string().max(100, MEDICINE_FORM_ERRORS.SIDE_EFFECTS_MAX).nullable(),
  comments: z.string().max(200, MEDICINE_FORM_ERRORS.COMMENTS_MAX).nullable()
})

export type MedicineType = z.infer<typeof MedicineSchema>

export type MedicineTypeExtended = MedicineType & {
  medicinePresentation?: {
    id: number
    description: string
  }
}

export const MedicinePresentationSchema = z.object({
  id: z.number().int().optional(),
  description: z
    .string(PRESENTATION_FORM_ERRORS.DESCRIPTION_REQUIRED)
    .min(1, PRESENTATION_FORM_ERRORS.DESCRIPTION_MIN)
    .max(50, PRESENTATION_FORM_ERRORS.DESCRIPTION_MAX)
})

export type MedicinePresentationType = z.infer<typeof MedicinePresentationSchema>

export const SettingsSchema = z.object({
  id: z.number().int().optional(),
  daysToNotify: z
    .number(SETTINGS_FORM_ERRORS.DAYS_TO_NOTIFY_REQUIRED)
    .int()
    .min(1, SETTINGS_FORM_ERRORS.DAYS_TO_NOTIFY_MIN)
    .max(365, SETTINGS_FORM_ERRORS.DAYS_TO_NOTIFY_MAX)
})

export type SettingsType = z.infer<typeof SettingsSchema>

export const UserSchema = z.object({
  id: z.number().int().optional(),
  name: z
    .string(USER_FORM_ERRORS.NAME_REQUIRED)
    .min(1, USER_FORM_ERRORS.NAME_MIN)
    .max(100, USER_FORM_ERRORS.NAME_MAX),
  lastName: z.string().max(100, USER_FORM_ERRORS.LAST_NAME_MAX).nullable(),
  password: z
    .string(USER_FORM_ERRORS.PASSWORD_REQUIRED)
    .min(8, USER_FORM_ERRORS.PASSWORD_MIN)
    .max(100, USER_FORM_ERRORS.PASSWORD_MAX),
  email: z.email(USER_FORM_ERRORS.EMAIL_INVALID).max(100, USER_FORM_ERRORS.EMAIL_MAX),
  daysToNotify: z
    .number(USER_FORM_ERRORS.DAYS_TO_NOTIFY_REQUIRED)
    .int()
    .min(1, USER_FORM_ERRORS.DAYS_TO_NOTIFY_MIN)
    .max(365, USER_FORM_ERRORS.DAYS_TO_NOTIFY_MAX)
})

export type UserType = z.infer<typeof UserSchema>
