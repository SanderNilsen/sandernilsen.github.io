import { useEffect, useRef, useState } from 'react';
import ExternalButton from './ExternalButton.jsx';
import { projectTypeLabels } from '../data/projects.js';

export default function ProjectModal({ project, trigger, onClose }) {
  const panelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!project) return undefined;

    document.body.classList.add('project-modal-open');
    const animationFrame = window.requestAnimationFrame(() => {
      setIsOpen(true);
      panelRef.current?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('project-modal-open');
      document.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(animationFrame);
      setIsOpen(false);
      trigger?.focus();
    };
  }, [project, trigger, onClose]);

  if (!project) return null;

  return (
    <div className={`project-modal${isOpen ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <div className="project-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <article className="project-modal__panel" tabIndex="-1" ref={panelRef}>
        <button className="project-modal__close" type="button" aria-label="Close project details" onClick={onClose}>
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
        <img className="project-modal__image" src={project.img} alt={`Screenshot of ${project.title}`} width="1000" height="625" />
        <div className="project-modal__content">
          <p className="project-modal__type">{projectTypeLabels[project.type] || project.type}</p>
          <h3 id="project-modal-title">{project.title}</h3>
          <p className="project-modal__description">{project.desc}</p>
          <div className="project-modal__tags">
            {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
          </div>
          <div className="project-modal__actions">
            <ExternalButton href={project.url} icon="fa-solid fa-arrow-up-right-from-square">
              Live Website
            </ExternalButton>
            {project.github && (
              <ExternalButton href={project.github} icon="fa-brands fa-github" ghost>
                View on GitHub
              </ExternalButton>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
