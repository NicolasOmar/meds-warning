export type SignUpActionState = {
  errors?: {
    name?: string[]
    lastName?: string[]
    likedMovie?: string[]
    email?: string[]
  }
  message?: string
}

export type FindUserActionState = {
  email?: string
  message?: string
}

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
