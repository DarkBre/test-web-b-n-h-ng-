import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ChatbotAI } from './components/ChatbotAI'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { products as initialProducts } from './data/products'
import { AdminPage } from './pages/AdminPage'
import { AuthPage } from './pages/AuthPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import type { AccountRole, AuthResult, CartItem, Category, ChatMessage, Product, RegisteredUser, User } from './types'
import { normalizeUser, roleLabels, seedAccounts } from './utils/auth'
import { formatPrice } from './utils/format'
import { readStorage } from './utils/storage'

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Tất cả'>('Tất cả')
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage<Product[]>('products', initialProducts),
  )
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>('cart', []))
  const [accounts, setAccounts] = useState<RegisteredUser[]>(() =>
    seedAccounts(readStorage<RegisteredUser[]>('accounts', [])),
  )
  const [user, setUser] = useState<User | null>(() => normalizeUser(readStorage<User | null>('user', null)))
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      text: 'Xin chào, tôi là trợ lý AI mua sắm. Hãy mô tả nhu cầu như "tai nghe làm việc" hoặc "quà tặng gaming dưới 15 triệu".',
    },
  ])

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

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts((current) => [
      ...current,
      {
        ...product,
        id: Math.max(0, ...current.map((item) => item.id)) + 1,
      },
    ])
  }

  const updateProduct = (product: Product) => {
    setProducts((current) => current.map((item) => (item.id === product.id ? product : item)))
  }

  const deleteProduct = (productId: number) => {
    setProducts((current) => current.filter((product) => product.id !== productId))
    setCart((current) => current.filter((item) => item.productId !== productId))
  }

  const loginUser = (email: string, password: string): AuthResult => {
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
      message: `Đăng nhập thành công với quyền ${roleLabels[account.role]}.`,
    }
  }

  const registerUser = (
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

  const sendChat = (event: FormEvent) => {
    event.preventDefault()
    const prompt = chatInput.trim()
    if (!prompt) return

    const lower = prompt.toLowerCase()
    const recommendation =
      products.find(
        (product) =>
          lower.includes(product.category.toLowerCase()) ||
          lower.includes(product.name.toLowerCase().split(' ')[0].toLowerCase()) ||
          product.features.some((feature) => lower.includes(feature.toLowerCase().split(' ')[0])),
      ) ?? [...products].sort((a, b) => b.rating - a.rating)[0]

    const budgetMatch = lower.match(/(\d+)/)
    const budgetText = budgetMatch
      ? `Với ngân sách khoảng ${Number(budgetMatch[1]).toLocaleString('vi-VN')} triệu, `
      : ''

    setMessages((current) => [
      ...current,
      { role: 'user', text: prompt },
      {
        role: 'bot',
        text: `${budgetText}tôi gợi ý ${recommendation.name}. Điểm mạnh: ${recommendation.features.join(
          ', ',
        )}. Giá hiện tại ${formatPrice(recommendation.price)}.`,
      },
    ])
    setChatInput('')
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

      <ChatbotAI
        chatInput={chatInput}
        chatOpen={chatOpen}
        messages={messages}
        onClose={() => setChatOpen(false)}
        onInputChange={setChatInput}
        onSubmit={sendChat}
        onToggle={() => setChatOpen((current) => !current)}
      />
    </div>
  )
}

export function LegacyAdminPage({
  accounts,
  ordersCount,
  productsCount,
}: {
  accounts: RegisteredUser[]
  ordersCount: number
  productsCount: number
}) {
  return (
    <main className="panel-layout page-enter">
      <section className="panel">
        <div className="section-head">
          <h2>Trang quản trị</h2>
          <span>Chỉ tài khoản admin được truy cập</span>
        </div>
        <div className="admin-grid">
          <article className="admin-card">
            <span>Sản phẩm</span>
            <strong>{productsCount}</strong>
          </article>
          <article className="admin-card">
            <span>Tài khoản</span>
            <strong>{accounts.length}</strong>
          </article>
          <article className="admin-card">
            <span>Giỏ hàng hiện tại</span>
            <strong>{ordersCount}</strong>
          </article>
        </div>
      </section>
      <aside className="summary-card">
        <h3>Tài khoản demo</h3>
        <p>Email admin: admin@novatech.vn</p>
        <p>Mật khẩu: admin123</p>
        <p>Email khách hàng: user@novatech.vn</p>
        <p>Mật khẩu: user123</p>
      </aside>
    </main>
  )
}

export default App
