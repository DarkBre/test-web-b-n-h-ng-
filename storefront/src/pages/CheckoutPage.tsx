import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CartItem, Product, User } from '../types'
import {
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  formatPrice,
  isValidExpiry,
} from '../utils/format'

type CheckoutPageProps = {
  cart: CartItem[]
  products: Product[]
  subtotal: number
  user: User | null
  onCheckoutSuccess: () => void
}

export function CheckoutPage({
  cart,
  products,
  subtotal,
  user,
  onCheckoutSuccess,
}: CheckoutPageProps) {
  const navigate = useNavigate()
  const [ordered, setOrdered] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [cardError, setCardError] = useState('')
  const [walletError, setWalletError] = useState('')
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    address: '',
    payment: 'cod',
  })
  const [cardForm, setCardForm] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: '',
  })
  const [walletForm, setWalletForm] = useState({
    bank: 'vietcombank',
    accountNumber: '',
  })

  const items = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId)
      return product ? { ...item, product } : null
    })
    .filter((item): item is CartItem & { product: Product } => Boolean(item))

  const finalizeOrder = () => {
    setOrdered(true)
    setShowCardModal(false)
    setShowWalletModal(false)
    setCardError('')
    setWalletError('')
    onCheckoutSuccess()
  }

  const placeOrder = (event: FormEvent) => {
    event.preventDefault()

    if (form.payment === 'card') {
      setCardError('')
      setShowCardModal(true)
      return
    }

    if (form.payment === 'wallet') {
      setWalletError('')
      setShowWalletModal(true)
      return
    }

    finalizeOrder()
  }

  const submitCardPayment = (event: FormEvent) => {
    event.preventDefault()

    if (digitsOnly(cardForm.number).length !== 16) {
      setCardError('Số thẻ phải gồm đúng 16 chữ số.')
      return
    }

    if (!isValidExpiry(cardForm.expiry)) {
      setCardError('Ngày hết hạn không hợp lệ. Vui lòng nhập theo định dạng MM/YY.')
      return
    }

    if (digitsOnly(cardForm.cvv).length < 3) {
      setCardError('CVV phải gồm 3 hoặc 4 chữ số.')
      return
    }

    finalizeOrder()
  }

  const submitWalletPayment = (event: FormEvent) => {
    event.preventDefault()

    if (digitsOnly(walletForm.accountNumber).length < 8) {
      setWalletError('Số tài khoản phải có ít nhất 8 chữ số.')
      return
    }

    finalizeOrder()
  }

  return (
    <>
      <main className="panel-layout page-enter">
        <section className="panel">
          <div className="section-head">
            <h2>Thanh toán</h2>
            <span>{ordered ? 'Đặt hàng thành công' : 'Hoàn tất trong 1 bước'}</span>
          </div>
          {ordered ? (
            <div className="success-box">
              <h3>Đơn hàng đã được ghi nhận</h3>
              <p>
                Xác nhận đơn sẽ được gửi tới <strong>{form.email || 'email của bạn'}</strong> trong
                vài phút.
              </p>
              <button onClick={() => navigate('/')}>Quay về trang chủ</button>
            </div>
          ) : (
            <form className="checkout-form" onSubmit={placeOrder}>
              <div className="input-grid">
                <label>
                  Họ tên
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                </label>
              </div>
              <label>
                Địa chỉ giao hàng
                <textarea
                  required
                  rows={4}
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                />
              </label>
              <label>
                Phương thức thanh toán
                <select
                  value={form.payment}
                  onChange={(event) => setForm({ ...form, payment: event.target.value })}
                >
                  <option value="cod">Thanh toán khi nhận hàng</option>
                  <option value="card">Thẻ tín dụng</option>
                  <option value="wallet">Ví điện tử</option>
                </select>
              </label>
              <button type="submit" disabled={!items.length}>
                Xác nhận thanh toán
              </button>
            </form>
          )}
        </section>

        <aside className="summary-card">
          <h3>Đơn hàng của bạn</h3>
          {items.map((item) => (
            <div className="summary-line" key={item.productId}>
              <span>
                {item.product.name} x{item.quantity}
              </span>
              <strong>{formatPrice(item.product.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-line total">
            <span>Tổng thanh toán</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
        </aside>
      </main>

      {showCardModal ? (
        <div
          className="payment-modal-backdrop"
          role="presentation"
          onClick={() => setShowCardModal(false)}
        >
          <section
            className="payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-payment-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="payment-modal-head">
              <div>
                <p className="eyebrow">Thanh toán bảo mật</p>
                <h3 id="card-payment-title">Thông tin thẻ tín dụng</h3>
                <p className="payment-modal-copy">
                  Hoàn tất thanh toán trong một bước với biểu mẫu được mã hóa và xác thực an toàn.
                </p>
              </div>
              <button
                type="button"
                className="ghost-button modal-close"
                onClick={() => setShowCardModal(false)}
              >
                Đóng
              </button>
            </div>

            <div className="payment-card-preview">
              <span className="payment-card-chip" />
              <div className="payment-card-brand">VISA / MASTERCARD</div>
              <strong>{cardForm.number || '1234 5678 9012 3456'}</strong>
              <div className="payment-card-meta">
                <div>
                  <span>Tên chủ thẻ</span>
                  <strong>{cardForm.holder || 'NGUYEN VAN A'}</strong>
                </div>
                <div>
                  <span>Hiệu lực</span>
                  <strong>{cardForm.expiry || 'MM/YY'}</strong>
                </div>
              </div>
            </div>

            <form className="checkout-form payment-form" onSubmit={submitCardPayment}>
              <label>
                Tên chủ thẻ
                <input
                  required
                  value={cardForm.holder}
                  onChange={(event) => setCardForm({ ...cardForm, holder: event.target.value })}
                  placeholder="NGUYEN VAN A"
                />
              </label>

              <label>
                Số thẻ
                <input
                  required
                  inputMode="numeric"
                  maxLength={19}
                  value={cardForm.number}
                  onChange={(event) => {
                    setCardError('')
                    setCardForm({ ...cardForm, number: formatCardNumber(event.target.value) })
                  }}
                  placeholder="1234 5678 9012 3456"
                />
              </label>

              <div className="input-grid">
                <label>
                  Ngày hết hạn
                  <input
                    required
                    value={cardForm.expiry}
                    onChange={(event) => {
                      setCardError('')
                      setCardForm({ ...cardForm, expiry: formatExpiry(event.target.value) })
                    }}
                    placeholder="MM/YY"
                  />
                </label>
                <label>
                  CVV
                  <input
                    required
                    inputMode="numeric"
                    maxLength={4}
                    value={cardForm.cvv}
                    onChange={(event) => {
                      setCardError('')
                      setCardForm({
                        ...cardForm,
                        cvv: digitsOnly(event.target.value).slice(0, 4),
                      })
                    }}
                    placeholder="123"
                  />
                </label>
              </div>

              {cardError ? <div className="payment-error">{cardError}</div> : null}

              <div className="payment-modal-footer">
                <div className="payment-modal-summary">
                  <span>Tổng cần thanh toán</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                <div className="payment-trust-note">
                  Thông tin thẻ chỉ dùng cho giao dịch hiện tại và không được lưu trên trình duyệt.
                </div>
                <button type="submit">Xác nhận thanh toán thẻ</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {showWalletModal ? (
        <div
          className="payment-modal-backdrop"
          role="presentation"
          onClick={() => setShowWalletModal(false)}
        >
          <section
            className="payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-payment-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="payment-modal-head">
              <div>
                <p className="eyebrow">Thanh toán chuyển khoản</p>
                <h3 id="wallet-payment-title">Chọn ngân hàng và số tài khoản</h3>
                <p className="payment-modal-copy">
                  Chọn ngân hàng thanh toán phù hợp và nhập đúng số tài khoản để tiếp tục xử lý đơn
                  hàng.
                </p>
              </div>
              <button
                type="button"
                className="ghost-button modal-close"
                onClick={() => setShowWalletModal(false)}
              >
                Đóng
              </button>
            </div>

            <div className="payment-card-preview wallet-preview">
              <div className="wallet-preview-badge">Chuyển khoản nhanh 24/7</div>
              <strong>
                {walletForm.bank === 'vietcombank' && 'Vietcombank'}
                {walletForm.bank === 'techcombank' && 'Techcombank'}
                {walletForm.bank === 'mbbank' && 'MB Bank'}
                {walletForm.bank === 'acb' && 'ACB'}
              </strong>
              <div className="payment-card-meta">
                <div>
                  <span>Số tài khoản</span>
                  <strong>{walletForm.accountNumber || 'Nhập số tài khoản ngân hàng'}</strong>
                </div>
                <div>
                  <span>Tổng thanh toán</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
              </div>
            </div>

            <form className="checkout-form payment-form" onSubmit={submitWalletPayment}>
              <label>
                Ngân hàng
                <select
                  value={walletForm.bank}
                  onChange={(event) => {
                    setWalletError('')
                    setWalletForm({ ...walletForm, bank: event.target.value })
                  }}
                >
                  <option value="vietcombank">Vietcombank</option>
                  <option value="techcombank">Techcombank</option>
                  <option value="mbbank">MB Bank</option>
                  <option value="acb">ACB</option>
                </select>
              </label>

              <label>
                Số tài khoản ngân hàng
                <input
                  required
                  inputMode="numeric"
                  value={walletForm.accountNumber}
                  onChange={(event) => {
                    setWalletError('')
                    setWalletForm({
                      ...walletForm,
                      accountNumber: digitsOnly(event.target.value).slice(0, 20),
                    })
                  }}
                  placeholder="Nhập số tài khoản"
                />
              </label>

              {walletError ? <div className="payment-error">{walletError}</div> : null}

              <div className="payment-modal-footer">
                <div className="payment-modal-summary">
                  <span>Hình thức</span>
                  <strong>Chuyển khoản ngân hàng</strong>
                </div>
                <div className="payment-trust-note">
                  Vui lòng kiểm tra kỹ ngân hàng và số tài khoản trước khi xác nhận thanh toán.
                </div>
                <button type="submit">Xác nhận thông tin chuyển khoản</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  )
}
