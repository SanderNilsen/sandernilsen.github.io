# Sander Nilsen — Portfolio

Personal portfolio showcasing selected frontend development projects, GitHub activity, and experience. The site is built with React and Vite, with custom CSS and no UI framework.

Live site: https://sandernilsen.no/

## Features

- Responsive single-page layout with sticky navigation and a mobile menu
- Persistent light and dark themes that default to the system preference
- Filterable project gallery with keyboard-accessible detail dialogs
- GitHub statistics with theme-aware images, retry controls, and fallbacks
- Expandable work-experience timeline
- Scroll reveal effects with reduced-motion support
- Semantic landmarks, visible focus states, and accessible control labels

## Tech stack

- React
- Vite
- Custom CSS
- Font Awesome icons loaded from its existing CDN stylesheet

## Project structure

```text
public/
  images/             Static portfolio images and icons
  site.webmanifest
src/
  components/         Reusable navigation, cards, modal, stats, and footer
  data/               Project content
  hooks/              Shared scroll-reveal behavior
  sections/           Hero, Projects, GitHub, and CV sections
  styles/             Existing visual system and responsive styles
  App.jsx
  main.jsx
index.html             Metadata, analytics, and React entry point
vite.config.js
```

## Local development

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

Preview the generated `dist/` directory with:

```bash
npm run preview
```

## Updating content

- Edit project cards in `src/data/projects.js`.
- Edit page copy in the matching component under `src/sections/`.
- Add static images to `public/images/` and reference them with `/images/filename.ext`.
- Adjust visual tokens, components, and breakpoints in `src/styles/styles.css`.

## Deployment

Pushes to `main` run the GitHub Actions workflow in `.github/workflows/deploy.yml`. It installs dependencies, builds the Vite app, and deploys only the generated `dist/` directory over SSH/rsync.

Required repository secrets:

- `SSH_PRIVATE_KEY`
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_ROUTE`
