import type { AccountRole, User } from '../types'

type AuthResponse = {
  message: string
  user: User
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/novatech-api'
const AUTH_ENDPOINT = `${API_BASE}/auth.php`

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String(payload.message)
        : 'Không thể kết nối API tài khoản.'

    throw new Error(message)
  }

  return payload as T
}

const normalizeUser = (user: User): User => ({
  name: user.name,
  email: user.email,
  role: user.role ?? 'customer',
})

export const fetchUsers = async (): Promise<User[]> => {
  const users = await parseResponse<User[]>(await fetch(`${AUTH_ENDPOINT}?action=list`))
  return users.map(normalizeUser)
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await parseResponse<AuthResponse>(
    await fetch(`${AUTH_ENDPOINT}?action=login`, {
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    }),
  )

  return {
    ...response,
    user: normalizeUser(response.user),
  }
}

export const register = async (
  name: string,
  email: string,
  password: string,
  role: AccountRole,
): Promise<AuthResponse> => {
  const response = await parseResponse<AuthResponse>(
    await fetch(`${AUTH_ENDPOINT}?action=register`, {
      body: JSON.stringify({ email, name, password, role }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    }),
  )

  return {
    ...response,
    user: normalizeUser(response.user),
  }
}
