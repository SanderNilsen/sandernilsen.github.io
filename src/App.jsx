import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import Footer from './components/Footer.jsx';
import Hero from './sections/Hero.jsx';
import Projects from './sections/Projects.jsx';
import GitHub from './sections/GitHub.jsx';
import Cv from './sections/Cv.jsx';

const storageKey = 'portfolio-theme';

function getInitialTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [modal, setModal] = useState({ project: null, trigger: null });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#0b1020' : '#f7f8fc',
    );
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: light)');
    const handleSystemTheme = (event) => {
      let stored = null;
      try {
        stored = localStorage.getItem(storageKey);
      } catch (_) {
        // Keep following the system theme if storage is unavailable.
      }
      if (stored !== 'light' && stored !== 'dark') setTheme(event.matches ? 'light' : 'dark');
    };

    media?.addEventListener?.('change', handleSystemTheme);
    return () => media?.removeEventListener?.('change', handleSystemTheme);
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(storageKey, next);
      } catch (_) {
        // The selected theme still applies for the current session.
      }
      return next;
    });
  };

  const openProject = useCallback((project, trigger) => setModal({ project, trigger }), []);
  const closeProject = useCallback(() => setModal({ project: null, trigger: null }), []);

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Projects onOpenProject={openProject} />
        <GitHub theme={theme} />
        <Cv />
      </main>
      <Footer />
      <ProjectModal
        project={modal.project}
        trigger={modal.trigger}
        onClose={closeProject}
      />
    </>
  );
}
