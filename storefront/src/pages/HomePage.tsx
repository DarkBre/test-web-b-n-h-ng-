import { Link } from 'react-router-dom'
import { HeroProductSlider } from '../components/HeroProductSlider'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'

const highlights = [
  { label: 'Ưu đãi hôm nay', value: 'Mua 2 giảm thêm 10%' },
  { label: 'Giao nhanh', value: 'Nhận hàng trong ngày tại nội thành' },
  { label: 'Tư vấn chuyên sâu', value: 'Chọn đúng sản phẩm với hỗ trợ 24/7' },
]

type HomePageProps = {
  categories: string[]
  products: Product[]
  category: string
  search: string
  setCategory: (value: string) => void
  setSearch: (value: string) => void
  onAddToCart: (productId: number) => void
}

export function HomePage({
  categories,
  products,
  category,
  search,
  setCategory,
  setSearch,
  onAddToCart,
}: HomePageProps) {
  return (
    <main className="page-enter">
      <section className="hero-banner">
        <div className="hero-copy-block">
          <p className="eyebrow">Công nghệ chọn lọc cho phong cách sống hiện đại</p>
          <h1>Nâng cấp trải nghiệm mỗi ngày với những thiết bị đáng mua nhất mùa này.</h1>
          <p className="hero-copy">
            Từ tai nghe cao cấp, smartwatch theo dõi sức khỏe đến gaming gear hiệu năng mạnh,
            NovaTech mang đến bộ sưu tập chính hãng, thiết kế đẹp và mức giá hấp dẫn để bạn chọn
            mua dễ dàng hơn bao giờ hết.
          </p>

          <div className="hero-actions">
            <a className="primary-link hero-link" href="#products">
              Mua ngay bộ sưu tập nổi bật
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

        <HeroProductSlider products={products} />
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
