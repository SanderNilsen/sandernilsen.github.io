// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Mobile navigation toggle
const navContainer = document.querySelector('.nav');
const navToggleBtn = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');
const mobileNavQuery = window.matchMedia
  ? window.matchMedia('(max-width: 700px)')
  : null;

if (navContainer && navToggleBtn && primaryNav) {
  const labels = {
    open: 'Open navigation',
    close: 'Close navigation'
  };

  const setMenuState = open => {
    navContainer.classList.toggle('nav--open', open);
    navToggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggleBtn.setAttribute('aria-label', open ? labels.close : labels.open);
  };

  const toggleMenu = () => {
    const nextState = !navContainer.classList.contains('nav--open');
    setMenuState(nextState);
  };

  setMenuState(false);

  navToggleBtn.addEventListener('click', toggleMenu);

  primaryNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (!mobileNavQuery || mobileNavQuery.matches) {
        setMenuState(false);
      }
    });
  });

  const handleEscape = event => {
    if (event.key === 'Escape' && navContainer.classList.contains('nav--open')) {
      setMenuState(false);
      navToggleBtn.focus();
    }
  };

  document.addEventListener('keydown', handleEscape);

  if (mobileNavQuery) {
    const handleBreakpointChange = event => {
      if (!event.matches) {
        setMenuState(false);
      }
    };

    if (typeof mobileNavQuery.addEventListener === 'function') {
      mobileNavQuery.addEventListener('change', handleBreakpointChange);
    } else if (typeof mobileNavQuery.addListener === 'function') {
      mobileNavQuery.addListener(handleBreakpointChange);
    }
  }
}

// Theme toggle
const themeToggleBtn = document.getElementById('theme-toggle');

if (themeToggleBtn) {
  const storageKey = 'portfolio-theme';
  const root = document.documentElement;
  const labelEl = themeToggleBtn.querySelector('.theme-toggle__label');
  const themeMediaSelector = '[data-theme-src-light][data-theme-src-dark]';
  const prefersLightQuery = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: light)')
    : { matches: false };

  const readStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch (_) {
      return null;
    }
  };

  const persistTheme = theme => {
    try {
      localStorage.setItem(storageKey, theme);
      return true;
    } catch (_) {
      return false;
    }
  };

  const setToggleState = theme => {
    themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (labelEl) {
      labelEl.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
  };

  const updateThemeMedia = theme => {
    document.querySelectorAll(themeMediaSelector).forEach(img => {
      const targetSrc = theme === 'dark' ? img.dataset.themeSrcDark : img.dataset.themeSrcLight;
      if (targetSrc && img.getAttribute('src') !== targetSrc) {
        img.setAttribute('src', targetSrc);
      }
    });
  };

  const applyTheme = theme => {
    root.setAttribute('data-theme', theme);
    setToggleState(theme);
    updateThemeMedia(theme);
  };

  let userPreferredTheme = null;

  const initTheme = () => {
    const stored = readStoredTheme();
    if (stored === 'light' || stored === 'dark') {
      userPreferredTheme = stored;
      applyTheme(stored);
      return;
    }
    userPreferredTheme = null;
    applyTheme(prefersLightQuery.matches ? 'light' : 'dark');
  };

  const toggleTheme = () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    userPreferredTheme = next;
    persistTheme(next);
  };

  const handleSystemChange = event => {
    if (userPreferredTheme === null) {
      applyTheme(event.matches ? 'light' : 'dark');
    }
  };

  initTheme();
  themeToggleBtn.addEventListener('click', toggleTheme);

  if (typeof prefersLightQuery.addEventListener === 'function') {
    prefersLightQuery.addEventListener('change', handleSystemChange);
  } else if (typeof prefersLightQuery.addListener === 'function') {
    prefersLightQuery.addListener(handleSystemChange);
  }
}

// Set current year in footer

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Project data
   
