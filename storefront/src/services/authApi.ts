import type { User } from '../types'

type AuthResponse = {
  message: string
  user: User
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/novatech-api'
const AUTH_ENDPOINT = `${API_BASE}/auth.php`

const fetchApi = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    return await fetch(input, init)
  } catch {
    throw new Error('Không kết nối được backend. Hãy bật Apache/MySQL trong XAMPP và kiểm tra http://localhost/novatech-api/auth.php?action=list.')
  }
}

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
  const users = await parseResponse<User[]>(
    await fetchApi(`${AUTH_ENDPOINT}?action=list`, {
      credentials: 'include',
    }),
  )
  return users.map(normalizeUser)
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await parseResponse<AuthResponse>(
    await fetchApi(`${AUTH_ENDPOINT}?action=login`, {
      body: JSON.stringify({ email, password }),
      credentials: 'include',
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
): Promise<AuthResponse> => {
  const response = await parseResponse<AuthResponse>(
    await fetchApi(`${AUTH_ENDPOINT}?action=register`, {
      body: JSON.stringify({ email, name, password }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    }),
  )

  return {
    ...response,
    user: normalizeUser(response.user),
  }
}

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await parseResponse<{ user: User }>(
    await fetchApi(`${AUTH_ENDPOINT}?action=me`, {
      credentials: 'include',
    }),
  )

  return normalizeUser(response.user)
}

export const logout = async (): Promise<{ message: string }> => {
  return parseResponse<{ message: string }>(
    await fetchApi(`${AUTH_ENDPOINT}?action=logout`, {
      credentials: 'include',
      method: 'POST',
    }),
  )
}
