import { useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal.js';

const focusItems = [
  ['fa-solid fa-universal-access', 'Accessible interfaces', 'Semantic HTML, keyboard support, and clear user flows.'],
  ['fa-solid fa-mobile-screen-button', 'Responsive UI', 'Layouts that work across mobile, tablet, and desktop.'],
  ['fa-solid fa-code', 'API-driven apps', 'React, routing, forms, auth, and external API integrations.'],
  ['fa-solid fa-gauge-high', 'Performance-minded', 'Fast loading, optimized assets, and maintainable code.'],
];

const experience = [
  ['Shop Assistant', 'XXL Sport og Villmark Lade', ['Cash register & customer support', 'Assisted ski & bicycle department']],
  ['Service Worker', 'Elite Service Partner AS', ['Building cleaning & maintenance']],
  ['Production Worker', 'Berg Seafood AS', ['Cod fishing operations']],
  ['Shop Assistant', 'Rema 1000 Jg Hansen AS', ['Cash register & service']],
  ['Production Worker', 'Lofothval', ['Packing & QC']],
  ['Salesperson', 'Neras Direkte AS', ['Telephone sales']],
  ['Firefighter', 'Norwegian Armed Forces', ['Fire response & safety']],
  ['Shop Assistant', 'Extra Svolvær', ['Cash register & service']],
];

function TimelineItem({ role, meta, bullets, index = 0 }) {
  return (
    <li className="tl-item reveal" style={{ '--reveal-delay': `${index * 40}ms` }}>
      <div className="tl-head">
        <span className="role">{role}</span>
        <span className="meta">{meta}</span>
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
      <h2 id="cv-title" className="reveal">CV</h2>
      <div className="cv reveal" style={{ '--reveal-delay': '80ms' }}>
        <aside className="card reveal">
          <h3>Frontend focus</h3>
          <ul className="focus-list">
            {focusItems.map(([icon, title, text], index) => (
              <li className="reveal" style={{ '--reveal-delay': `${index * 40}ms` }} key={title}>
                <i className={icon} aria-hidden="true" />
                <div>
                  <span className="focus-title">{title}</span>
                  <span className="focus-text">{text}</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="card reveal" style={{ '--reveal-delay': '70ms' }}>
          <h3>Work Experience</h3>
          <ol className={`timeline${expanded ? '' : ' clamp'}`} id="exp-timeline">
            {experience.map(([role, meta, bullets], index) => (
              <TimelineItem role={role} meta={meta} bullets={bullets} index={index} key={`${role}-${meta}`} />
            ))}
          </ol>

          <button
            className="btn tl-toggle"
            type="button"
            aria-controls="exp-timeline"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Show less' : 'Show all experience'}
          </button>

          <h3>Education</h3>
          <ol className="timeline">
            <TimelineItem role="Frontend Development (Part-time)" meta="Noroff · 2022–2026" />
          </ol>
        </div>
      </div>
    </section>
  );
}