const projects = [
  {
    title: 'RainyDays',
    type: 'web',
    tags: ['HTML', 'CSS', 'JS'],
    img: "images/RainyDays-Website-Design.png",
    desc: 'The Rainy Days course assignment is a simple e-commerce website for selling clothing items made with HTML, CSS and JavaScript.',
    url: 'https://classy-duckanoo-15bd80.netlify.app/',
    github: 'https://github.com/SanderNilsen/RainyDays'
  },
  {
    title: 'Community Science Museum',
    type: 'web',
    tags: ['HTML', 'CSS'],
    img: 'images/CMS-Website-Design.png',
    desc: 'Noroff semester project 1, creating a website for "Community Science Museum" in HTML and CSS.',
    url: 'https://jovial-frangipane-060223.netlify.app/',
    github: 'https://github.com/SanderNilsen/Semester-Project-1'
  },
  {
    title: 'LofotenPeaks',
    type: 'web',
    tags: ['HTML', 'CSS', 'JS', 'WP'],
    img: 'images/Websitedesign.png',
    desc: 'This project involves creating a custom blog website using HTML, CSS, and JavaScript, with content managed through a WordPress installation acting as a Headless CMS.',
    url: 'https://lofotenpeaks.netlify.app/',
    github: 'https://github.com/Noroff-FEU-Assignments/project-exam-1-SanderNilsen'
  },
  {
    title: 'LinkUp',
    type: 'app',
    tags: ['Html', 'CSS', 'JS'],
    img: 'images/websitedesign-linkup.png',
    desc: 'A simple social media application built using HTML, SASS, Bootstrap, and NPM. The application features user authentication, a feed page, and a profile page, along with responsive design and SCSS customizations.',
    url: 'https://linkup-css-frameworks.netlify.app/',
    github: 'https://github.com/SanderNilsen/css-frameworks-ca'
  },
  {
    title: 'Auction House',
    type: 'web',
    tags: ['HTML', 'CSS', 'JS'],
    img: 'images/Website-Design-AH.png',
    desc: 'A functional auction platform where users can buy and sell items using a credit-based system. New users receive 1,000 credits upon registration, which they can use to bid on items. Additional credits are earned by selling items.',
    url: 'https://semester-project-2-auctionhouse.netlify.app/index.html',
    github: 'https://github.com/SanderNilsen/Semester-Project-2-AuctionHouse'
  },  

];

// Render projects
const grid = document.getElementById('project-grid');

const supportsIntersectionObserver = 'IntersectionObserver' in window;
const prefersReducedMotion = window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

const revealObserver = supportsIntersectionObserver && !prefersReducedMotion
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const revealOnce = () => {
            target.classList.add('is-visible');
            observer.unobserve(target);
          };

          if ('requestAnimationFrame' in window) {
            requestAnimationFrame(revealOnce);
          } else {
            setTimeout(revealOnce, 0);
          }
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -20%' })
  : null;

function addReveal(elements, { delayStep = 0, delayFn = null } = {}) {
  let index = 0;
  elements.forEach(el => {
    if (!el || el.dataset.revealInitialized === 'true') return;
    el.dataset.revealInitialized = 'true';
    el.classList.add('reveal');

    const delay = typeof delayFn === 'function'
      ? Number(delayFn({ index, el })) || 0
      : delayStep * index;

    el.style.setProperty('--reveal-delay', `${Math.max(0, delay)}ms`);

    if (revealObserver) {
      revealObserver.observe(el);
    } else {
      el.classList.add('is-visible');
    }

    index += 1;
  });
}

function showProjectsLoader(count = 6) {
  if (!grid) return;
  grid.setAttribute('aria-busy', 'true');
  const card = () => `
    <article class="project card skeleton" role="status" aria-label="Loading project">
      <figure class="sk sk-img"></figure>
      <div class="sk sk-line lg"></div>
      <div class="sk sk-line md"></div>
      <div class="sk-tags">
        <span class="sk sk-tag"></span>
        <span class="sk sk-tag"></span>
        <span class="sk sk-tag"></span>
      </div>
      <div class="sk-btns">
        <span class="sk sk-btn"></span>
        <span class="sk sk-btn" style="width: 110px"></span>
      </div>
    </article>`;
  grid.innerHTML = Array.from({ length: count }, card).join('');
}

function preloadProjectImages(list) {
  const sources = list.map(p => p.img);
  const loaders = sources.map(src => new Promise(resolve => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  }));
  return Promise.all(loaders);
}

