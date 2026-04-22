import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { AdminPage } from './pages/AdminPage'
import { AuthPage } from './pages/AuthPage'
import {
  fetchCurrentUser,
  fetchUsers,
  login as loginWithApi,
  logout as logoutWithApi,
  register as registerWithApi,
} from './services/authApi'
import type { AuthResult, User } from './types'
import { normalizeUser, roleLabels } from './utils/auth'
import { readSessionStorage } from './utils/storage'

const readStoredUser = () => normalizeUser(readSessionStorage<User | null>('user', null))

function App() {
  const [accounts, setAccounts] = useState<User[]>([])
  const [user, setUser] = useState<User | null>(readStoredUser)

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user))
    } else {
      sessionStorage.removeItem('user')
    }
  }, [user])

  useEffect(() => {
    if (user?.role !== 'admin') {
      setAccounts([])
      return
    }

    fetchUsers()
      .then(setAccounts)
      .catch(() => undefined)
  }, [user])

  useEffect(() => {
    const storedUser = readStoredUser()

    if (!storedUser) {
      logoutWithApi().catch(() => undefined)
      setUser(null)
      return
    }

    fetchCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => setUser(null))
  }, [])

  const loginUser = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await loginWithApi(email, password)
      setUser(result.user)

      return {
        ok: true,
        message: `${result.message} Quyền tài khoản: ${roleLabels[result.user.role]}.`,
      }
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Đăng nhập thất bại.',
      }
    }
  }

  const registerUser = async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await registerWithApi(name, email, password)
      setUser(result.user)
      setAccounts((current) => [
        ...current.filter((account) => account.email.toLowerCase() !== result.user.email.toLowerCase()),
        result.user,
      ])

      return {
        ok: true,
        message: `${result.message} Quyền tài khoản: ${roleLabels[result.user.role]}.`,
      }
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Đăng ký thất bại.',
      }
    }
  }

  const logoutUser = async () => {
    try {
      await logoutWithApi()
    } catch {
      // Vẫn xóa trạng thái frontend nếu backend tạm thời không phản hồi.
    }
    setUser(null)
  }

  return (
    <div className="app-shell">
      <Header user={user} />

      <Routes>
        <Route
          path="/"
          element={
            <AuthPage
              user={user}
              onLogin={loginUser}
              onLogout={logoutUser}
              onRegister={registerUser}
            />
          }
        />
        <Route
          path="/auth"
          element={
            <AuthPage
              user={user}
              onLogin={loginUser}
              onLogout={logoutUser}
              onRegister={registerUser}
            />
          }
        />
        <Route
          path="/admin"
          element={
            user?.role === 'admin' ? (
              <AdminPage accounts={accounts} />
            ) : (
              <Navigate
                replace
                to="/auth"
                state={{ redirectReason: 'Bạn cần đăng nhập bằng tài khoản quản trị để vào trang admin.' }}
              />
            )
          }
        />
        <Route path="*" element={<Navigate replace to="/auth" />} />
      </Routes>
    </div>
  )
}

export default App
