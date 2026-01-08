export type MedicineActionState = {
  errors?: {
    name?: string[]
    laboratory?: string[]
    presentation?: string[]
    expirationDate?: string[]
    usedFor?: string[]
    sideEffects?: string[]
    comments?: string[]
  }
  message?: string
}
