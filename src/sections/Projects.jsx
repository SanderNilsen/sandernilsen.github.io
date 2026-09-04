import { useEffect, useMemo, useRef, useState } from 'react';
import ProjectCard from '../components/ProjectCard.jsx';
import { projects } from '../data/projects.js';
import { useReveal } from '../hooks/useReveal.js';

const filters = [
  ['all', 'All'],
  ['noroff', 'Noroff'],
  ['personal', 'Personal'],
];

function ProjectSkeleton() {
  return (
    <article className="project card skeleton" role="status" aria-label="Loading project">
      <figure className="sk sk-img" />
      <div className="sk sk-line lg" />
      <div className="sk sk-line md" />
      <div className="sk-tags">
        <span className="sk sk-tag" />
        <span className="sk sk-tag" />
        <span className="sk sk-tag" />
      </div>
      <div className="sk-btns">
        <span className="sk sk-btn" />
        <span className="sk sk-btn project-skeleton__secondary-button" />
      </div>
    </article>
  );
}

export default function Projects({ onOpenProject }) {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  const visibleProjects = useMemo(
    () => (filter === 'all' ? projects : projects.filter((project) => project.type === filter)),
    [filter],
  );

  useEffect(() => {
    let cancelled = false;
    const loaders = projects.map((project) => new Promise((resolve) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = project.img;
    }));

    Promise.all(loaders).then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  useReveal(sectionRef, `${loading}-${filter}`);

  return (
    <section id="projects" className="container" aria-labelledby="projects-title" ref={sectionRef}>
      <h2 id="projects-title" className="reveal">Projects</h2>
      <div className="filters reveal" style={{ '--reveal-delay': '80ms' }} role="toolbar" aria-label="Filter projects">
        {filters.map(([value, label]) => (
          <button
            className="chip"
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            key={value}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid" aria-live="polite" aria-busy={loading || undefined}>
        {loading && Array.from({ length: 6 }, (_, index) => <ProjectSkeleton key={index} />)}
        {!loading && visibleProjects.map((project) => (
          <ProjectCard
            project={project}
            onOpen={(trigger) => onOpenProject(project, trigger)}
            key={project.title}
          />
        ))}
        {!loading && visibleProjects.length === 0 && (
          <p className="project-empty">No personal projects added yet.</p>
        )}
      </div>
    </section>
  );
}