function renderProjects(list) {
  if (!grid) return;

  grid.innerHTML = list.map(project => `
    <article class="project card" data-type="${project.type}">
      <figure>
        <img
          src="${project.img}"
          alt="Skjermbilde: ${project.title}"
          loading="lazy"
          width="800"
          height="500"
        />
      </figure>
      <h3>${project.title}</h3>
      <p>${project.desc}</p>
      <div class="tags">
        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="project-links">
        <a href="${project.url}" target="_blank" rel="noopener" class="btn btn-sm">Live Website</a>
        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="btn btn-sm btn-ghost">View on GitHub</a>` : ''}
      </div>    </article>
  `).join('');

  requestAnimationFrame(() => {
    const cards = Array.from(grid.querySelectorAll('.project.card'));
    if (!cards.length) return;

    const rowDelays = new Map();

    addReveal(cards, {
      delayFn: ({ el }) => {
        const top = Math.round(el.offsetTop);
        const count = rowDelays.get(top) || 0;
        rowDelays.set(top, count + 1);
        return count * 90;
      }
    });
  });
}

// Init render with loader
(async function initProjects() {
  showProjectsLoader();
  try {
    await preloadProjectImages(projects);
  } catch (_) {
    // ignore errors; still render
  }
  renderProjects(projects);
  grid.removeAttribute('aria-busy');
})();

// Filter function
const chips = document.querySelectorAll('.chip');

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    // Remove "pressed" from all chips
    chips.forEach(c => c.setAttribute('aria-pressed', 'false'));

    // Mark selected chip
    chip.setAttribute('aria-pressed', 'true');

    // Filter projects
    const filter = chip.dataset.filter;
    if (filter === 'all') {
      renderProjects(projects);
    } else {
      renderProjects(projects.filter(p => p.type === filter));
    }
  });
});

// Focus indicator for keyboard users
document.addEventListener('keydown', event => {
  if (event.key === 'Tab') {
    document.body.classList.add('show-focus');
  }
});

// Animate skill bars from 0% to their set --level
document.querySelectorAll('.skills').forEach(list => {
  requestAnimationFrame(() => list.classList.add('animate'));
});

// Timeline clamp toggle
document.querySelectorAll('.tl-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetSel = btn.getAttribute('data-target');
    const target = document.querySelector(targetSel);
    if (!target) return;

    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));

    target.classList.toggle('clamp', expanded); // remove clamp when expanded

    btn.textContent = expanded ? 'Show all experience' : 'Show less';
  });
});

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}

// Active section highlight
const sections = [
  { id: 'hero', link: document.querySelector('.nav-link[href="#hero"]') },      // if you add it later
  { id: 'projects', link: document.querySelector('.nav-link[href="#projects"]') },
  { id: 'github', link: document.querySelector('.nav-link[href="#github"]') },
  { id: 'cv', link: document.querySelector('.nav-link[href="#cv"]') },
  { id: 'footer', link: document.querySelector('.nav-link[href="#footer"]') }
].filter(s => s.link);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const s = sections.find(x => x.id === entry.target.id);
    if (!s) return;
    if (entry.isIntersecting) {
      sections.forEach(x => x.link.classList.remove('is-active'));
      s.link.classList.add('is-active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

sections.forEach(s => {
  const el = document.getElementById(s.id);
  if (el) observer.observe(el);
});

const projectsSection = document.getElementById('projects');

document.querySelectorAll('main section').forEach(section => {
  const children = Array.from(section.children);
  const nextArticles = Array.from(section.querySelectorAll('article:not(.project)'));

  if (projectsSection && section === projectsSection) {
    const nonGridChildren = children.filter(child => child !== grid);
    addReveal(nonGridChildren, { delayStep: 80 });
  } else {
    addReveal(children, { delayStep: 80 });
  }

  if (nextArticles.length) {
    addReveal(nextArticles, { delayStep: 70 });
  }
});

addReveal(document.querySelectorAll('.skills .skill'), { delayStep: 40 });
addReveal(document.querySelectorAll('.timeline .tl-item'), { delayStep: 40 });
