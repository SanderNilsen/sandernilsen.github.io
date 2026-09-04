<?php

declare(strict_types=1);

use PortfolioApi\ApiException;
use PortfolioApi\Auth;
use PortfolioApi\Http;
use PortfolioApi\ProjectRepository;

require __DIR__ . '/src/Http.php';
require __DIR__ . '/src/bootstrap.php';
require __DIR__ . '/src/Auth.php';
require __DIR__ . '/src/ProjectRepository.php';

Http::securityHeaders();
$path = Http::path();
$method = Http::method();

try {
    $app = PortfolioApi\createApp();
    $config = $app['config'];

    if ($path === '/projects') {
        Http::allowPublicOrigin($config['allowed_public_origins']);
        if ($method === 'OPTIONS') {
            Http::noContent();
        }
    }

    $projects = new ProjectRepository($app['pdo'], $config);

    if ($method === 'GET' && $path === '/projects') {
        header('Cache-Control: no-store');
        Http::json(['projects' => $projects->all(true)]);
    }

    header('Cache-Control: no-store');
    $auth = new Auth($app['pdo'], $config);

    if ($method === 'GET' && $path === '/auth/session') {
        Http::json($auth->sessionPayload());
    }

    if ($method === 'POST' && $path === '/auth/login') {
        Http::json($auth->login(Http::jsonBody()));
    }

    if ($method === 'POST' && $path === '/auth/setup') {
        Http::json($auth->setup(Http::jsonBody()), 201);
    }

    if ($method === 'POST' && $path === '/auth/logout') {
        $auth->logout();
        Http::json(['authenticated' => false]);
    }

    if ($method === 'GET' && $path === '/admin/projects') {
        $auth->requireAdmin();
        Http::json(['projects' => $projects->all(false)]);
    }

    if ($method === 'POST' && $path === '/admin/projects') {
        $auth->requireCsrf();
        $isNew = empty($_POST['id']);
        $project = $projects->save($_POST, $_FILES['image'] ?? null);
        Http::json(['project' => $project], $isNew ? 201 : 200);
    }

    if ($method === 'POST' && $path === '/admin/projects/reorder') {
        $auth->requireCsrf();
        $input = Http::jsonBody();
        Http::json(['projects' => $projects->reorder($input['ids'] ?? [])]);
    }

    if ($method === 'DELETE' && preg_match('#^/admin/projects/(\d+)$#', $path, $matches)) {
        $auth->requireCsrf();
        $projects->delete((int) $matches[1]);
        Http::noContent();
    }

    throw new ApiException('The requested endpoint does not exist.', 404);
} catch (ApiException $error) {
    Http::json(['error' => $error->getMessage()], $error->status);
} catch (Throwable $error) {
    error_log((string) $error);

    if ($method === 'GET' && $path === '/projects') {
        $fallbackPath = __DIR__ . '/projects-fallback.json';
        $fallback = is_file($fallbackPath)
            ? json_decode((string) file_get_contents($fallbackPath), true)
            : null;

        if (is_array($fallback) && isset($fallback['projects'])) {
            Http::allowPublicOrigin(['https://sandernilsen.github.io']);
            header('Cache-Control: no-store');
            header('X-Portfolio-Source: fallback');
            Http::json($fallback);
        }
    }

    $message = isset($config) && !empty($config['debug'])
        ? $error->getMessage()
        : 'The portfolio API is temporarily unavailable.';
    Http::json(['error' => $message], 500);
}
