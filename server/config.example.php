<?php

declare(strict_types=1);

return [
    'database' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'replace_with_database_name',
        'user' => 'replace_with_database_user',
        'password' => 'replace_with_database_password',
        'charset' => 'utf8mb4',
    ],
    'app' => [
        // Generate with: php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
        'setup_token' => '',
        'session_name' => 'portfolio_admin',
        'allowed_public_origins' => [
            'https://sandernilsen.github.io',
        ],
        'max_upload_bytes' => 5 * 1024 * 1024,
        'debug' => false,

        // These defaults work after deployment. Uncomment only if Uniweb uses
        // a different upload location or URL.
        // 'upload_directory' => '/absolute/path/to/webroot/uploads/projects',
        // 'upload_url' => '/uploads/projects',
    ],
];
