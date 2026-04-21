<?php
declare(strict_types=1);

const DB_HOST = '127.0.0.1';
const DB_NAME = 'novatech_store';
const DB_USER = 'root';
const DB_PASS = '';
const FRONTEND_ORIGIN = 'http://localhost:5173';

function cors_origin(): string
{
    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    return $origin !== '' ? $origin : FRONTEND_ORIGIN;
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'httponly' => true,
        'path' => '/',
        'samesite' => 'Lax',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
    session_start();
}

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}

function send_json(mixed $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . cors_origin());
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function request_json(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);

    if (!is_array($data)) {
        send_json(['message' => 'Dữ liệu JSON không hợp lệ.'], 400);
    }

    return $data;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_json(['ok' => true]);
}
