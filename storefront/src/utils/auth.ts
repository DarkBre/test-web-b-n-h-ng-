import type { AccountRole, User } from '../types'

export const roleLabels: Record<AccountRole, string> = {
  admin: 'Quản trị viên',
  customer: 'Khách hàng',
}

export const normalizeUser = (user: User | null): User | null => {
  if (!user) return null

  return {
    ...user,
    role: user.role ?? 'customer',
  }
}
