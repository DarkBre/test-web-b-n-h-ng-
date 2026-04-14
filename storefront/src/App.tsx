import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'

type Category = 'Âm thanh' | 'Thiết bị đeo' | 'Gaming' | 'Nhà thông minh'

type Product = {
  id: number
  name: string
  category: Category
  price: number
  rating: number
  description: string
  image: string
  badge: string
  colors: string[]
  features: string[]
}

type CartItem = {
  productId: number
  quantity: number
}

type User = {
  name: string
  email: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Auraloop Pro',
    category: 'Âm thanh',
    price: 349,
    rating: 4.9,
    description: 'Tai nghe chống ồn cao cấp cho làm việc sâu và di chuyển hằng ngày.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    badge: 'Bán chạy',
    colors: ['Graphite', 'Cát', 'Băng'],
    features: ['ANC thế hệ mới', 'Pin 32 giờ', 'Micro beamforming'],
  },
  {
    id: 2,
    name: 'Pulse Watch X',
    category: 'Thiết bị đeo',
    price: 279,
    rating: 4.7,
    description: 'Đồng hồ theo dõi sức khỏe, luyện tập và nhận thông báo tức thời.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    badge: 'Mới',
    colors: ['Đen', 'Bạc'],
    features: ['Theo dõi giấc ngủ', 'GPS độc lập', 'Sạc nhanh'],
  },
  {
    id: 3,
    name: 'Nova Console',
    category: 'Gaming',
    price: 499,
    rating: 4.8,
    description: 'Máy chơi game nhỏ gọn, hỗ trợ 4K và thư viện game đám mây.',
    image:
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80',
    badge: 'Giới hạn',
    colors: ['Trắng mờ'],
    features: ['4K 120Hz', 'SSD 1TB', 'Tay cầm haptic'],
  },
  {
    id: 4,
    name: 'Luma Lamp Air',
    category: 'Nhà thông minh',
    price: 189,
    rating: 4.6,
    description: 'Đèn bàn thông minh điều chỉnh nhiệt độ màu theo nhịp sinh học.',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    badge: 'Smart Home',
    colors: ['Ngọc trai', 'Đá'],
    features: ['Điều khiển app', 'Cảm biến ánh sáng', 'Hẹn giờ ngủ'],
  },
  {
    id: 5,
    name: 'Echo Mini Speaker',
    category: 'Âm thanh',
    price: 129,
    rating: 4.5,
    description: 'Loa nhỏ cho bàn làm việc với âm trầm tốt và trợ lý giọng nói tích hợp.',
    image:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
    badge: 'Nhỏ gọn',
    colors: ['San hô', 'Midnight'],
    features: ['Wi‑Fi + Bluetooth', 'Stereo pairing', 'Điều khiển giọng nói'],
  },
  {
    id: 6,
    name: 'Orbit VR Kit',
    category: 'Gaming',
    price: 599,
    rating: 4.9,
    description: 'Kính VR cho trải nghiệm nhập vai với tracking không gian chính xác.',
    image:
      'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=900&q=80',
    badge: 'Sẵn sàng cho AI',
    colors: ['Carbon'],
    features: ['6DoF tracking', 'Màn OLED', 'Điều khiển cử chỉ'],
  },
]

const categories: Array<Category | 'Tất cả'> = [
  'Tất cả',
  'Âm thanh',
  'Thiết bị đeo',
  'Gaming',
  'Nhà thông minh',
]

const highlights = [
  { label: 'Flash sale', value: 'Giảm đến 35%' },
  { label: 'Giao hàng', value: 'Nhanh trong 2 giờ' },
  { label: 'Hỗ trợ', value: 'AI tư vấn 24/7' },
]

const footerGroups = [
  {
    title: 'Mua sắm',
    items: ['Sản phẩm mới', 'Bán chạy', 'Combo giá tốt', 'Gợi ý quà tặng'],
  },
  {
    title: 'Dịch vụ',
    items: ['Bảo hành', 'Đổi trả', 'Thanh toán', 'Vận chuyển'],
  },
  {
    title: 'Thương hiệu',
    items: ['Câu chuyện', 'Showroom', 'Tuyển dụng', 'Liên hệ'],
  },
]

const currency = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const formatPrice = (usd: number) => currency.format(usd * 26000)

