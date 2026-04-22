# NovaTech Auth API

Backend hiện chỉ phục vụ chức năng tài khoản: đăng nhập, đăng ký, đăng xuất, kiểm tra phiên đăng nhập và phân quyền.

```text
backend/
  auth.php                     # Wrapper giữ URL cũ
  config/
    database.php               # Kết nối MySQL, CORS, session, JSON helper
  controllers/
    AuthController.php         # Xử lý đăng nhập, đăng ký, đăng xuất, phân quyền
  models/
    User.php                   # Truy vấn bảng users
  public/
    auth.php                   # Entry chính cho API tài khoản
  novatech_auth.sql            # File import phpMyAdmin cho bảng users
```

## Cài đặt nhanh với XAMPP

1. Mở XAMPP và bật `Apache` + `MySQL`.
2. Vào `http://localhost/phpmyadmin`.
3. Chọn tab `Import`.
4. Import file `backend/novatech_auth.sql`.
5. Tạo thư mục `novatech-api` trong thư mục `htdocs` của XAMPP.
6. Copy toàn bộ file bên trong thư mục `backend` vào thư mục đó.

Đường dẫn backend local:

```text
C:\xampp\htdocs\novatech-api
```

Mở thử API:

```text
http://localhost/novatech-api/auth.php?action=list
```

Nếu trả về JSON là backend đã chạy.

## Cấu hình database

Nếu MySQL có mật khẩu, sửa file `config/database.php`:

```php
const DB_USER = 'root';
const DB_PASS = 'mat_khau_cua_ban';
```

## Kết nối frontend

File `storefront/.env.local` cần có:

```env
VITE_API_URL=http://localhost/novatech-api
```

Sau đó chạy frontend:

```bash
cd storefront
npm run dev
```

## API hiện có

- `auth.php?action=login` cho đăng nhập.
- `auth.php?action=register` cho đăng ký.
- `auth.php?action=logout` cho đăng xuất.
- `auth.php?action=me` để kiểm tra phiên đăng nhập hiện tại.
- `auth.php?action=list` để tài khoản admin đã đăng nhập đọc danh sách tài khoản.
