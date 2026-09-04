import { useEffect, useRef, useState } from 'react';

const navItems = [
  { href: '#projects', label: 'Projects' },
  { href: '#github', label: 'GitHub' },
  { href: '#cv', label: 'CV' },
];

export default function Header({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia?.('(max-width: 700px)');
    const handleChange = (event) => {
      if (!event.matches) setMenuOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    media?.addEventListener?.('change', handleChange);
    document.addEventListener('keydown', handleEscape);
    return () => {
      media?.removeEventListener?.('change', handleChange);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 },
    );

    navItems.forEach(({ href }) => {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div
        className={`container nav${menuOpen ? ' nav--open' : ''}`}
        role="navigation"
        aria-label="Main menu"
      >
        <a className="brand" href="#hero" onClick={closeMenu}>
          Sander Nilsen
        </a>

        <nav id="primary-nav" className="nav-links" aria-label="Primary">
          {navItems.map(({ href, label }) => (
            <a
              key={href}
              className={`nav-link${activeSection === href.slice(1) ? ' is-active' : ''}`}
              href={href}
              onClick={closeMenu}
              aria-current={activeSection === href.slice(1) ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((open) => !open)}
            ref={menuButtonRef}
          >
            <span className="menu-toggle__icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <button
            className="theme-toggle"
            type="button"
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={onToggleTheme}
          >
            <span className="theme-toggle__icon" aria-hidden="true">
              <i className="fa-solid fa-moon theme-toggle__icon-moon" />
              <i className="fa-solid fa-sun theme-toggle__icon-sun" />
            </span>
            <span className="theme-toggle__label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
