import type { User } from '../types'

type AdminPageProps = {
  accounts: User[]
  ordersCount: number
}

export function AdminPage({ accounts, ordersCount }: AdminPageProps) {
  return (
    <main className="admin-layout page-enter">
      <section className="panel">
        <div className="section-head">
          <h2>Trang quản trị</h2>
          <span>Theo dõi tài khoản và giỏ hàng hiện có</span>
        </div>

        <div className="admin-grid">
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
    </main>
  )
}
