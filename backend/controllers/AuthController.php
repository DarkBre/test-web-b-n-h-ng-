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

            if ($method === 'GET' && $action === 'me') {
                $this->me();
            }

            if ($method === 'POST' && $action === 'login') {
                $this->login();
            }

            if ($method === 'POST' && $action === 'register') {
                $this->register();
            }

            if ($method === 'POST' && $action === 'logout') {
                $this->logout();
            }

            send_json(['message' => 'API tài khoản không hợp lệ.'], 404);
        } catch (Throwable $error) {
            send_json(['message' => $error->getMessage()], 500);
        }
    }

    private function index(): void
    {
        $this->requireAdmin();
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

        session_regenerate_id(true);
        $_SESSION['user_id'] = (int) $user['id'];
        $_SESSION['role'] = (string) $user['role'];

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
        $role = 'customer';

        if ($name === '' || $email === '' || $password === '') {
            send_json(['message' => 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.'], 400);
        }

        if (strlen($password) < 6) {
            send_json(['message' => 'Mật khẩu cần có ít nhất 6 ký tự.'], 400);
        }

        if (UserModel::exists($email)) {
            send_json(['message' => 'Email này đã được đăng ký.'], 409);
        }

        $createdUser = UserModel::create($name, $email, $password, $role);
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int) $createdUser['id'];
        $_SESSION['role'] = (string) $createdUser['role'];

        send_json([
            'message' => 'Tạo tài khoản thành công.',
            'user' => $createdUser,
        ], 201);
    }

    private function me(): void
    {
        $user = $this->sessionUser();
        if (!$user) {
            send_json(['message' => 'Bạn chưa đăng nhập.'], 401);
        }

        send_json(['user' => UserModel::publicUser($user)]);
    }

    private function logout(): void
    {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'] ?? '',
                (bool) $params['secure'],
                (bool) $params['httponly']
            );
        }

        session_destroy();
        send_json(['message' => 'Đăng xuất thành công.']);
    }

    private function sessionUser(): array|null
    {
        $userId = (int) ($_SESSION['user_id'] ?? 0);
        if ($userId <= 0) {
            return null;
        }

        $statement = db()->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $statement->execute(['id' => $userId]);
        $user = $statement->fetch();

        return $user ?: null;
    }

    private function requireAdmin(): void
    {
        $user = $this->sessionUser();

        if (!$user || (string) $user['role'] !== 'admin') {
            send_json(['message' => 'Bạn cần đăng nhập bằng tài khoản quản trị.'], 403);
        }
    }

    private function passwordIsValid(string $password, string $storedPassword): bool
    {
        $isHash = str_starts_with($storedPassword, '$2y$');

        return $isHash
            ? password_verify($password, $storedPassword)
            : hash_equals($storedPassword, $password);
    }
}
