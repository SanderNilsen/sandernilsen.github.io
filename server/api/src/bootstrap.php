<?php

declare(strict_types=1);

namespace PortfolioApi;

use PDO;

function createApp(): array
{
    $configuredPath = getenv('PORTFOLIO_CONFIG');
    $configCandidates = $configuredPath
        ? [$configuredPath]
        : [
            dirname(__DIR__, 3) . '/portfolio-config.php',
            dirname(__DIR__) . '/private/portfolio-config.php',
        ];

    $configPath = null;
    foreach ($configCandidates as $candidate) {
        if (is_file($candidate)) {
            $configPath = $candidate;
            break;
        }
    }

    if ($configPath === null) {
        throw new \RuntimeException('Portfolio API configuration was not found.');
    }

    $config = require $configPath;
    if (!is_array($config) || !isset($config['database'])) {
        throw new \RuntimeException('Portfolio API configuration is invalid.');
    }

    $database = $config['database'];
    foreach (['host', 'name', 'user', 'password'] as $requiredKey) {
        if (!isset($database[$requiredKey]) || !is_string($database[$requiredKey])) {
            throw new \RuntimeException("Missing database configuration: {$requiredKey}");
        }
    }

    $charset = $database['charset'] ?? 'utf8mb4';
    $port = (int) ($database['port'] ?? 3306);
    $dsn = "mysql:host={$database['host']};port={$port};dbname={$database['name']};charset={$charset}";

    $pdo = new PDO($dsn, $database['user'], $database['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $appConfig = $config['app'] ?? [];
    $secureCookie = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

    session_name($appConfig['session_name'] ?? 'portfolio_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secureCookie,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);

    $webRoot = dirname(__DIR__, 2);
    $appConfig['allowed_public_origins'] = $appConfig['allowed_public_origins'] ?? [
        'https://sandernilsen.github.io',
    ];
    $appConfig['upload_directory'] = $appConfig['upload_directory'] ?? $webRoot . '/uploads/projects';
    $appConfig['upload_url'] = rtrim($appConfig['upload_url'] ?? '/uploads/projects', '/');
    $appConfig['max_upload_bytes'] = (int) ($appConfig['max_upload_bytes'] ?? 5 * 1024 * 1024);
    $appConfig['debug'] = (bool) ($appConfig['debug'] ?? false);

    return [
        'pdo' => $pdo,
        'config' => $appConfig,
    ];
}
