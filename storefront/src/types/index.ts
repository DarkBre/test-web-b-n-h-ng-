export type User = {
  name: string
  email: string
  role: AccountRole
}

export type AccountRole = 'customer' | 'admin'

export type AuthResult = {
  ok: boolean
  message: string
}