const readStorage = <T,>(key: string, fallback: T) => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Tất cả'>('Tất cả')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>('cart', []))
  const [user, setUser] = useState<User | null>(() => readStorage<User | null>('user', null))
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'bot' | 'user'; text: string }>>([
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
      <header className="topbar topbar-meta">
        <div className="meta-strip">
          <span>Free ship đơn trên 2 triệu</span>
          <span>Trả góp 0% cho đơn giá trị cao</span>
          <span>Chat AI để nhận gợi ý cá nhân hóa</span>
        </div>
      </header>

      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">N</span>
          <div>
            <strong>Nova Mart</strong>
            <span>Trải nghiệm mua sắm thông minh</span>
          </div>
        </Link>

        <nav className="nav">
          <NavLink to="/">Sản phẩm</NavLink>
          <NavLink to="/cart">Giỏ hàng</NavLink>
          <NavLink to="/checkout">Thanh toán</NavLink>
          <NavLink to="/auth">{user ? user.name : 'Đăng nhập'}</NavLink>
        </nav>

        <div className="topbar-actions">
          <div className="mini-stat">
            <span>Đã bán</span>
            <strong>12.4k</strong>
          </div>
          <Link className="cart-pill" to="/cart">
            Giỏ hàng
            <span>{cartCount}</span>
          </Link>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <CatalogPage
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
            <CartPage
              cart={cart}
              products={products}
              subtotal={subtotal}
              onAdjust={updateQuantity}
              onRemove={removeFromCart}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cart={cart}
              products={products}
              subtotal={subtotal}
              user={user}
              onCheckoutSuccess={() => setCart([])}
            />
          }
        />
        <Route path="/auth" element={<AuthPage user={user} onAuth={setUser} />} />
      </Routes>

      <footer className="site-footer">
        <section className="footer-hero">
          <div>
            <p className="eyebrow">Nova Club</p>
            <h2>Nhận bản tin khuyến mãi và xu hướng công nghệ mới mỗi tuần.</h2>
          </div>
          <form className="footer-newsletter">
            <input placeholder="Nhập email để nhận ưu đãi" />
            <button type="button">Đăng ký</button>
          </form>
        </section>

        <section className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark">N</span>
              <div>
                <strong>Nova Mart</strong>
                <span>Storefront cho thiết bị hiện đại</span>
              </div>
            </div>
            <p>
              Giao diện mua sắm được thiết kế để bán hàng nhanh, rõ ràng và có điểm nhấn chuyển
              động hiện đại.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div className="footer-column" key={group.title}>
              <strong>{group.title}</strong>
              {group.items.map((item) => (
                <a href="/" key={item} onClick={(event) => event.preventDefault()}>
                  {item}
                </a>
              ))}
            </div>
          ))}
        </section>

        <div className="footer-bottom">
          <span>2026 Nova Mart. Bảo lưu mọi quyền.</span>
          <div className="footer-links">
            <a href="/" onClick={(event) => event.preventDefault()}>
              Quyền riêng tư
            </a>
            <a href="/" onClick={(event) => event.preventDefault()}>
              Điều khoản
            </a>
            <a href="/" onClick={(event) => event.preventDefault()}>
              Hỗ trợ
            </a>
          </div>
        </div>
      </footer>

      <button className="chat-fab" onClick={() => setChatOpen((current) => !current)}>
        AI
      </button>
      {chatOpen ? (
        <section className="chat-widget">
          <div className="chat-header">
            <div>
              <strong>AI Shopping Assistant</strong>
              <span>Gợi ý theo nhu cầu và ngân sách</span>
            </div>
            <button onClick={() => setChatOpen(false)}>×</button>
          </div>
          <div className="chat-body">
            {messages.map((message, index) => (
              <article key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
                {message.text}
              </article>
            ))}
          </div>
          <form className="chat-form" onSubmit={sendChat}>
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ví dụ: tôi cần loa nhỏ dưới 5 triệu"
            />
            <button type="submit">Gợi ý</button>
          </form>
        </section>
      ) : null}
    </div>
  )
}

