/**
 * Prisma Zod Generator - Single File (inlined)
 * Auto-generated. Do not edit.
 */

import * as z from 'zod';
// File: Medicine.schema.ts

export const MedicineSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  laboratory: z.string().nullish(),
  presentation: z.string().nullish(),
  expirationDate: z.date().nullish(),
  usedFor: z.string().nullish(),
  sideEffects: z.string().nullish(),
  comments: z.string().nullish(),
});

export type MedicineType = z.infer<typeof MedicineSchema>;


// File: User.schema.ts

export const UserSchema = z.object({
  email: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;


// File: UserForm.schema.ts

export const UserFormSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  lastName: z.string().nullish(),
  likedMovie: z.string().nullish(),
  email: z.string(),
});

export type UserFormType = z.infer<typeof UserFormSchema>;

