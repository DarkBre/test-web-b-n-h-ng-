import type { User } from '../types'
import { API_BASE, fetchApi, parseResponse } from './apiClient'

type AuthResponse = {
  message: string
  user: User
}

const AUTH_ENDPOINT = `${API_BASE}/auth.php`

const normalizeUser = (user: User): User => ({
  name: user.name,
  email: user.email,
  role: user.role ?? 'customer',
})

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
