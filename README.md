# Sander Nilsen — Portfolio

React and Vite portfolio with a PHP API, MariaDB-backed project content, and an authenticated administration dashboard.

Live site: https://sandernilsen.no/

## Features

- Responsive portfolio with persistent light and dark themes
- Projects loaded from MariaDB rather than source-code constants
- `/admin/` dashboard for creating, editing, publishing, deleting, and ordering projects
- Validated JPEG, PNG, and WebP project-image uploads
- Secure PHP sessions, password hashing, CSRF protection, prepared queries, and login throttling
- Static project fallback if the database is temporarily unavailable
- GitHub Pages mirror that reads published projects from the Uniweb API

## Stack

- React 19 and Vite
- Custom CSS
- PHP 8.1 or newer using PDO
- MariaDB 10.6
- Font Awesome icons through the existing CDN stylesheet

## Structure

```text
admin/                         Admin HTML entry point
public/                        Static images, icons, and web manifest
server/
  api/                         PHP API deployed to the Uniweb webroot
  migrations/001_initial_schema.sql
  config.example.php
src/
  admin/                       React administration dashboard
  components/                  Shared portfolio components
  data/                        Project categories
  hooks/                       Scroll-reveal behavior
  sections/                    Portfolio sections
  services/api.js              Public and authenticated API client
  styles/                      Portfolio styles
  App.jsx
  main.jsx
```

## Uniweb database setup

Complete these steps before deploying the database-backed version.

1. In the Uniweb control panel, create a MariaDB database and database user.
2. Open phpMyAdmin and import `server/migrations/001_initial_schema.sql`. The migration creates the tables and inserts the seven existing projects.
3. Set the website to PHP 8.1 or newer in Uniweb.
4. Copy `server/config.example.php` to `portfolio-config.php` and enter the database host, database name, username, and password.
5. Generate a private setup token:

   ```bash
   php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
   ```

6. Put that token in `portfolio-config.php` as `setup_token`.
7. Upload `portfolio-config.php` one directory above the public webroot identified by `FTP_ROUTE`. Never put it inside the Git repository or public website directory.
8. Deploy the application, then visit `https://sandernilsen.no/admin/` and choose **First-time setup**.
9. Enter the private setup token, your administrator email, and a password containing at least 12 characters.
10. Remove or rotate the setup token in `portfolio-config.php` after creating the administrator. The setup endpoint also disables itself automatically once an administrator exists.

The default configuration stores uploads in `uploads/projects/` inside the webroot. The deployment workflow explicitly excludes this directory from deletion.

## Local frontend development

```bash
npm install
npm run dev
```

Without a local PHP/MariaDB API, the public portfolio uses the bundled project fallback. The admin dashboard requires a running API. Set `VITE_API_URL` if the API is hosted at a different URL during development.

For full local development, create `portfolio-config.php`, apply the migration to a local MariaDB database, then run these commands in separate terminals:

```bash
npm run dev:api
npm run dev
```

Create and preview a production build with:

```bash
npm run build
npm run preview
```

## API routes

Public:

- `GET /api/projects`

Authentication:

- `GET /api/auth/session`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/setup` — available only before the first administrator exists

Administration:

- `GET /api/admin/projects`
- `POST /api/admin/projects`
- `POST /api/admin/projects/reorder`
- `DELETE /api/admin/projects/{id}`

All administrative mutations require an authenticated same-origin session and an `X-CSRF-Token` header.

## Deployment

Pushes to `main` run two independent workflows:

- `.github/workflows/deploy.yml` builds the frontend, deploys `dist/` to Uniweb, and then deploys `server/api/` to the `/api/` directory. It preserves `/uploads/` across deployments.
- `.github/workflows/pages.yml` publishes only the static Vite build to GitHub Pages.

Required Uniweb deployment secrets:

- `SSH_PRIVATE_KEY`
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_ROUTE`

`portfolio-config.php`, database credentials, administrator passwords, and setup tokens must never be committed.