function CatalogPage({
  products,
  category,
  search,
  setCategory,
  setSearch,
  onAddToCart,
}: {
  products: Product[]
  category: Category | 'Tất cả'
  search: string
  setCategory: (value: Category | 'Tất cả') => void
  setSearch: (value: string) => void
  onAddToCart: (productId: number) => void
}) {
  return (
    <main className="page-enter">
      <section className="hero-banner">
        <div className="hero-copy-block">
          <p className="eyebrow">Frontend thương mại điện tử</p>
          <h1>Một storefront hiện đại với animation nhẹ, rõ nhận diện và sẵn sàng chuyển đổi.</h1>
          <p className="hero-copy">
            Tập trung vào bộ lọc nhanh, detail page mạch lạc, checkout gọn và chatbot AI hỗ trợ
            mua hàng ngay trên giao diện.
          </p>

          <div className="hero-actions">
            <a className="primary-link hero-link" href="#products">
              Khám phá bộ sưu tập
            </a>
            <div className="hero-badge-cloud">
              {highlights.map((item) => (
                <div className="floating-badge" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-card spotlight-card">
          <span>Bộ sưu tập mùa này</span>
          <strong>06 sản phẩm chọn lọc</strong>
          <p>Miễn phí giao hàng toàn quốc cho đơn trên 2 triệu.</p>
          <div className="hero-card-line" />
          <div className="hero-kpis">
            <div>
              <strong>4.8/5</strong>
              <span>Đánh giá trung bình</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>AI sẵn sàng tư vấn</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        {highlights.map((item) => (
          <article className="stat-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="toolbar">
        <div className="chip-row">
          {categories.map((item) => (
            <button
              key={item}
              className={item === category ? 'chip active' : 'chip'}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <input
          className="search-box"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm theo tên hoặc tính năng"
        />
      </section>

      <section className="product-grid" id="products">
        {products.map((product, index) => (
          <article
            className="product-card reveal-card"
            key={product.id}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <img src={product.image} alt={product.name} />
            <div className="product-content">
              <div className="product-meta">
                <span>{product.badge}</span>
                <span>{product.rating} / 5</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-footer">
                <strong>{formatPrice(product.price)}</strong>
                <div className="actions">
                  <Link to={`/products/${product.id}`}>Chi tiết</Link>
                  <button onClick={() => onAddToCart(product.id)}>Thêm giỏ</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

function ProductDetailPage({
  products,
  onAddToCart,
}: {
  products: Product[]
  onAddToCart: (productId: number) => void
}) {
  const params = useParams()
  const product = products.find((entry) => entry.id === Number(params.id))

  if (!product) {
    return (
      <main className="empty-state page-enter">
        <h2>Không tìm thấy sản phẩm</h2>
        <Link to="/">Quay lại danh sách</Link>
      </main>
    )
  }

  return (
    <main className="detail-layout page-enter">
      <img className="detail-image shimmer-surface" src={product.image} alt={product.name} />
      <section className="detail-panel">
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="detail-copy">{product.description}</p>
        <strong className="detail-price">{formatPrice(product.price)}</strong>
        <div className="detail-group">
          <span>Màu sắc</span>
          <div className="tag-row">
            {product.colors.map((color) => (
              <span className="tag" key={color}>
                {color}
              </span>
            ))}
          </div>
        </div>
        <div className="detail-group">
          <span>Tính năng nổi bật</span>
          <ul className="feature-list">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="actions">
          <button onClick={() => onAddToCart(product.id)}>Thêm vào giỏ</button>
          <Link to="/checkout">Mua ngay</Link>
        </div>
      </section>
    </main>
  )
}

function CartPage({
  cart,
  products,
  subtotal,
  onAdjust,
  onRemove,
}: {
  cart: CartItem[]
  products: Product[]
  subtotal: number
  onAdjust: (productId: number, delta: number) => void
  onRemove: (productId: number) => void
}) {
  const items = cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.productId)!,
  }))

  return (
    <main className="panel-layout page-enter">
      <section className="panel">
        <div className="section-head">
          <h2>Giỏ hàng</h2>
          <span>{cart.length} sản phẩm</span>
        </div>
        {items.length === 0 ? (
          <div className="empty-state">
            <p>Giỏ hàng đang trống.</p>
            <Link to="/">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          items.map((item) => (
            <article className="cart-row" key={item.productId}>
              <img src={item.product.image} alt={item.product.name} />
              <div>
                <h3>{item.product.name}</h3>
                <p>{formatPrice(item.product.price)}</p>
              </div>
              <div className="stepper">
                <button onClick={() => onAdjust(item.productId, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onAdjust(item.productId, 1)}>+</button>
              </div>
              <strong>{formatPrice(item.product.price * item.quantity)}</strong>
              <button className="ghost-button" onClick={() => onRemove(item.productId)}>
                Xóa
              </button>
            </article>
          ))
        )}
      </section>
      <aside className="summary-card">
        <h3>Tóm tắt đơn hàng</h3>
        <div className="summary-line">
          <span>Tạm tính</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div className="summary-line">
          <span>Vận chuyển</span>
          <strong>Miễn phí</strong>
        </div>
        <div className="summary-line total">
          <span>Tổng cộng</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <Link className="primary-link" to="/checkout">
          Tiến hành thanh toán
        </Link>
      </aside>
    </main>
  )
}

function CheckoutPage({
  cart,
  products,
  subtotal,
  user,
  onCheckoutSuccess,
}: {
  cart: CartItem[]
  products: Product[]
  subtotal: number
  user: User | null
  onCheckoutSuccess: () => void
}) {
  const navigate = useNavigate()
  const [ordered, setOrdered] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    address: '',
    payment: 'cod',
  })

  const items = cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.productId)!,
  }))

  const placeOrder = (event: FormEvent) => {
    event.preventDefault()
    setOrdered(true)
    onCheckoutSuccess()
  }

  return (
    <main className="panel-layout page-enter">
      <section className="panel">
        <div className="section-head">
          <h2>Thanh toán</h2>
          <span>{ordered ? 'Đặt hàng thành công' : 'Hoàn tất trong 1 bước'}</span>
        </div>
        {ordered ? (
          <div className="success-box">
            <h3>Đơn hàng đã được ghi nhận</h3>
            <p>
              Xác nhận đơn sẽ được gửi tới <strong>{form.email || 'email của bạn'}</strong> trong
              vài phút.
            </p>
            <button onClick={() => navigate('/')}>Quay về trang chủ</button>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={placeOrder}>
            <div className="input-grid">
              <label>
                Họ tên
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </label>
            </div>
            <label>
              Địa chỉ giao hàng
              <textarea
                required
                rows={4}
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
              />
            </label>
            <label>
              Phương thức thanh toán
              <select
                value={form.payment}
                onChange={(event) => setForm({ ...form, payment: event.target.value })}
              >
                <option value="cod">Thanh toán khi nhận hàng</option>
                <option value="card">Thẻ tín dụng</option>
                <option value="wallet">Ví điện tử</option>
              </select>
            </label>
            <button type="submit" disabled={!items.length}>
              Xác nhận thanh toán
            </button>
          </form>
        )}
      </section>
      <aside className="summary-card">
        <h3>Đơn hàng của bạn</h3>
        {items.map((item) => (
          <div className="summary-line" key={item.productId}>
            <span>
              {item.product.name} x{item.quantity}
            </span>
            <strong>{formatPrice(item.product.price * item.quantity)}</strong>
          </div>
        ))}
        <div className="summary-line total">
          <span>Tổng thanh toán</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
      </aside>
    </main>
  )
}

function AuthPage({
  user,
  onAuth,
}: {
  user: User | null
  onAuth: (user: User | null) => void
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onAuth({ name: form.name || 'Nova User', email: form.email })
  }

  return (
    <main className="auth-layout page-enter">
      <section className="auth-panel">
        <p className="eyebrow">Tài khoản khách hàng</p>
        <h1>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h1>
        <p className="detail-copy">
          Lưu lịch sử đơn hàng, đồng bộ giỏ hàng và nhận đề xuất cá nhân hóa từ AI.
        </p>
        <form className="checkout-form" onSubmit={submit}>
          {mode === 'register' ? (
            <label>
              Họ tên
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
          ) : null}
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label>
            Mật khẩu
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>
          <button type="submit">{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</button>
        </form>
        <button
          className="ghost-button"
          onClick={() => setMode((current) => (current === 'login' ? 'register' : 'login'))}
        >
          {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
        </button>
        {user ? (
          <button className="ghost-button" onClick={() => onAuth(null)}>
            Đăng xuất
          </button>
        ) : null}
      </section>
    </main>
  )
}

export default App
