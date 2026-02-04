export interface JWTPayload {
  userId: number
  email: string
  name: string
  iat: number
  exp: number
}

export interface Session {
  user: {
    id: number
    email: string
    name: string
  }
}
