export type Product = {
  id: number
  name: string
  category: string
  price: number
  rating: number
  description: string
  image: string
  badge: string
  colors: string[]
  features: string[]
}

export type CartItem = {
  productId: number
  quantity: number
}

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
