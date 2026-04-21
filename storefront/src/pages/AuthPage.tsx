import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { AuthResult, User } from '../types'
import { roleLabels } from '../utils/auth'

type AuthPageProps = {
  user: User | null
  onLogin: (email: string, password: string) => AuthResult | Promise<AuthResult>
  onLogout: () => void
  onRegister: (
    name: string,
    email: string,
    password: string,
  ) => AuthResult | Promise<AuthResult>
}

export function AuthPage({ user, onLogin, onLogout, onRegister }: AuthPageProps) {
  const location = useLocation()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: '',
    password: '',
  })
  const redirectReason =
    typeof location.state === 'object' &&
    location.state &&
    'redirectReason' in location.state &&
    typeof location.state.redirectReason === 'string'
      ? location.state.redirectReason
      : ''

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const result =
        mode === 'login'
          ? await onLogin(form.email, form.password)
          : await onRegister(form.name, form.email, form.password)

      setStatus(result.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setStatus('')
    setMode((current) => (current === 'login' ? 'register' : 'login'))
  }

  if (user) {
    return (
      <main className="auth-layout page-enter">
        <section className="auth-panel account-panel">
          <p className="eyebrow">Thông tin tài khoản</p>
          <h1>Xin chào, {user.name}</h1>
          <p className="detail-copy">
            Đây là trang hồ sơ của bạn. Tài khoản đang được dùng để mua hàng, thanh toán và truy cập
            các chức năng theo đúng quyền.
          </p>

          {redirectReason ? <div className="auth-notice">{redirectReason}</div> : null}

          <div className="auth-user-card">
            <span>Họ tên</span>
            <strong>{user.name}</strong>
            <span>Email</span>
            <p>{user.email}</p>
            <span>Phân quyền</span>
            <div className="role-pill">{roleLabels[user.role]}</div>
          </div>

          <div className="account-actions">
            <Link className="primary-link" to="/cart">
              Xem giỏ hàng
            </Link>
            {user.role === 'admin' ? (
              <Link className="primary-link" to="/admin">
                Vào trang quản trị
              </Link>
            ) : null}
            <button className="ghost-button" onClick={onLogout}>
              Đăng xuất
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-layout page-enter">
      <section className="auth-panel">
        <p className="eyebrow">Tài khoản khách hàng</p>
        <h1>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h1>
        <p className="detail-copy">
          Đăng nhập để đồng bộ giỏ hàng, thanh toán và truy cập chức năng theo đúng quyền tài khoản.
        </p>

        {redirectReason ? <div className="auth-notice">{redirectReason}</div> : null}
        {status ? <div className="auth-notice">{status}</div> : null}

        <form className="checkout-form" onSubmit={submit}>
          {mode === 'register' ? (
            <label>
              Họ tên
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Nguyễn Văn A"
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
              placeholder="email@example.com"
            />
          </label>
          <label>
            Mật khẩu
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Tối thiểu 6 ký tự"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>

        <button className="ghost-button" onClick={switchMode}>
          {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
        </button>
      </section>
    </main>
  )
}
