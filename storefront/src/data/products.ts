import type { Product } from '../types'

export const products: Product[] = [
  {
    id: 1,
    name: 'MacBook Air M3 13 inch',
    category: 'Laptop',
    description: 'Laptop mỏng nhẹ, pin lâu và vận hành ổn định cho học tập, làm việc văn phòng và lập trình.',
    price: 31990000,
    imageUrl:
      'https://images.pexels.com/photos/6006082/pexels-photo-6006082.jpeg?cs=srgb&dl=pexels-carlos-montelara-3450804-6006082.jpg&fm=jpg',
    stock: 12,
    badge: 'Bán chạy',
  },
  {
    id: 2,
    name: 'ASUS ROG Zephyrus G16',
    category: 'Laptop',
    description: 'Laptop gaming hiệu năng cao với màn hình mượt, phù hợp chơi game, thiết kế và xử lý đa nhiệm.',
    price: 48990000,
    imageUrl:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
    stock: 8,
    badge: 'Mới',
  },
  {
    id: 3,
    name: 'iPhone 16 Pro',
    category: 'Điện thoại',
    description: 'Điện thoại cao cấp với camera chất lượng, hiệu năng mạnh và màn hình đẹp cho nhu cầu hằng ngày.',
    price: 28990000,
    imageUrl:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    stock: 15,
    badge: 'Hot',
  },
  {
    id: 4,
    name: 'Samsung Galaxy S25',
    category: 'Điện thoại',
    description: 'Smartphone Android cao cấp với màn hình sắc nét, hiệu năng ổn định và hệ camera linh hoạt.',
    price: 24990000,
    imageUrl:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
    stock: 11,
    badge: 'Ưu đãi',
  },
  {
    id: 5,
    name: 'iPad Air M2',
    category: 'Máy tính bảng',
    description: 'Máy tính bảng gọn nhẹ, hỗ trợ học tập, ghi chú, xem tài liệu và giải trí đa phương tiện.',
    price: 18990000,
    imageUrl:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80',
    stock: 10,
    badge: 'Học tập',
  },
  {
    id: 6,
    name: 'Sony WH-1000XM5',
    category: 'Tai nghe',
    description: 'Tai nghe chống ồn chủ động với âm thanh chi tiết, phù hợp làm việc, học tập và di chuyển.',
    price: 7990000,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    stock: 24,
    badge: 'Âm thanh tốt',
  },
  {
    id: 7,
    name: 'AirPods Pro 2',
    category: 'Tai nghe',
    description: 'Tai nghe không dây nhỏ gọn, kết nối nhanh, tiện lợi cho người dùng hệ sinh thái Apple.',
    price: 5990000,
    imageUrl:
      'https://images.pexels.com/photos/16149965/pexels-photo-16149965.jpeg?cs=srgb&dl=pexels-rubaitulazad-16149965.jpg&fm=jpg',
    stock: 20,
    badge: 'Không dây',
  },
  {
    id: 8,
    name: 'LG UltraGear 27 inch QHD',
    category: 'Màn hình',
    description: 'Màn hình QHD tần số quét cao, phù hợp chơi game và làm việc thiết kế trong không gian hiện đại.',
    price: 8990000,
    imageUrl:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    stock: 9,
    badge: 'QHD 165Hz',
  },
  {
    id: 9,
    name: 'Logitech MX Master 3S',
    category: 'Phụ kiện',
    description: 'Chuột không dây cao cấp cho dân văn phòng và sáng tạo nội dung, thao tác êm và chính xác.',
    price: 2490000,
    imageUrl:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80',
    stock: 18,
    badge: 'Làm việc',
  },
  {
    id: 10,
    name: 'Keychron K8 Pro',
    category: 'Phụ kiện',
    description: 'Bàn phím cơ không dây hỗ trợ nhiều hệ điều hành, gõ tốt và phù hợp cho học tập, làm việc.',
    price: 2990000,
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80',
    stock: 14,
    badge: 'Cơ học',
  },
  {
    id: 11,
    name: 'Apple Watch Series 10',
    category: 'Đồng hồ',
    description: 'Đồng hồ thông minh theo dõi sức khỏe, giấc ngủ, luyện tập và đồng bộ tốt với điện thoại.',
    price: 11990000,
    imageUrl:
      'https://images.pexels.com/photos/1682821/pexels-photo-1682821.jpeg?cs=srgb&dl=pexels-ingo-1682821.jpg&fm=jpg',
    stock: 16,
    badge: 'Smartwatch',
  },
  {
    id: 12,
    name: 'Marshall Emberton II',
    category: 'Loa',
    description: 'Loa Bluetooth di động với âm thanh mạnh, thời lượng pin dài và kiểu dáng cổ điển nổi bật.',
    price: 4290000,
    imageUrl:
      'https://images.pexels.com/photos/14941996/pexels-photo-14941996.jpeg?cs=srgb&dl=pexels-sai-krishna-179319646-14941996.jpg&fm=jpg',
    stock: 13,
    badge: 'Bluetooth',
  },
]
