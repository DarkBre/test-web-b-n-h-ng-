import { Link } from 'react-router-dom'
import type { CartItem, Product } from '../types'
import { formatPrice } from '../utils/format'

type CartPageProps = {
  cart: CartItem[]
  products: Product[]
  subtotal: number
  onAdjust: (productId: number, delta: number) => void
  onRemove: (productId: number) => void
}

export function CartPage({ cart, products, subtotal, onAdjust, onRemove }: CartPageProps) {
  const items = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId)
      return product ? { ...item, product } : null
    })
    .filter((item): item is CartItem & { product: Product } => Boolean(item))

  return (
    <main className="panel-layout page-enter">
      <section className="panel">
        <div className="section-head">
          <h2>Giỏ hàng</h2>
          <span>{items.length} sản phẩm</span>
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
