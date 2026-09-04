<?php

declare(strict_types=1);

namespace PortfolioApi;

use PDO;

final class ProjectRepository
{
    public function __construct(
        private readonly PDO $pdo,
        private readonly array $config,
    ) {
    }

    public function all(bool $publishedOnly): array
    {
        $sql = 'SELECT id, title, project_type, tags, description, image_path, live_url, github_url, sort_order, published, created_at, updated_at FROM projects';
        if ($publishedOnly) {
            $sql .= ' WHERE published = 1';
        }
        $sql .= ' ORDER BY sort_order ASC, id ASC';

        return array_map([$this, 'mapProject'], $this->pdo->query($sql)->fetchAll());
    }

    public function save(array $input, ?array $image): array
    {
        $project = $this->validate($input);
        $id = $project['id'];
        $existing = $id ? $this->findRow($id) : null;
        if ($id && !$existing) {
            throw new ApiException('The project no longer exists.', 404);
        }

        $previousImage = $existing['image_path'] ?? null;
        $newImage = null;

        try {
            if ($image && ($image['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                $newImage = $this->storeImage($image);
                $project['image_path'] = $newImage;
            } else {
                $project['image_path'] = $previousImage;
            }

            if (!$project['image_path']) {
                throw new ApiException('Choose an image for the project.');
            }

            if ($project['sort_order'] === null) {
                $project['sort_order'] = $id
                    ? (int) $existing['sort_order']
                    : (int) $this->pdo->query('SELECT COALESCE(MAX(sort_order), -10) + 10 FROM projects')->fetchColumn();
            }

            $parameters = [
                'title' => $project['title'],
                'type' => $project['type'],
                'tags' => json_encode($project['tags'], JSON_UNESCAPED_UNICODE),
                'description' => $project['description'],
                'image_path' => $project['image_path'],
                'live_url' => $project['live_url'],
                'github_url' => $project['github_url'],
                'sort_order' => $project['sort_order'],
                'published' => $project['published'] ? 1 : 0,
            ];

            if ($id) {
                $parameters['id'] = $id;
                $statement = $this->pdo->prepare(
                    'UPDATE projects SET title = :title, project_type = :type, tags = :tags, description = :description, image_path = :image_path, live_url = :live_url, github_url = :github_url, sort_order = :sort_order, published = :published WHERE id = :id'
                );
                $statement->execute($parameters);
            } else {
                $statement = $this->pdo->prepare(
                    'INSERT INTO projects (title, project_type, tags, description, image_path, live_url, github_url, sort_order, published) VALUES (:title, :type, :tags, :description, :image_path, :live_url, :github_url, :sort_order, :published)'
                );
                $statement->execute($parameters);
                $id = (int) $this->pdo->lastInsertId();
            }
        } catch (\Throwable $error) {
            if ($newImage) {
                $this->deleteUploadedImage($newImage);
            }
            throw $error;
        }

        if ($newImage && $previousImage && $newImage !== $previousImage) {
            $this->deleteUploadedImage($previousImage);
        }

        $saved = $this->findRow($id);
        if (!$saved) {
            throw new \RuntimeException('The saved project could not be loaded.');
        }

        return $this->mapProject($saved);
    }

    public function delete(int $id): void
    {
        $existing = $this->findRow($id);
        if (!$existing) {
            throw new ApiException('The project no longer exists.', 404);
        }

        $statement = $this->pdo->prepare('DELETE FROM projects WHERE id = :id');
        $statement->execute(['id' => $id]);
        $this->deleteUploadedImage($existing['image_path']);
    }

    public function reorder(array $ids): array
    {
        $ids = array_map('intval', $ids);
        if (!$ids || count($ids) !== count(array_unique($ids)) || min($ids) < 1) {
            throw new ApiException('The project order is invalid.');
        }

        $existingIds = array_map(
            'intval',
            $this->pdo->query('SELECT id FROM projects ORDER BY id ASC')->fetchAll(PDO::FETCH_COLUMN),
        );
        $sortedInput = $ids;
        sort($sortedInput);
        sort($existingIds);

        if ($sortedInput !== $existingIds) {
            throw new ApiException('The project list changed. Refresh the dashboard and try again.', 409);
        }

        $this->pdo->beginTransaction();
        try {
            $statement = $this->pdo->prepare('UPDATE projects SET sort_order = :sort_order WHERE id = :id');
            foreach ($ids as $index => $id) {
                $statement->execute([
                    'sort_order' => $index * 10,
                    'id' => $id,
                ]);
            }
            $this->pdo->commit();
        } catch (\Throwable $error) {
            $this->pdo->rollBack();
            throw $error;
        }

        return $this->all(false);
    }

    private function validate(array $input): array
    {
        $id = isset($input['id']) && $input['id'] !== '' ? filter_var($input['id'], FILTER_VALIDATE_INT) : null;
        if ($id === false || ($id !== null && $id < 1)) {
            throw new ApiException('The project identifier is invalid.');
        }

        $title = trim((string) ($input['title'] ?? ''));
        $description = trim((string) ($input['description'] ?? ''));
        $type = trim((string) ($input['type'] ?? ''));
        $liveUrl = trim((string) ($input['live_url'] ?? ''));
        $githubUrl = trim((string) ($input['github_url'] ?? ''));

        if ($title === '' || $this->length($title) > 150) {
            throw new ApiException('Enter a project title of no more than 150 characters.');
        }
        if (!in_array($type, ['noroff', 'personal'], true)) {
            throw new ApiException('Choose a valid project category.');
        }
        if ($description === '' || $this->length($description) > 5000) {
            throw new ApiException('Enter a project description of no more than 5,000 characters.');
        }
        if (!$this->isHttpUrl($liveUrl)) {
            throw new ApiException('Enter a valid HTTP or HTTPS live website URL.');
        }
        if ($githubUrl !== '' && !$this->isHttpUrl($githubUrl)) {
            throw new ApiException('Enter a valid HTTP or HTTPS GitHub URL.');
        }

        try {
            $tags = json_decode((string) ($input['tags'] ?? '[]'), true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new ApiException('The project tags are invalid.');
        }
        if (!is_array($tags) || count($tags) > 12) {
            throw new ApiException('Use no more than 12 project tags.');
        }
        $tags = array_values(array_unique(array_filter(array_map(
            fn ($tag): string => trim((string) $tag),
            $tags,
        ))));
        foreach ($tags as $tag) {
            if ($this->length($tag) > 50) {
                throw new ApiException('Each project tag must be no more than 50 characters.');
            }
        }

        $sortOrder = null;
        if (isset($input['sort_order']) && $input['sort_order'] !== '') {
            $sortOrder = filter_var($input['sort_order'], FILTER_VALIDATE_INT);
            if ($sortOrder === false || $sortOrder < 0 || $sortOrder > 10000) {
                throw new ApiException('The sort order must be between 0 and 10,000.');
            }
        }

        return [
            'id' => $id === null ? null : (int) $id,
            'title' => $title,
            'type' => $type,
            'tags' => $tags,
            'description' => $description,
            'live_url' => $liveUrl,
            'github_url' => $githubUrl === '' ? null : $githubUrl,
            'sort_order' => $sortOrder,
            'published' => filter_var($input['published'] ?? false, FILTER_VALIDATE_BOOLEAN),
        ];
    }

    private function storeImage(array $image): string
    {
        $error = (int) ($image['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($error !== UPLOAD_ERR_OK) {
            throw new ApiException('The image upload failed.');
        }

        $size = (int) ($image['size'] ?? 0);
        if ($size < 1 || $size > $this->config['max_upload_bytes']) {
            $megabytes = round($this->config['max_upload_bytes'] / 1024 / 1024, 1);
            throw new ApiException("The image must be smaller than {$megabytes} MB.");
        }

        $temporaryPath = (string) ($image['tmp_name'] ?? '');
        if ($temporaryPath === '' || !is_uploaded_file($temporaryPath) || getimagesize($temporaryPath) === false) {
            throw new ApiException('The uploaded file is not a valid image.');
        }

        $mimeType = (new \finfo(FILEINFO_MIME_TYPE))->file($temporaryPath);
        $extensions = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];
        if (!isset($extensions[$mimeType])) {
            throw new ApiException('Use a JPEG, PNG, or WebP image.');
        }

        $directory = $this->config['upload_directory'];
        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            throw new \RuntimeException('The project upload directory could not be created.');
        }

        $protectionFile = rtrim($directory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . '.htaccess';
        if (!is_file($protectionFile)) {
            $protection = "Options -Indexes\n<FilesMatch \"\\.(?:php|phtml|phar|cgi|pl|sh)$\">\n  Require all denied\n</FilesMatch>\n";
            if (file_put_contents($protectionFile, $protection, LOCK_EX) === false) {
                throw new \RuntimeException('The upload directory could not be protected.');
            }
        }

        $filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mimeType];
        $destination = rtrim($directory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;
        if (!move_uploaded_file($temporaryPath, $destination)) {
            throw new \RuntimeException('The project image could not be stored.');
        }

        return $this->config['upload_url'] . '/' . $filename;
    }

    private function deleteUploadedImage(?string $imagePath): void
    {
        if (!$imagePath || !str_starts_with($imagePath, $this->config['upload_url'] . '/')) {
            return;
        }

        $filename = basename($imagePath);
        $fullPath = rtrim($this->config['upload_directory'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;
        if (is_file($fullPath)) {
            unlink($fullPath);
        }
    }

    private function findRow(int $id): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT id, title, project_type, tags, description, image_path, live_url, github_url, sort_order, published, created_at, updated_at FROM projects WHERE id = :id'
        );
        $statement->execute(['id' => $id]);
        $row = $statement->fetch();

        return $row ?: null;
    }

    private function mapProject(array $row): array
    {
        $tags = json_decode($row['tags'], true);

        return [
            'id' => (int) $row['id'],
            'title' => $row['title'],
            'type' => $row['project_type'],
            'tags' => is_array($tags) ? $tags : [],
            'img' => $row['image_path'],
            'desc' => $row['description'],
            'url' => $row['live_url'],
            'github' => $row['github_url'],
            'sortOrder' => (int) $row['sort_order'],
            'published' => (bool) $row['published'],
            'createdAt' => $row['created_at'],
            'updatedAt' => $row['updated_at'],
        ];
    }

    private function isHttpUrl(string $url): bool
    {
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        return in_array(strtolower((string) parse_url($url, PHP_URL_SCHEME)), ['http', 'https'], true);
    }

    private function length(string $value): int
    {
        return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
    }
}
