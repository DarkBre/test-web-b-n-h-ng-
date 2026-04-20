export const week2CartCheckout = {
  week: 2,
  title: 'Giỏ hàng và thanh toán',
  goal: 'Hoàn thiện luồng mua hàng từ thêm sản phẩm vào giỏ đến xác nhận thanh toán.',
  deliverables: [
    'Thêm sản phẩm vào giỏ',
    'Tăng giảm số lượng, xóa sản phẩm',
    'Tính tạm tính và tổng thanh toán',
    'Form checkout',
    'Popup thanh toán thẻ tín dụng',
    'Popup thanh toán chuyển khoản / ví điện tử',
  ],
  mainFiles: ['src/App.tsx', 'src/style.css'],
  relatedSectionsInApp: [
    'CartPage',
    'CheckoutPage',
    'placeOrder',
    'submitCardPayment',
    'submitWalletPayment',
    'payment-modal',
  ],
}
