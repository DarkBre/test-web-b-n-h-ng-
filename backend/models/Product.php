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
}
