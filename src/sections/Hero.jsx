import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal.js';

const facts = [
  ['fa-solid fa-location-dot', 'Trondheim, Norway'],
  ['fa-solid fa-code', 'Front-End Developer'],
  ['fa-solid fa-network-wired', 'Network & systems student · Noroff'],
  ['fa-solid fa-laptop-code', 'Focus: Accessibility · UX · Performance'],
  ['fa-solid fa-handshake-angle', 'Open to freelance & collaboration'],
];

export default function Hero() {
  const sectionRef = useRef(null);
  useReveal(sectionRef);

  return (
    <section id="hero" className="container hero" aria-label="Intro" ref={sectionRef}>
      <div className="hero__intro reveal">
        <p className="eyebrow">Frontend developer · IT student</p>
        <h1>Turning ideas into <span className="hero__accent">seamless web experiences</span></h1>
        <p className="lead">
          I’m Sander Nilsen, a frontend developer focused on building clear, responsive
          interfaces with solid structure and thoughtful user experience.
        </p>
        <a className="current-studies" href="#cv">
          <span className="current-studies__label">Currently studying at Noroff</span>
          <span className="current-studies__title">Network and System Administration</span>
          <span className="current-studies__detail">
            Expanding my knowledge of networks, systems, and IT infrastructure.
            <i className="fa-solid fa-arrow-down" aria-hidden="true" />
          </span>
        </a>
        <div className="hero__actions">
          <a className="btn btn-primary" href="#projects">Explore projects <i className="fa-solid fa-arrow-down" aria-hidden="true" /></a>
          <a className="btn btn-ghost" href="#cv">Experience &amp; CV <i className="fa-solid fa-arrow-right" aria-hidden="true" /></a>
        </div>
      </div>
      <div className="card quickfacts reveal" style={{ '--reveal-delay': '80ms' }}>
        <div className="quickfacts__header">
          <img src="/images/profile-img.png" alt="Sander Nilsen" className="quickfacts-img" width="88" height="88" />
          <div>
            <p className="eyebrow">At a glance</p>
            <h2 className="quickfacts-title">Sander Nilsen</h2>
            <p className="quickfacts__subtitle">Developer &amp; IT student</p>
          </div>
        </div>
        <ul className="quickfacts-list">
          {facts.map(([icon, text]) => (
            <li key={text}>
              <i className={icon} aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
