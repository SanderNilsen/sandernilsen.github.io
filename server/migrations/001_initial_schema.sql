SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY admins_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  project_type VARCHAR(32) NOT NULL,
  tags LONGTEXT NOT NULL DEFAULT '[]',
  description TEXT NOT NULL,
  image_path VARCHAR(512) NOT NULL,
  live_url VARCHAR(2048) NOT NULL,
  github_url VARCHAR(2048) NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY projects_published_order_index (published, sort_order),
  CONSTRAINT projects_tags_json CHECK (JSON_VALID(tags)),
  CONSTRAINT projects_type_check CHECK (project_type IN ('noroff', 'personal'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO projects
  (id, title, project_type, tags, description, image_path, live_url, github_url, sort_order, published)
VALUES
  (
    1,
    'Holidaze',
    'noroff',
    '["Project Exam"]',
    'Project Exam 2: a modern accommodation booking application where users can browse venues, make bookings, and manage venue listings through the Holidaze API.',
    '/images/Holidaze-Website-Design.png',
    'https://holidaze-react.netlify.app/',
    'https://github.com/SanderNilsen/project-exam-2-holidaze',
    0,
    1
  ),
  (
    2,
    'RainyDays',
    'noroff',
    '["Course Assignment"]',
    'The Rainy Days course assignment is a simple e-commerce website for selling clothing items made with HTML, CSS and JavaScript.',
    '/images/RainyDays-Website-Design.png',
    'https://classy-duckanoo-15bd80.netlify.app/',
    'https://github.com/SanderNilsen/RainyDays',
    10,
    1
  ),
  (
    3,
    'Community Science Museum',
    'noroff',
    '["Semester Project"]',
    'Noroff semester project 1, creating a website for "Community Science Museum" in HTML and CSS.',
    '/images/CMS-Website-Design.png',
    'https://jovial-frangipane-060223.netlify.app/',
    'https://github.com/SanderNilsen/Semester-Project-1',
    20,
    1
  ),
  (
    4,
    'LofotenPeaks',
    'noroff',
    '["Project Exam"]',
    'This project involves creating a custom blog website using HTML, CSS, and JavaScript, with content managed through a WordPress installation acting as a Headless CMS.',
    '/images/Websitedesign.png',
    'https://lofotenpeaks-blog.netlify.app/',
    'https://github.com/Noroff-FEU-Assignments/project-exam-1-SanderNilsen',
    30,
    1
  ),
  (
    5,
    'LinkUp',
    'noroff',
    '["Course Assignment"]',
    'A simple social media application built using HTML, SASS, Bootstrap, and NPM. The application features user authentication, a feed page, and a profile page, along with responsive design and SCSS customizations.',
    '/images/websitedesign-linkup.png',
    'https://linkup-css-frameworks.netlify.app/',
    'https://github.com/SanderNilsen/css-frameworks-ca',
    40,
    1
  ),
  (
    6,
    'Auction House',
    'noroff',
    '["Semester Project"]',
    'A functional auction platform where users can buy and sell items using a credit-based system. New users receive 1,000 credits upon registration, which they can use to bid on items. Additional credits are earned by selling items.',
    '/images/Website-Design-AH.png',
    'https://semester-project-2-auctionhouse.netlify.app/index.html',
    'https://github.com/SanderNilsen/Semester-Project-2-AuctionHouse',
    50,
    1
  ),
  (
    7,
    'JS Frameworks CA',
    'noroff',
    '["Course Assignment"]',
    'This project is a React-based eCommerce application built as part of the Noroff Front-End Frameworks course assignment.\n\nThe application demonstrates usage of React with routing, API integration, global state management, form validation, and styled-components.',
    '/images/JS-Frameworks-CA.png',
    'https://noroff-react-ca.netlify.app/',
    'https://github.com/SanderNilsen/js-frameworks-ca',
    60,
    1
  );
