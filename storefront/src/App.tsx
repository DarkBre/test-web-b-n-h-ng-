import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { products as initialProducts } from './data/products'
import { AdminPage } from './pages/AdminPage'
import { AuthPage } from './pages/AuthPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import {
  fetchUsers,
  login as loginWithApi,
  register as registerWithApi,
} from './services/authApi'
import {
  createProduct,
  deleteProduct as deleteProductFromApi,
  fetchProducts,
  updateProduct as updateProductOnApi,
} from './services/productsApi'
import type { AccountRole, AuthResult, CartItem, Category, Product, RegisteredUser, User } from './types'
import { normalizeUser, roleLabels, seedAccounts } from './utils/auth'
import { readStorage } from './utils/storage'

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Tất cả'>('Tất cả')
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage<Product[]>('products', initialProducts),
  )
  const [productSource, setProductSource] = useState<'local' | 'database'>('local')
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>('cart', []))
  const [accounts, setAccounts] = useState<RegisteredUser[]>(() =>
    seedAccounts(readStorage<RegisteredUser[]>('accounts', [])),
  )
  const [user, setUser] = useState<User | null>(() => normalizeUser(readStorage<User | null>('user', null)))

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    fetchUsers()
      .then((databaseUsers) => {
        setAccounts(
          databaseUsers.map((account) => ({
            ...account,
            password: '',
          })),
        )
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    let cancelled = false

    fetchProducts()
      .then((databaseProducts) => {
        if (cancelled || databaseProducts.length === 0) return
        setProducts(databaseProducts)
        setProductSource('database')
      })
      .catch(() => {
        if (!cancelled) {
          setProductSource('local')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products))
  }, [products])

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
  }, [search, selectedCategory])

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

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const created = await createProduct(product)
      setProducts((current) => [...current, created])
      setProductSource('database')
    } catch {
      setProducts((current) => [
        ...current,
        {
          ...product,
          id: Math.max(0, ...current.map((item) => item.id)) + 1,
        },
      ])
      setProductSource('local')
    }
  }

  const updateProduct = async (product: Product) => {
    try {
      const updated = await updateProductOnApi(product)
      setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setProductSource('database')
    } catch {
      setProducts((current) => current.map((item) => (item.id === product.id ? product : item)))
      setProductSource('local')
    }
  }

  const deleteProduct = async (productId: number) => {
    try {
      await deleteProductFromApi(productId)
      setProductSource('database')
    } catch {
      setProductSource('local')
    }

    setProducts((current) => current.filter((product) => product.id !== productId))
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
      const apiMessage = error instanceof Error ? error.message : ''
      const localResult = legacyLoginUser(email, password)
      return localResult.ok ? localResult : { ...localResult, message: apiMessage || localResult.message }
    }
  }

  const legacyLoginUser = (email: string, password: string): AuthResult => {
    const account = accounts.find((entry) => entry.email.toLowerCase() === email.toLowerCase())

    if (!account || account.password !== password) {
      return {
        ok: false,
        message: 'Email hoặc mật khẩu không đúng.',
      }
    }

    setUser({ name: account.name, email: account.email, role: account.role })
    return {
      ok: true,
      message: `Đăng nhập bằng dữ liệu local với quyền ${roleLabels[account.role]}.`,
    }
  }

  const registerUser = (
    name: string,
    email: string,
    password: string,
    role: AccountRole,
  ): Promise<AuthResult> => {
    return registerUserWithApi(name, email, password, role)
  }

  const registerUserWithApi = async (
    name: string,
    email: string,
    password: string,
    role: AccountRole,
  ): Promise<AuthResult> => {
    try {
      const result = await registerWithApi(name, email, password, role)
      setUser(result.user)
      setAccounts((current) => [
        ...current.filter((account) => account.email.toLowerCase() !== result.user.email.toLowerCase()),
        { ...result.user, password: '' },
      ])

      return {
        ok: true,
        message: `${result.message} Quyền tài khoản: ${roleLabels[result.user.role]}.`,
      }
    } catch (error) {
      const apiMessage = error instanceof Error ? error.message : ''
      const localResult = legacyRegisterUser(name, email, password, role)

      return localResult.ok
        ? {
            ...localResult,
            message: `${localResult.message} API chưa sẵn sàng nên tài khoản đang lưu tạm trong trình duyệt.`,
          }
        : {
            ...localResult,
            message: apiMessage || localResult.message,
          }
    }
  }

  const legacyRegisterUser = (
    name: string,
    email: string,
    password: string,
    role: AccountRole,
  ): AuthResult => {
    const normalizedEmail = email.trim().toLowerCase()
    const exists = accounts.some((account) => account.email.toLowerCase() === normalizedEmail)

    if (exists) {
      return {
        ok: false,
        message: 'Email này đã được đăng ký.',
      }
    }

    if (password.length < 6) {
      return {
        ok: false,
        message: 'Mật khẩu cần có ít nhất 6 ký tự.',
      }
    }

    const newAccount: RegisteredUser = {
      name: name.trim() || 'Nova User',
      email: normalizedEmail,
      password,
      role,
    }

    setAccounts((current) => [...current, newAccount])
    setUser({ name: newAccount.name, email: newAccount.email, role: newAccount.role })

    return {
      ok: true,
      message: `Tạo tài khoản thành công với quyền ${roleLabels[role]}.`,
    }
  }

  const logoutUser = () => {
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
            <HomePage
              products={filteredProducts}
              category={selectedCategory}
              search={search}
              setCategory={setSelectedCategory}
              setSearch={setSearch}
              onAddToCart={addToCart}
            />
          }
        />
        <Route
          path="/products/:id"
          element={<ProductDetailPage onAddToCart={addToCart} products={products} />}
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
                productSource={productSource}
                products={products}
                onAddProduct={addProduct}
                onDeleteProduct={deleteProduct}
                onUpdateProduct={updateProduct}
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
