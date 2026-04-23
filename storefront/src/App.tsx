import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { AdminPage } from './pages/AdminPage'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import {
  fetchCurrentUser,
  login as loginWithApi,
  logout as logoutWithApi,
  register as registerWithApi,
} from './services/authApi'
import { fetchProducts } from './services/productApi'
import type { AuthResult, Product, User } from './types'
import { normalizeUser, roleLabels } from './utils/auth'
import { readSessionStorage } from './utils/storage'

const readStoredUser = () => normalizeUser(readSessionStorage<User | null>('user', null))

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [user, setUser] = useState<User | null>(readStoredUser)

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user))
    } else {
      sessionStorage.removeItem('user')
    }
  }, [user])

  useEffect(() => {
    if (user?.role !== 'customer') {
      setProducts([])
      return
    }

    fetchProducts().then(setProducts)
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
      // Vẫn đưa frontend về trạng thái đăng xuất nếu backend phản hồi chậm hoặc đang lỗi.
    }
    setUser(null)
  }

  return (
    <div className="app-shell">
      <Header onLogout={logoutUser} user={user} />

      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Navigate
                replace
                to="/auth"
                state={{ redirectReason: 'Vui lòng đăng nhập để xem trang chủ sản phẩm.' }}
              />
            ) : user.role === 'admin' ? (
              <Navigate replace to="/admin" />
            ) : (
              <HomePage products={products} />
            )
          }
        />
        <Route
          path="/auth"
          element={
            user ? (
              <Navigate replace to={user.role === 'admin' ? '/admin' : '/'} />
            ) : (
              <AuthPage onLogin={loginUser} onRegister={registerUser} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            user?.role === 'admin' ? (
              <AdminPage />
            ) : (
              <Navigate
                replace
                to="/auth"
                state={{ redirectReason: 'Bạn cần đăng nhập bằng tài khoản quản trị để vào trang admin.' }}
              />
            )
          }
        />
        <Route path="*" element={<Navigate replace to={user?.role === 'admin' ? '/admin' : '/'} />} />
      </Routes>
    </div>
  )
}

export default App
