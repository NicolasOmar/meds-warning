export type BaseActionState = {
  message?: string
  success?: boolean
}

export type MedicineActionState = BaseActionState & {
  errors?: {
    name?: string[]
    laboratory?: string[]
    presentation?: string[]
    expirationDate?: string[]
    usedFor?: string[]
    sideEffects?: string[]
    comments?: string[]
  }
}

export type PresentationActionState = BaseActionState & {
  errors?: {
    description?: string[]
  }
}

export type ExpirationDateActionState = BaseActionState & {
  errors?: {
    expirationDate?: string[]
  }
}
