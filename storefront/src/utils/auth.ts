import type { AccountRole, RegisteredUser, User } from '../types'

export const demoAccounts: RegisteredUser[] = [
  {
    name: 'Quản trị NovaTech',
    email: 'admin@novatech.vn',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Khách hàng mẫu',
    email: 'user@novatech.vn',
    password: 'user123',
    role: 'customer',
  },
]

export const roleLabels: Record<AccountRole, string> = {
  admin: 'Quản trị viên',
  customer: 'Khách hàng',
}

export const seedAccounts = (accounts: RegisteredUser[]) => {
  const normalized = accounts.map((account) => ({
    ...account,
    role: account.role ?? 'customer',
  }))

  const missingDemoAccounts = demoAccounts.filter(
    (demoAccount) =>
      !normalized.some((account) => account.email.toLowerCase() === demoAccount.email.toLowerCase()),
  )

  return [...missingDemoAccounts, ...normalized]
}

export const normalizeUser = (user: User | null): User | null => {
  if (!user) return null

  return {
    ...user,
    role: user.role ?? 'customer',
  }
}
