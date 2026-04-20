export function Footer() {
  return (
    <footer className="site-footer compact-footer">
      <div className="compact-footer-brand">
        <div className="brand">
          <span className="brand-mark">NT</span>
          <div>
            <strong>NovaTech</strong>
            <span>Thiết bị công nghệ chọn lọc mỗi ngày</span>
          </div>
        </div>
      </div>
      <div className="compact-footer-meta">
        <div className="footer-links">
          <a href="/" onClick={(event) => event.preventDefault()}>
            Sản phẩm
          </a>
          <a href="/" onClick={(event) => event.preventDefault()}>
            Chính sách
          </a>
          <a href="/" onClick={(event) => event.preventDefault()}>
            Liên hệ
          </a>
        </div>
        <span>2026 NovaTech</span>
      </div>
    </footer>
  )
}
