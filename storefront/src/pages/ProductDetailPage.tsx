import { Link, useParams } from 'react-router-dom'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'

type ProductDetailPageProps = {
  products: Product[]
  onAddToCart: (productId: number) => void
}

export function ProductDetailPage({ products, onAddToCart }: ProductDetailPageProps) {
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
