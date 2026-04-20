import { useState } from 'react'
import type { FormEvent } from 'react'
import { categories } from '../data/products'
import type { Category, Product, RegisteredUser } from '../types'
import { formatPrice } from '../utils/format'

type AdminPageProps = {
  accounts: RegisteredUser[]
  ordersCount: number
  productSource: 'local' | 'database'
  products: Product[]
  onAddProduct: (product: Omit<Product, 'id'>) => void | Promise<void>
  onUpdateProduct: (product: Product) => void | Promise<void>
  onDeleteProduct: (productId: number) => void | Promise<void>
}

type ProductForm = {
  id?: number
  name: string
  category: Category
  price: string
  rating: string
  description: string
  image: string
  badge: string
  colors: string
  features: string
}

const emptyForm: ProductForm = {
  name: '',
  category: 'Âm thanh',
  price: '',
  rating: '4.5',
  description: '',
  image: '',
  badge: 'Mới',
  colors: 'Black, White',
  features: 'Bảo hành 12 tháng, Giao nhanh, Hàng chính hãng',
}

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const toProductPayload = (form: ProductForm): Omit<Product, 'id'> => ({
  name: form.name.trim(),
  category: form.category,
  price: Number(form.price),
  rating: Number(form.rating),
  description: form.description.trim(),
  image: form.image.trim(),
  badge: form.badge.trim() || 'Mới',
  colors: splitList(form.colors),
  features: splitList(form.features),
})

export function AdminPage({
  accounts,
  ordersCount,
  productSource,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: AdminPageProps) {
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [message, setMessage] = useState('')
  const isEditing = typeof form.id === 'number'

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const payload = toProductPayload(form)

    if (!payload.name || !payload.description || !payload.image) {
      setMessage('Vui lòng nhập đầy đủ tên, mô tả và ảnh sản phẩm.')
      return
    }

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      setMessage('Giá sản phẩm phải là số lớn hơn 0.')
      return
    }

    if (!Number.isFinite(payload.rating) || payload.rating < 1 || payload.rating > 5) {
      setMessage('Đánh giá phải nằm trong khoảng từ 1 đến 5.')
      return
    }

    if (isEditing) {
      await onUpdateProduct({ ...payload, id: form.id! })
      setMessage('Đã cập nhật sản phẩm.')
    } else {
      await onAddProduct(payload)
      setMessage('Đã thêm sản phẩm mới.')
    }

    setForm(emptyForm)
  }

  const editProduct = (product: Product) => {
    setMessage('')
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: String(product.price),
      rating: String(product.rating),
      description: product.description,
      image: product.image,
      badge: product.badge,
      colors: product.colors.join(', '),
      features: product.features.join(', '),
    })
  }

  const deleteProduct = async (productId: number) => {
    await onDeleteProduct(productId)
    if (form.id === productId) {
      setForm(emptyForm)
    }
    setMessage('Đã xóa sản phẩm khỏi catalog.')
  }

  return (
    <main className="admin-layout page-enter">
      <section className="panel">
        <div className="section-head">
          <h2>Trang quản trị sản phẩm</h2>
          <span>Thêm, sửa, xóa sản phẩm hiển thị trên website</span>
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
          <article className="admin-card">
            <span>Nguồn dữ liệu</span>
            <strong>{productSource === 'database' ? 'MySQL' : 'Local'}</strong>
          </article>
        </div>

        {message ? <div className="auth-notice">{message}</div> : null}

        <form className="checkout-form admin-form" onSubmit={submit}>
          <div className="input-grid">
            <label>
              Tên sản phẩm
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Ví dụ: NovaBook Pro 15"
              />
            </label>
            <label>
              Danh mục
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value as Category })}
              >
                {categories
                  .filter((category): category is Category => category !== 'Tất cả')
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <div className="input-grid">
            <label>
              Giá cơ sở
              <input
                required
                min="1"
                type="number"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                placeholder="349"
              />
            </label>
            <label>
              Đánh giá
              <input
                required
                max="5"
                min="1"
                step="0.1"
                type="number"
                value={form.rating}
                onChange={(event) => setForm({ ...form, rating: event.target.value })}
              />
            </label>
          </div>

          <label>
            Link ảnh sản phẩm
            <input
              required
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
          </label>

          <label>
            Mô tả
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Mô tả ngắn gọn lợi ích nổi bật của sản phẩm"
            />
          </label>

          <div className="input-grid">
            <label>
              Badge
              <input
                value={form.badge}
                onChange={(event) => setForm({ ...form, badge: event.target.value })}
                placeholder="Bán chạy"
              />
            </label>
            <label>
              Màu sắc
              <input
                value={form.colors}
                onChange={(event) => setForm({ ...form, colors: event.target.value })}
                placeholder="Black, White, Silver"
              />
            </label>
          </div>

          <label>
            Tính năng nổi bật
            <input
              value={form.features}
              onChange={(event) => setForm({ ...form, features: event.target.value })}
              placeholder="Pin 18 giờ, Màn 4K, Sạc nhanh"
            />
          </label>

          <div className="admin-actions">
            <button type="submit">{isEditing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button>
            {isEditing ? (
              <button type="button" className="ghost-button" onClick={() => setForm(emptyForm)}>
                Hủy sửa
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Danh sách sản phẩm</h2>
          <span>{products.length} sản phẩm đang hiển thị</span>
        </div>
        <div className="admin-product-list">
          {products.map((product) => (
            <article className="admin-product-row" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>{product.category} · {product.badge}</p>
                <strong>{formatPrice(product.price)}</strong>
              </div>
              <div className="admin-row-actions">
                <button type="button" onClick={() => editProduct(product)}>
                  Sửa
                </button>
                <button type="button" className="ghost-button" onClick={() => deleteProduct(product.id)}>
                  Xóa
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
