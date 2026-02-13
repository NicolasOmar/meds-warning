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

export type SettingsActionState = BaseActionState & {
  errors?: {
    daysToNotify?: string[]
  }
}

export type UserActionState = BaseActionState & {
  errors?: {
    name?: string[]
    lastName?: string[]
    password?: string[]
    repeatPassword?: string[]
    email?: string[]
    daysToNotify?: string[]
  }
}

export type LoginActionState = BaseActionState & {
  errors?: {
    email?: string[]
    password?: string[]
  }
}

export type ForgotPasswordActionState = BaseActionState & {
  errors?: {
    email?: string[]
  }
}

export type ResetPasswordActionState = BaseActionState & {
  errors?: {
    token?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
}
