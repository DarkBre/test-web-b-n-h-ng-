import { Link, NavLink } from 'react-router-dom'
import type { User } from '../types'
import { roleLabels } from '../utils/auth'

type HeaderProps = {
  user: User | null
  cartCount: number
  cartTarget: string
  cartState?: { redirectReason: string }
}

export function Header({ user, cartCount, cartTarget, cartState }: HeaderProps) {
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">NT</span>
        <div>
          <strong>NovaTech</strong>
          <span>Trải nghiệm mua sắm thông minh</span>
        </div>
      </Link>

      <nav className="nav">
        <NavLink to="/">Sản phẩm</NavLink>
        {user ? (
          <NavLink to="/cart">Giỏ hàng</NavLink>
        ) : (
          <Link to={cartTarget} state={cartState}>
            Giỏ hàng
          </Link>
        )}
        <NavLink to="/checkout">Thanh toán</NavLink>
        {user?.role === 'admin' ? <NavLink to="/admin">Quản trị</NavLink> : null}
        <NavLink to="/auth">{user ? user.name : 'Đăng nhập'}</NavLink>
      </nav>

      <div className="topbar-actions">
        <div className="mini-stat">
          <span>{user ? roleLabels[user.role] : 'Đã bán'}</span>
          <strong>{user ? user.email.split('@')[0] : '12.4k'}</strong>
        </div>
        <Link className="cart-pill" to={cartTarget} state={cartState}>
          Giỏ hàng
          <span>{cartCount}</span>
        </Link>
      </div>
    </header>
  )
}
