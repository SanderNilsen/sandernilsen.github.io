import { useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal.js';

const experience = [
  {
    role: 'Retail Assistant',
    employer: 'XXL Sport og Villmark',
    dates: 'Nov 2021 – Present',
    bullets: [
      'Assist customers and handle checkout transactions.',
      'Support daily operations in the ski and bicycle departments.',
    ],
  },
  {
    role: 'Service Worker',
    employer: 'Elite Service Partner AS',
    dates: 'Nov 2020 – Aug 2021',
    bullets: [
      'Carried out cleaning and maintenance tasks to keep facilities clean and orderly.',
      'Relevant training: aerial work platform operation, Tryggportalen (Jan 2021).',
    ],
  },
  {
    role: 'Production Worker',
    employer: 'Berg Seafood AS',
    dates: 'Jan 2021 – May 2021',
    bullets: ['Supported daily operations in seafood production.'],
  },
  {
    role: 'Retail Assistant',
    employer: 'Rema 1000',
    dates: 'Sep 2019 – Oct 2020',
    bullets: ['Assisted customers and handled checkout transactions.'],
  },
  {
    role: 'Production Worker',
    employer: 'Lofothval',
    dates: 'Jun 2019 – Aug 2019',
    bullets: ['Supported daily operations in the production.'],
  },
  {
    role: 'Sales Representative',
    employer: 'Neras Direkte AS',
    dates: 'Sep 2018 – Oct 2018',
    bullets: [
      'Worked in telephone sales, communicating with prospective customers.',
      'Completed sales training for the Telenor project (Sep 2018).',
    ],
  },
  {
    role: 'Retail Assistant',
    employer: 'Coop Extra',
    dates: 'Jul 2016 – Sep 2016',
    bullets: ['Provided customer service and handled checkout transactions.'],
  },
];

function TimelineItem({ role, employer, dates, bullets, index = 0 }) {
  return (
    <li className="tl-item reveal" style={{ '--reveal-delay': `${index * 40}ms` }}>
      <div className="tl-head">
        <div>
          <h4 className="role">{role}</h4>
          <p className="meta">{employer}</p>
        </div>
        <p className="tl-dates">{dates}</p>
      </div>
      {bullets && (
        <ul className="tl-bullets">
          {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      )}
    </li>
  );
}

export default function Cv() {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef(null);
  useReveal(sectionRef, expanded);

  return (
    <section id="cv" className="container" aria-labelledby="cv-title" ref={sectionRef}>
      <p className="eyebrow section-eyebrow reveal">03 / Background</p>
      <h2 id="cv-title" className="reveal">Experience &amp; education</h2>
      <p className="section-lead reveal">
        My background spans customer service, sales, production, and cleaning.
        I value structure and attention to detail, and I enjoy building the
        knowledge and practical skills to work confidently and independently.
      </p>

      <div className="education" role="group" aria-labelledby="education-title">
        <h3 id="education-title" className="reveal">Education</h3>
        <div className="education-grid">
          <article className="card education-card education-card--current reveal" data-reveal="left">
            <div className="education-card__top">
              <i className="fa-solid fa-network-wired education-card__icon" aria-hidden="true" />
              <span className="education-status">Currently studying</span>
            </div>
            <p className="education-card__school">Noroff</p>
            <h4>Network and System Administration</h4>
            <p className="education-card__description">
              Expanding my technical foundation through studies in network and system
              administration, building a broader understanding of IT infrastructure.
            </p>
          </article>
          <article className="card education-card reveal" data-reveal="right" style={{ '--reveal-delay': '120ms' }}>
            <div className="education-card__top">
              <i className="fa-solid fa-laptop-code education-card__icon" aria-hidden="true" />
              <span className="education-status education-status--completed">
                <i className="fa-solid fa-check" aria-hidden="true" /> Completed
              </span>
            </div>
            <p className="education-card__school">Noroff · 2022–2026 · Part-time</p>
            <h4>Front-End Development</h4>
            <p className="education-card__description">
              Completed studies in front-end development, with practical experience
              creating responsive interfaces and web applications.
            </p>
          </article>
        </div>
      </div>

      <div className="cv">
        <div className="card reveal" style={{ '--reveal-delay': '70ms' }}>
          <h3>Work Experience</h3>
          <ol className="timeline">
            {experience.slice(0, 3).map((job, index) => (
              <TimelineItem {...job} index={index} key={job.employer} />
            ))}
          </ol>

          <button
            className="btn tl-toggle"
            type="button"
            aria-controls="earlier-experience"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Hide earlier experience' : 'Show earlier experience'}
          </button>

          <div id="earlier-experience" className="earlier-experience" hidden={!expanded}>
            <h4>Earlier experience</h4>
            <ol className="timeline">
              {experience.slice(3).map((job, index) => (
                <TimelineItem {...job} index={index} key={job.employer} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
