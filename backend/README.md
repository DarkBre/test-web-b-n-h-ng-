# NovaTech PHP API

Backend được chia theo mô hình MVC đơn giản:

```text
backend/
  auth.php                     # Wrapper giữ URL cũ
  products.php                 # Wrapper giữ URL cũ
  config/
    database.php               # Kết nối MySQL, CORS, JSON helper
  controllers/
    AuthController.php         # Xử lý đăng nhập, đăng ký, phân quyền
    ProductController.php      # Xử lý CRUD sản phẩm
  models/
    User.php                   # Truy vấn bảng users
    Product.php                # Truy vấn bảng products
  public/
    auth.php                   # Entry chính cho API tài khoản
    products.php               # Entry chính cho API sản phẩm
  novatech_products.sql        # File import phpMyAdmin
```

## Cài đặt nhanh với XAMPP

1. Mở XAMPP và bật `Apache` + `MySQL`.
2. Vào `http://localhost/phpmyadmin`.
3. Chọn tab `Import`.
4. Import file `backend/novatech_products.sql`.
5. Tạo thư mục `novatech-api` trong thư mục `htdocs` của XAMPP đang chạy.
6. Copy toàn bộ file bên trong thư mục `backend` vào thư mục đó.

Trên máy hiện tại, Apache đang đọc `C:\xampp\htdocs`, nên backend đã được đồng bộ vào:

```text
C:\xampp\htdocs\novatech-api
```

Nếu bạn cấu hình Apache đọc ổ D thì dùng:

```text
D:\xampp\htdocs\novatech-api
```

7. Mở thử API:

```text
http://localhost/novatech-api/products.php
http://localhost/novatech-api/auth.php?action=list
```

Nếu trả về JSON là backend đã chạy.

## Tài khoản demo

```text
Admin: admin@novatech.vn / admin123
Khách hàng: user@novatech.vn / user123
```

## Cấu hình database

Nếu MySQL của bạn có mật khẩu, sửa file `config/database.php`:

```php
const DB_USER = 'root';
const DB_PASS = 'mat_khau_cua_ban';
```

## Kết nối frontend

File `storefront/.env.local` cần có:

```env
VITE_API_URL=http://localhost/novatech-api
```

Sau đó chạy lại frontend:

```bash
cd storefront
npm run dev
```

Frontend hiện dùng:

- `products.php` cho danh sách sản phẩm và trang admin thêm/sửa/xóa sản phẩm.
- `auth.php?action=login` cho đăng nhập.
- `auth.php?action=register` cho đăng ký.
- `auth.php?action=list` để trang admin đọc danh sách tài khoản.
