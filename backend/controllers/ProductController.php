<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Product.php';

class ProductController
{
    public function handle(): void
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $this->index();
            }

            send_json(['message' => 'API sản phẩm chỉ hỗ trợ đọc danh sách.'], 405);
        } catch (Throwable $error) {
            send_json(['message' => $error->getMessage()], 500);
        }
    }

    private function index(): void
    {
        send_json(Product::all());
    }
}
