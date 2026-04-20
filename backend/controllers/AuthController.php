<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/User.php';

class AuthController
{
    public function handle(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';

        try {
            if ($method === 'GET' && $action === 'list') {
                $this->index();
            }

            if ($method === 'POST' && $action === 'login') {
                $this->login();
            }

            if ($method === 'POST' && $action === 'register') {
                $this->register();
            }

            send_json(['message' => 'API tài khoản không hợp lệ.'], 404);
        } catch (Throwable $error) {
            send_json(['message' => $error->getMessage()], 500);
        }
    }

    private function index(): void
    {
        send_json(UserModel::all());
    }

    private function login(): void
    {
        $data = request_json();
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        if ($email === '' || $password === '') {
            send_json(['message' => 'Vui lòng nhập email và mật khẩu.'], 400);
        }

        $user = UserModel::findByEmail($email);

        if (!$user || !$this->passwordIsValid($password, (string) $user['password_hash'])) {
            send_json(['message' => 'Email hoặc mật khẩu không đúng.'], 401);
        }

        send_json([
            'message' => 'Đăng nhập thành công.',
            'user' => UserModel::publicUser($user),
        ]);
    }

    private function register(): void
    {
        $data = request_json();
        $name = trim((string) ($data['name'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        $role = $this->validRole((string) ($data['role'] ?? 'customer'));

        if ($name === '' || $email === '' || $password === '') {
            send_json(['message' => 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.'], 400);
        }

        if (strlen($password) < 6) {
            send_json(['message' => 'Mật khẩu cần có ít nhất 6 ký tự.'], 400);
        }

        if (UserModel::exists($email)) {
            send_json(['message' => 'Email này đã được đăng ký.'], 409);
        }

        send_json([
            'message' => 'Tạo tài khoản thành công.',
            'user' => UserModel::create($name, $email, $password, $role),
        ], 201);
    }

    private function validRole(string $role): string
    {
        return in_array($role, ['customer', 'admin'], true) ? $role : 'customer';
    }

    private function passwordIsValid(string $password, string $storedPassword): bool
    {
        $isHash = str_starts_with($storedPassword, '$2y$');

        return $isHash
            ? password_verify($password, $storedPassword)
            : hash_equals($storedPassword, $password);
    }
}
