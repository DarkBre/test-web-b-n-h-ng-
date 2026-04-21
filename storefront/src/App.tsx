import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { AdminPage } from './pages/AdminPage'
import { AuthPage } from './pages/AuthPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import {
  fetchCurrentUser,
  fetchUsers,
  login as loginWithApi,
  logout as logoutWithApi,
  register as registerWithApi,
} from './services/authApi'
import { fetchProducts } from './services/productsApi'
import type { AuthResult, CartItem, Product, User } from './types'
import { normalizeUser, roleLabels } from './utils/auth'
import { readSessionStorage, readStorage } from './utils/storage'

function App() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>('cart', []))
  const [accounts, setAccounts] = useState<User[]>([])
  const [user, setUser] = useState<User | null>(() =>
    normalizeUser(readSessionStorage<User | null>('user', null)),
  )

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user))
    } else {
      sessionStorage.removeItem('user')
    }
    localStorage.removeItem('user')
  }, [user])

  useEffect(() => {
    fetchUsers()
      .then(setAccounts)
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    fetchCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    let cancelled = false

    fetchProducts()
      .then((databaseProducts) => {
        if (cancelled) return
        setProducts(databaseProducts)
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([])
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Tất cả' || product.category === selectedCategory
      const needle = search.trim().toLowerCase()
      const matchesSearch =
        !needle ||
        product.name.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle)

      return matchesCategory && matchesSearch
    })
  }, [products, search, selectedCategory])

  const categories = useMemo(() => {
    return ['Tất cả', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))]
  }, [products])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.productId)
    return total + (product?.price ?? 0) * item.quantity
  }, 0)

  const cartTarget = user ? '/cart' : '/auth'
  const cartState = user
    ? undefined
    : {
        redirectReason: 'Vui lòng đăng nhập để xem giỏ hàng của bạn.',
      }

  const addToCart = (productId: number) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId)
      if (existing) {
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...current, { productId, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((current) => current.filter((item) => item.productId !== productId))
  }

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
      // clear local state even if API logout fails
    }
    setUser(null)
  }

  return (
    <div className="app-shell">
      <Header
        cartCount={cartCount}
        cartState={cartState}
        cartTarget={cartTarget}
        user={user}
      />

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <HomePage
                categories={categories}
                products={filteredProducts}
                category={selectedCategory}
                search={search}
                setCategory={setSelectedCategory}
                setSearch={setSearch}
                onAddToCart={addToCart}
              />
            ) : (
              <Navigate
                replace
                to="/auth"
                state={{ redirectReason: 'Vui lòng đăng nhập để truy cập hệ thống.' }}
              />
            )
          }
        />
        <Route
          path="/products/:id"
          element={
            user ? (
              <ProductDetailPage onAddToCart={addToCart} products={products} />
            ) : (
              <Navigate
                replace
                to="/auth"
                state={{ redirectReason: 'Vui lòng đăng nhập để xem chi tiết sản phẩm.' }}
              />
            )
          }
        />
        <Route
          path="/cart"
          element={
            user ? (
              <CartPage
                cart={cart}
                products={products}
                subtotal={subtotal}
                onAdjust={updateQuantity}
                onRemove={removeFromCart}
              />
            ) : (
              <Navigate
                replace
                to="/auth"
                state={{ redirectReason: 'Vui lòng đăng nhập để xem giỏ hàng của bạn.' }}
              />
            )
          }
        />
        <Route
          path="/checkout"
          element={
            user ? (
              <CheckoutPage
                cart={cart}
                products={products}
                subtotal={subtotal}
                user={user}
                onCheckoutSuccess={() => setCart([])}
              />
            ) : (
              <Navigate
                replace
                to="/auth"
                state={{ redirectReason: 'Vui lòng đăng nhập trước khi thanh toán.' }}
              />
            )
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
              <AdminPage
                accounts={accounts}
                ordersCount={cart.length}
                products={products}
              />
            ) : (
              <Navigate
                replace
                to="/auth"
                state={{ redirectReason: 'Bạn cần đăng nhập bằng tài khoản quản trị để vào trang admin.' }}
              />
            )
          }
        />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
