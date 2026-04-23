export type User = {
  name: string
  email: string
  role: AccountRole
}

export type AccountRole = 'customer' | 'admin'

export type Product = {
  id: number
  name: string
  category: string
  description: string
  price: number
  imageUrl: string
  stock: number
  badge: string | null
}

export type AuthResult = {
  ok: boolean
  message: string
}
