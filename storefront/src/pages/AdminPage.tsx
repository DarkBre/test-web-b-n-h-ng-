import type { Product, User } from '../types'
import { formatPrice } from '../utils/format'

type AdminPageProps = {
  accounts: User[]
  ordersCount: number
  products: Product[]
}

export function AdminPage({ accounts, ordersCount, products }: AdminPageProps) {
  return (
    <main className="admin-layout page-enter">
      <section className="panel">
        <div className="section-head">
          <h2>Trang quản trị</h2>
          <span>Theo dõi tài khoản, giỏ hàng và danh sách sản phẩm hiện có</span>
        </div>

        <div className="admin-grid">
          <article className="admin-card">
            <span>Sản phẩm</span>
            <strong>{products.length}</strong>
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

      <section className="panel">
        <div className="section-head">
          <h2>Danh sách sản phẩm</h2>
          <span>{products.length} sản phẩm đang hiển thị</span>
        </div>

        <div className="admin-product-list">
          {products.length === 0 ? (
            <div className="empty-state">
              <h3>Chưa có sản phẩm</h3>
              <p>Dữ liệu sản phẩm sẽ hiển thị tại đây sau khi được thêm vào CSDL.</p>
            </div>
          ) : null}

          {products.map((product) => (
            <article className="admin-product-row" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>
                  {product.category} · {product.badge}
                </p>
                <strong>{formatPrice(product.price)}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
