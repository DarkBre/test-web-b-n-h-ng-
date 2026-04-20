<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

class Product
{
    public static function all(): array
    {
        $statement = db()->query('SELECT * FROM products ORDER BY id ASC');

        return array_map([self::class, 'fromRow'], $statement->fetchAll());
    }

    public static function create(array $product): array
    {
        $statement = db()->prepare(
            'INSERT INTO products (name, category, price, rating, description, image, badge, colors, features)
             VALUES (:name, :category, :price, :rating, :description, :image, :badge, :colors, :features)'
        );
        $statement->execute($product);

        return self::response((int) db()->lastInsertId(), $product);
    }

    public static function update(int $id, array $product): array
    {
        $statement = db()->prepare(
            'UPDATE products
             SET name = :name, category = :category, price = :price, rating = :rating,
                 description = :description, image = :image, badge = :badge, colors = :colors, features = :features
             WHERE id = :id'
        );
        $statement->execute(array_merge(['id' => $id], $product));

        return self::response($id, $product);
    }

    public static function delete(int $id): void
    {
        $statement = db()->prepare('DELETE FROM products WHERE id = :id');
        $statement->execute(['id' => $id]);
    }

    private static function fromRow(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'category' => $row['category'],
            'price' => (float) $row['price'],
            'rating' => (float) $row['rating'],
            'description' => $row['description'],
            'image' => $row['image'],
            'badge' => $row['badge'],
            'colors' => json_decode($row['colors'], true) ?: [],
            'features' => json_decode($row['features'], true) ?: [],
        ];
    }

    private static function response(int $id, array $product): array
    {
        return array_merge(
            ['id' => $id],
            $product,
            [
                'colors' => json_decode($product['colors'], true) ?: [],
                'features' => json_decode($product['features'], true) ?: [],
            ],
        );
    }
}
