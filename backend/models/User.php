<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

class UserModel
{
    public static function all(): array
    {
        $statement = db()->query('SELECT id, name, email, role FROM users ORDER BY id ASC');

        return array_map([self::class, 'publicUser'], $statement->fetchAll());
    }

    public static function findByEmail(string $email): array|null
    {
        $statement = db()->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);
        $user = $statement->fetch();

        return $user ?: null;
    }

    public static function exists(string $email): bool
    {
        $statement = db()->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);

        return (bool) $statement->fetch();
    }

    public static function create(string $name, string $email, string $password, string $role): array
    {
        $statement = db()->prepare(
            'INSERT INTO users (name, email, password_hash, role)
             VALUES (:name, :email, :password_hash, :role)'
        );
        $statement->execute([
            'name' => $name,
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'role' => $role,
        ]);

        return [
            'id' => (int) db()->lastInsertId(),
            'name' => $name,
            'email' => $email,
            'role' => $role,
        ];
    }

    public static function publicUser(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'role' => $row['role'],
        ];
    }
}
