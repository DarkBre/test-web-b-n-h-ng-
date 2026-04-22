import { Link, NavLink } from 'react-router-dom'
import type { User } from '../types'
import { roleLabels } from '../utils/auth'

type HeaderProps = {
  user: User | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="topbar">
      <Link className="brand" to="/auth">
        <span className="brand-mark">NT</span>
        <div>
          <strong>NovaTech</strong>
          <span>Hệ thống tài khoản và phân quyền</span>
        </div>
      </Link>

      <nav className="nav">
        <NavLink to="/auth">{user ? 'Tài khoản' : 'Đăng nhập'}</NavLink>
        {user?.role === 'admin' ? <NavLink to="/admin">Quản trị</NavLink> : null}
      </nav>

      <div className="mini-stat">
        <span>{user ? roleLabels[user.role] : 'Trạng thái'}</span>
        <strong>{user ? user.email.split('@')[0] : 'Chưa đăng nhập'}</strong>
      </div>
    </header>
  )
}
