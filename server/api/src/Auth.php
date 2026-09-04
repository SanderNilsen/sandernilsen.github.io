<?php

declare(strict_types=1);

namespace PortfolioApi;

use PDO;

final class Auth
{
    private const MAX_LOGIN_ATTEMPTS = 5;
    private const LOGIN_WINDOW_SECONDS = 900;

    public function __construct(
        private readonly PDO $pdo,
        private readonly array $config,
    ) {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
    }

    public function sessionPayload(): array
    {
        $authenticated = isset($_SESSION['admin_id']);

        return [
            'authenticated' => $authenticated,
            'email' => $authenticated ? ($_SESSION['admin_email'] ?? null) : null,
            'csrfToken' => $authenticated ? $this->csrfToken() : null,
        ];
    }

    public function login(array $input): array
    {
        $this->enforceLoginLimit();
        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $password = (string) ($input['password'] ?? '');
        if (strlen($email) > 254 || strlen($password) > 1024) {
            throw new ApiException('The email or password is incorrect.', 401);
        }

        $statement = $this->pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);
        $admin = $statement->fetch();

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            $this->recordFailedLogin();
            throw new ApiException('The email or password is incorrect.', 401);
        }

        if (password_needs_rehash($admin['password_hash'], PASSWORD_DEFAULT)) {
            $update = $this->pdo->prepare('UPDATE admins SET password_hash = :password_hash WHERE id = :id');
            $update->execute([
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
                'id' => $admin['id'],
            ]);
        }

        $this->startAdminSession((int) $admin['id'], $admin['email']);
        $this->pdo->prepare('UPDATE admins SET last_login_at = CURRENT_TIMESTAMP WHERE id = :id')
            ->execute(['id' => $admin['id']]);

        return $this->sessionPayload();
    }

    public function setup(array $input): array
    {
        $adminCount = (int) $this->pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn();
        if ($adminCount > 0) {
            throw new ApiException('Initial setup has already been completed.', 409);
        }

        $configuredToken = (string) ($this->config['setup_token'] ?? '');
        $providedToken = (string) ($input['setupToken'] ?? '');
        if (strlen($configuredToken) < 32 || strlen($providedToken) > 512 || !hash_equals($configuredToken, $providedToken)) {
            throw new ApiException('The setup token is invalid.', 403);
        }

        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $password = (string) ($input['password'] ?? '');
        if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new ApiException('Enter a valid administrator email address.');
        }
        if (strlen($password) < 12 || strlen($password) > 1024) {
            throw new ApiException('The administrator password must be at least 12 characters.');
        }

        $statement = $this->pdo->prepare(
            'INSERT INTO admins (email, password_hash) VALUES (:email, :password_hash)'
        );
        $statement->execute([
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        ]);

        $this->startAdminSession((int) $this->pdo->lastInsertId(), $email);
        return $this->sessionPayload();
    }

    public function requireAdmin(): void
    {
        if (!isset($_SESSION['admin_id'])) {
            throw new ApiException('Authentication is required.', 401);
        }
    }

    public function requireCsrf(): void
    {
        $this->requireAdmin();
        $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if ($provided === '' || !hash_equals($this->csrfToken(), $provided)) {
            throw new ApiException('The security token is invalid. Refresh the dashboard and try again.', 403);
        }
    }

    public function logout(): void
    {
        $this->requireCsrf();
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $params['path'],
                'domain' => $params['domain'],
                'secure' => $params['secure'],
                'httponly' => $params['httponly'],
                'samesite' => $params['samesite'] ?? 'Strict',
            ]);
        }

        session_destroy();
    }

    private function startAdminSession(int $id, string $email): void
    {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $id;
        $_SESSION['admin_email'] = $email;
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        unset($_SESSION['login_attempts']);
    }

    private function csrfToken(): string
    {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        return $_SESSION['csrf_token'];
    }

    private function enforceLoginLimit(): void
    {
        $cutoff = time() - self::LOGIN_WINDOW_SECONDS;
        $attempts = array_values(array_filter(
            $_SESSION['login_attempts'] ?? [],
            static fn (int $attempt): bool => $attempt >= $cutoff,
        ));
        $_SESSION['login_attempts'] = $attempts;

        if (count($attempts) >= self::MAX_LOGIN_ATTEMPTS) {
            throw new ApiException('Too many sign-in attempts. Try again in 15 minutes.', 429);
        }
    }

    private function recordFailedLogin(): void
    {
        $_SESSION['login_attempts'][] = time();
    }
}
