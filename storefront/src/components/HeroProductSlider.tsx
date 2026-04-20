import { useEffect, useState } from 'react'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'

export function HeroProductSlider({ products }: { products: Product[] }) {
  const featuredProducts = products.slice(0, 4)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProduct = featuredProducts[activeIndex]

  useEffect(() => {
    if (!featuredProducts.length) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredProducts.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [featuredProducts.length])

  useEffect(() => {
    setActiveIndex(0)
  }, [products])

  if (!activeProduct) {
    return null
  }

  const showPrev = () => {
    setActiveIndex((current) => (current - 1 + featuredProducts.length) % featuredProducts.length)
  }

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % featuredProducts.length)
  }

  return (
    <aside
      className="hero-card spotlight-card hero-slider"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(10, 24, 43, 0.18), rgba(10, 24, 43, 0.78)), url(${activeProduct.image})`,
      }}
    >
      <div className="hero-slider-top">
        <div className="hero-slider-copy">
          <span className="hero-slider-badge">{activeProduct.badge}</span>
          <strong>{activeProduct.name}</strong>
          <p>{activeProduct.description}</p>
        </div>
        <div className="hero-slider-controls">
          <button type="button" onClick={showPrev} aria-label="Sản phẩm trước">
            ‹
          </button>
          <button type="button" onClick={showNext} aria-label="Sản phẩm tiếp theo">
            ›
          </button>
        </div>
      </div>

      <div className="hero-card-line" />

      <div className="hero-slider-bottom">
        <div className="hero-slider-price">
          <span>Giá nổi bật</span>
          <strong>{formatPrice(activeProduct.price)}</strong>
        </div>
        <div className="hero-slider-meta">
          <div>
            <strong>{activeProduct.rating}/5</strong>
            <span>Đánh giá khách hàng</span>
          </div>
          <div>
            <strong>{activeProduct.features[0]}</strong>
            <span>Tính năng nổi bật</span>
          </div>
        </div>
      </div>

      <div className="hero-slider-dots">
        {featuredProducts.map((product, index) => (
          <button
            key={product.id}
            type="button"
            className={index === activeIndex ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
            aria-label={`Xem ${product.name}`}
          />
        ))}
      </div>
    </aside>
  )
}
