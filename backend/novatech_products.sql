CREATE DATABASE IF NOT EXISTS novatech_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE novatech_store;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(2, 1) NOT NULL DEFAULT 4.5,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  badge VARCHAR(80) NOT NULL,
  colors JSON NOT NULL,
  features JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (id, name, email, password_hash, role)
VALUES
  (1, 'Quản trị NovaTech', 'admin@novatech.vn', 'admin123', 'admin');

INSERT INTO products
  (id, name, category, price, rating, description, image, badge, colors, features)
VALUES
  (1, 'Auraloop Pro', 'Âm thanh', 349, 4.9, 'Tai nghe chống ồn cao cấp cho làm việc sâu và di chuyển hằng ngày.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 'Bán chạy', JSON_ARRAY('Graphite', 'Cát', 'Băng'), JSON_ARRAY('ANC thế hệ mới', 'Pin 32 giờ', 'Micro beamforming')),
  (2, 'Pulse Watch X', 'Thiết bị đeo', 279, 4.7, 'Đồng hồ theo dõi sức khỏe, luyện tập và nhận thông báo tức thời.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 'Mới', JSON_ARRAY('Đen', 'Bạc'), JSON_ARRAY('Theo dõi giấc ngủ', 'GPS độc lập', 'Sạc nhanh')),
  (3, 'Nova Console', 'Gaming', 499, 4.8, 'Máy chơi game nhỏ gọn, hỗ trợ 4K và thư viện game đám mây.', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80', 'Giới hạn', JSON_ARRAY('Trắng mờ'), JSON_ARRAY('4K 120Hz', 'SSD 1TB', 'Tay cầm haptic')),
  (4, 'Luma Lamp Air', 'Nhà thông minh', 189, 4.6, 'Đèn bàn thông minh điều chỉnh nhiệt độ màu theo nhịp sinh học.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', 'Smart Home', JSON_ARRAY('Ngọc trai', 'Đá'), JSON_ARRAY('Điều khiển app', 'Cảm biến ánh sáng', 'Hẹn giờ ngủ')),
  (5, 'Echo Mini Speaker', 'Âm thanh', 129, 4.5, 'Loa nhỏ cho bàn làm việc với âm trầm tốt và trợ lý giọng nói tích hợp.', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80', 'Nhỏ gọn', JSON_ARRAY('San hô', 'Midnight'), JSON_ARRAY('Wi-Fi + Bluetooth', 'Stereo pairing', 'Điều khiển giọng nói')),
  (6, 'Orbit VR Kit', 'Gaming', 599, 4.9, 'Kính VR cho trải nghiệm nhập vai với tracking không gian chính xác.', 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=900&q=80', 'Sẵn sàng cho AI', JSON_ARRAY('Carbon'), JSON_ARRAY('6DoF tracking', 'Màn OLED', 'Điều khiển cử chỉ')),
  (7, 'PixelView 4K Monitor', 'Gaming', 429, 4.8, 'Màn hình 4K 27 inch cho làm việc sáng tạo và gaming mượt mà.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80', 'Creator Pick', JSON_ARRAY('Black'), JSON_ARRAY('4K UHD', 'HDR 600', 'USB-C docking')),
  (8, 'Nimbus Mechanical Keyboard', 'Gaming', 159, 4.7, 'Bàn phím cơ layout gọn, switch mượt và RGB tinh tế cho góc setup hiện đại.', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80', 'Setup Favorite', JSON_ARRAY('Graphite', 'White'), JSON_ARRAY('Hot-swap switch', 'RGB per-key', 'Wireless 2.4GHz')),
  (9, 'AeroBook Air 14', 'Nhà thông minh', 899, 4.9, 'Laptop mỏng nhẹ cho học tập, làm việc và giải trí với pin bền cả ngày.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80', 'Best Value', JSON_ARRAY('Silver', 'Midnight'), JSON_ARRAY('Màn 2.8K', 'Pin 18 giờ', 'Intel Evo')),
  (10, 'LensShot Mini Cam', 'Nhà thông minh', 319, 4.6, 'Camera compact quay vlog 4K, tự lấy nét nhanh và thu âm rõ trong mọi khung hình.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80', 'Vlog Ready', JSON_ARRAY('Black'), JSON_ARRAY('4K 60fps', 'Auto focus AI', 'Flip screen')),
  (11, 'HomeHub Mesh Router', 'Nhà thông minh', 229, 4.5, 'Bộ router mesh phát Wi-Fi ổn định cho căn hộ, nhà nhiều tầng và smart home.', 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=900&q=80', 'Wi-Fi 6', JSON_ARRAY('White'), JSON_ARRAY('Wi-Fi 6', 'Phủ sóng 500m2', 'Quản lý app')),
  (12, 'SonicBar Studio', 'Âm thanh', 389, 4.8, 'Soundbar cho TV và phòng khách, âm thanh rõ thoại và hiệu ứng mạnh mẽ.', 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=900&q=80', 'Cinema Sound', JSON_ARRAY('Matte Black'), JSON_ARRAY('Dolby Atmos', 'Subwoofer wireless', 'HDMI eARC')),
  (13, 'FitBand Lite', 'Thiết bị đeo', 99, 4.4, 'Vòng tay theo dõi vận động, nhịp tim và giấc ngủ với thiết kế gọn nhẹ.', 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=80', 'Daily Fitness', JSON_ARRAY('Navy', 'Pink', 'Black'), JSON_ARRAY('Theo dõi nhịp tim', 'Pin 10 ngày', 'Chống nước 5ATM')),
  (14, 'TabFlow 11', 'Nhà thông minh', 549, 4.7, 'Tablet 11 inch cho ghi chú, giải trí và họp online với hiệu năng ổn định.', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80', 'Study Essential', JSON_ARRAY('Silver', 'Blue'), JSON_ARRAY('Màn 120Hz', 'Hỗ trợ bút stylus', 'Quad speakers')),
  (15, 'WavePods Air', 'Âm thanh', 179, 4.6, 'Tai nghe true wireless nhẹ, đeo êm, chống ồn chắc tay và kết nối nhanh.', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80', 'Everyday Pick', JSON_ARRAY('White', 'Graphite'), JSON_ARRAY('ANC hybrid', 'Spatial audio', 'Sạc không dây')),
  (16, 'StreamMic One', 'Âm thanh', 139, 4.5, 'Micro USB cho streamer, podcaster và họp online với chất âm rất sạch.', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80', 'Content Creator', JSON_ARRAY('Black', 'White'), JSON_ARRAY('USB-C', 'Cardioid mode', 'Tap-to-mute'));
