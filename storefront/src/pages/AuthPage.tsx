import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import type { AuthResult } from '../types'

type AuthPageProps = {
  onLogin: (email: string, password: string) => AuthResult | Promise<AuthResult>
  onRegister: (
    name: string,
    email: string,
    password: string,
  ) => AuthResult | Promise<AuthResult>
}

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const location = useLocation()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
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

  return (
    <main className="auth-layout page-enter">
      <section className="auth-panel">
        <p className="eyebrow">Tài khoản khách hàng</p>
        <h1>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h1>
        <p className="detail-copy">Đăng nhập để truy cập hệ thống tài khoản theo đúng quyền người dùng.</p>

        {redirectReason ? <div className="auth-notice">{redirectReason}</div> : null}
        {status ? <div className="auth-notice">{status}</div> : null}

        <form className="auth-form" onSubmit={submit}>
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
