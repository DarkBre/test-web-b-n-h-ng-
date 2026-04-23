import type { Product } from '../types'

export const products: Product[] = [
  {
    id: 1,
    name: 'MacBook Air M3 13 inch',
    category: 'Laptop',
    description: 'Laptop má»ng nháº¹, pin lÃ¢u vÃ  váº­n hÃ nh á»•n Ä‘á»‹nh cho há»c táº­p, lÃ m viá»‡c vÄƒn phÃ²ng vÃ  láº­p trÃ¬nh.',
    price: 31990000,
    imageUrl:
      'https://images.pexels.com/photos/6006082/pexels-photo-6006082.jpeg?cs=srgb&dl=pexels-carlos-montelara-3450804-6006082.jpg&fm=jpg',
    stock: 12,
    badge: 'BÃ¡n cháº¡y',
  },
  {
    id: 2,
    name: 'ASUS ROG Zephyrus G16',
    category: 'Laptop',
    description: 'Laptop gaming hiá»‡u nÄƒng cao vá»›i mÃ n hÃ¬nh mÆ°á»£t, phÃ¹ há»£p chÆ¡i game, thiáº¿t káº¿ vÃ  xá»­ lÃ½ Ä‘a nhiá»‡m.',
    price: 48990000,
    imageUrl:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
    stock: 8,
    badge: 'Má»›i',
  },
  {
    id: 3,
    name: 'iPhone 16 Pro',
    category: 'Äiá»‡n thoáº¡i',
    description: 'Äiá»‡n thoáº¡i cao cáº¥p vá»›i camera cháº¥t lÆ°á»£ng, hiá»‡u nÄƒng máº¡nh vÃ  mÃ n hÃ¬nh Ä‘áº¹p cho nhu cáº§u háº±ng ngÃ y.',
    price: 28990000,
    imageUrl:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    stock: 15,
    badge: 'Hot',
  },
  {
    id: 4,
    name: 'Samsung Galaxy S25',
    category: 'Äiá»‡n thoáº¡i',
    description: 'Smartphone Android cao cáº¥p vá»›i mÃ n hÃ¬nh sáº¯c nÃ©t, hiá»‡u nÄƒng á»•n Ä‘á»‹nh vÃ  há»‡ camera linh hoáº¡t.',
    price: 24990000,
    imageUrl:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
    stock: 11,
    badge: 'Æ¯u Ä‘Ã£i',
  },
  {
    id: 5,
    name: 'iPad Air M2',
    category: 'MÃ¡y tÃ­nh báº£ng',
    description: 'MÃ¡y tÃ­nh báº£ng gá»n nháº¹, há»— trá»£ há»c táº­p, ghi chÃº, xem tÃ i liá»‡u vÃ  giáº£i trÃ­ Ä‘a phÆ°Æ¡ng tiá»‡n.',
    price: 18990000,
    imageUrl:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80',
    stock: 10,
    badge: 'Há»c táº­p',
  },
  {
    id: 6,
    name: 'Sony WH-1000XM5',
    category: 'Tai nghe',
    description: 'Tai nghe chá»‘ng á»“n chá»§ Ä‘á»™ng vá»›i Ã¢m thanh chi tiáº¿t, phÃ¹ há»£p lÃ m viá»‡c, há»c táº­p vÃ  di chuyá»ƒn.',
    price: 7990000,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    stock: 24,
    badge: 'Ã‚m thanh tá»‘t',
  },
  {
    id: 7,
    name: 'AirPods Pro 2',
    category: 'Tai nghe',
    description: 'Tai nghe khÃ´ng dÃ¢y nhá» gá»n, káº¿t ná»‘i nhanh, tiá»‡n lá»£i cho ngÆ°á»i dÃ¹ng há»‡ sinh thÃ¡i Apple.',
    price: 5990000,
    imageUrl:
      'https://images.pexels.com/photos/16149965/pexels-photo-16149965.jpeg?cs=srgb&dl=pexels-rubaitulazad-16149965.jpg&fm=jpg',
    stock: 20,
    badge: 'KhÃ´ng dÃ¢y',
  },
  {
    id: 8,
    name: 'LG UltraGear 27 inch QHD',
    category: 'MÃ n hÃ¬nh',
    description: 'MÃ n hÃ¬nh QHD táº§n sá»‘ quÃ©t cao, phÃ¹ há»£p chÆ¡i game vÃ  lÃ m viá»‡c thiáº¿t káº¿ trong khÃ´ng gian hiá»‡n Ä‘áº¡i.',
    price: 8990000,
    imageUrl:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    stock: 9,
    badge: 'QHD 165Hz',
  },
  {
    id: 9,
    name: 'Logitech MX Master 3S',
    category: 'Phá»¥ kiá»‡n',
    description: 'Chuá»™t khÃ´ng dÃ¢y cao cáº¥p cho dÃ¢n vÄƒn phÃ²ng vÃ  sÃ¡ng táº¡o ná»™i dung, thao tÃ¡c Ãªm vÃ  chÃ­nh xÃ¡c.',
    price: 2490000,
    imageUrl:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80',
    stock: 18,
    badge: 'LÃ m viá»‡c',
  },
  {
    id: 10,
    name: 'Keychron K8 Pro',
    category: 'Phá»¥ kiá»‡n',
    description: 'BÃ n phÃ­m cÆ¡ khÃ´ng dÃ¢y há»— trá»£ nhiá»u há»‡ Ä‘iá»u hÃ nh, gÃµ tá»‘t vÃ  phÃ¹ há»£p cho há»c táº­p, lÃ m viá»‡c.',
    price: 2990000,
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80',
    stock: 14,
    badge: 'CÆ¡ há»c',
  },
  {
    id: 11,
    name: 'Apple Watch Series 10',
    category: 'Äá»“ng há»“',
    description: 'Äá»“ng há»“ thÃ´ng minh theo dÃµi sá»©c khá»e, giáº¥c ngá»§, luyá»‡n táº­p vÃ  Ä‘á»“ng bá»™ tá»‘t vá»›i Ä‘iá»‡n thoáº¡i.',
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
    description: 'Loa Bluetooth di Ä‘á»™ng vá»›i Ã¢m thanh máº¡nh, thá»i lÆ°á»£ng pin dÃ i vÃ  kiá»ƒu dÃ¡ng cá»• Ä‘iá»ƒn ná»•i báº­t.',
    price: 4290000,
    imageUrl:
      'https://images.pexels.com/photos/14941996/pexels-photo-14941996.jpeg?cs=srgb&dl=pexels-sai-krishna-179319646-14941996.jpg&fm=jpg',
    stock: 13,
    badge: 'Bluetooth',
  },
]
