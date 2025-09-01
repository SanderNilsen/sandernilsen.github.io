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
    url: 'https://classy-duckanoo-15bd80.netlify.app/'
  },
  {
    title: 'Community Science Museum',
    type: 'web',
    tags: ['HTML', 'CSS'],
    img: 'images/CMS-Website-Design.png',
    desc: 'Noroff semester project 1, creating a website for "Community Science Museum" in HTML and CSS.',
    url: 'https://jovial-frangipane-060223.netlify.app/'
  },
  {
    title: 'LofotenPeaks',
    type: 'web',
    tags: ['Html', 'CSS', 'JS', 'WP'],
    img: 'images/Websitedesign.png',
    desc: 'This project involves creating a custom blog website using HTML, CSS, and JavaScript, with content managed through a WordPress installation acting as a Headless CMS.',
    url: 'https://lofotenpeaks.netlify.app/'
  },
];

// Render projects
const grid = document.getElementById('project-grid');

function renderProjects(list) {
  if (!grid) return;

  grid.innerHTML = list.map(project => `
    <article class="project" data-type="${project.type}">
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
      <p><a href="${project.url}">Live Website →</a></p>
    </article>
  `).join('');
}

// Init render
renderProjects(projects);

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


