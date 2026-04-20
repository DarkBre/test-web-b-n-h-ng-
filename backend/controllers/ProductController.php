<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Product.php';

class ProductController
{
    public function handle(): void
    {
        try {
            match ($_SERVER['REQUEST_METHOD']) {
                'GET' => $this->index(),
                'POST' => $this->store(),
                'PUT' => $this->update(),
                'DELETE' => $this->destroy(),
                default => send_json(['message' => 'Method không được hỗ trợ.'], 405),
            };
        } catch (Throwable $error) {
            send_json(['message' => $error->getMessage()], 500);
        }
    }

    private function index(): void
    {
        send_json(Product::all());
    }

    private function store(): void
    {
        send_json(Product::create($this->validatedProduct()), 201);
    }

    private function update(): void
    {
        $id = $this->productId();
        send_json(Product::update($id, $this->validatedProduct()));
    }

    private function destroy(): void
    {
        Product::delete($this->productId());
        send_json(['ok' => true]);
    }

    private function productId(): int
    {
        $id = (int) ($_GET['id'] ?? 0);

        if ($id <= 0) {
            send_json(['message' => 'Thiếu id sản phẩm.'], 400);
        }

        return $id;
    }

    private function validatedProduct(): array
    {
        $data = request_json();
        $required = ['name', 'category', 'price', 'rating', 'description', 'image', 'badge', 'colors', 'features'];

        foreach ($required as $field) {
            if (!array_key_exists($field, $data)) {
                send_json(['message' => "Thiếu trường $field."], 400);
            }
        }

        $colors = is_array($data['colors']) ? $data['colors'] : [];
        $features = is_array($data['features']) ? $data['features'] : [];

        return [
            'name' => trim((string) $data['name']),
            'category' => trim((string) $data['category']),
            'price' => (float) $data['price'],
            'rating' => (float) $data['rating'],
            'description' => trim((string) $data['description']),
            'image' => trim((string) $data['image']),
            'badge' => trim((string) $data['badge']),
            'colors' => json_encode(array_values($colors), JSON_UNESCAPED_UNICODE),
            'features' => json_encode(array_values($features), JSON_UNESCAPED_UNICODE),
        ];
    }
}
