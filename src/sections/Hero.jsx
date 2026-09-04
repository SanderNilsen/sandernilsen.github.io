import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal.js';

const facts = [
  ['fa-solid fa-location-dot', 'Trondheim, Norway'],
  ['fa-solid fa-graduation-cap', 'Frontend Development Student · Noroff'],
  ['fa-solid fa-laptop-code', 'Focus: Accessibility · UX · Performance'],
  ['fa-solid fa-handshake-angle', 'Open to freelance & collaboration'],
];

export default function Hero() {
  const sectionRef = useRef(null);
  useReveal(sectionRef);

  return (
    <section id="hero" className="container hero" aria-label="Intro" ref={sectionRef}>
      <div className="reveal">
        <h1>Turning ideas into seamless web experiences</h1>
        <p className="lead">
          I’m Sander Nilsen, a frontend developer focused on building clear, responsive
          interfaces with solid structure and thoughtful user experience.
        </p>
        <p>
          <a className="btn" href="#projects">Projects</a>
          <a className="btn hero__cv-link" href="#cv">CV</a>
        </p>
      </div>
      <div className="card quickfacts reveal" style={{ '--reveal-delay': '80ms' }}>
        <img src="/images/profile-img.png" alt="Sander Nilsen" className="quickfacts-img" />
        <h3 className="quickfacts-title">Quick Facts</h3>
        <ul className="quickfacts-list">
          {facts.map(([icon, text], index) => (
            <li className="reveal" style={{ '--reveal-delay': `${index * 40}ms` }} key={text}>
              <i className={icon} aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
