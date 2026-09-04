<?php

declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

if (str_starts_with($path, '/api')) {
    $_SERVER['SCRIPT_NAME'] = '/api/index.php';
    require __DIR__ . '/api/index.php';
    return true;
}

if (preg_match('#^/uploads/projects/([^/]+)$#', $path, $matches)) {
    $file = __DIR__ . '/uploads/projects/' . basename($matches[1]);
    if (!is_file($file)) {
        http_response_code(404);
        return true;
    }

    $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($file);
    header('Content-Type: ' . ($mimeType ?: 'application/octet-stream'));
    header('X-Content-Type-Options: nosniff');
    readfile($file);
    return true;
}

http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Not found']);
return true;
