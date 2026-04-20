export const week3Auth = {
  week: 3,
  title: 'Đăng nhập và điều kiện truy cập giỏ hàng',
  goal: 'Thêm luồng xác thực cơ bản và buộc người dùng đăng nhập trước khi dùng giỏ hàng.',
  deliverables: [
    'Form đăng nhập / đăng ký',
    'Lưu thông tin người dùng vào localStorage',
    'Đăng xuất',
    'Chặn truy cập giỏ hàng nếu chưa đăng nhập',
    'Điều hướng sang trang đăng nhập khi bấm giỏ hàng',
  ],
  mainFiles: ['src/App.tsx', 'src/style.css'],
  relatedSectionsInApp: ['AuthPage', 'user', 'cartTarget', 'cartState', 'Navigate'],
}
