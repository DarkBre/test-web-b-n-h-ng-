import type { User } from '../types'
import { roleLabels } from '../utils/auth'

type AdminPageProps = {
  accounts: User[]
}

export function AdminPage({ accounts }: AdminPageProps) {
  return (
    <main className="admin-layout page-enter">
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Quản trị viên</p>
            <h1>Trang phân quyền tài khoản</h1>
          </div>
          <span>{accounts.length} tài khoản trong hệ thống</span>
        </div>

        <div className="account-list">
          {accounts.length === 0 ? (
            <div className="empty-state">
              <h3>Chưa tải được danh sách tài khoản</h3>
              <p>Hãy kiểm tra backend XAMPP và API auth.php?action=list.</p>
            </div>
          ) : null}

          {accounts.map((account) => (
            <article className="account-row" key={account.email}>
              <div>
                <h3>{account.name}</h3>
                <p>{account.email}</p>
              </div>
              <span className="role-pill">{roleLabels[account.role]}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
