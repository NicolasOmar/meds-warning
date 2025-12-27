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
