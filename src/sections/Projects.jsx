import { useEffect, useMemo, useRef, useState } from 'react';
import ProjectCard from '../components/ProjectCard.jsx';
import { projectFilters, projectTypeLabels } from '../data/projectTypes.js';
import { useReveal } from '../hooks/useReveal.js';
import { getPublicProjects } from '../services/api.js';

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
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [requestVersion, setRequestVersion] = useState(0);
  const sectionRef = useRef(null);

  const visibleProjects = useMemo(
    () => (filter === 'all' ? projects : projects.filter((project) => project.type === filter)),
    [filter, projects],
  );

  const emptyMessage = filter === 'all'
    ? 'No projects added yet.'
    : `No ${projectTypeLabels[filter]?.toLowerCase() || filter} projects added yet.`;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    getPublicProjects(controller.signal)
      .then(({ projects: nextProjects }) => {
        setProjects(nextProjects);
        setLoading(false);
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return;
        setError(requestError.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [requestVersion]);

  useReveal(sectionRef, `${loading}-${filter}`);

  return (
    <section id="projects" className="container" aria-labelledby="projects-title" ref={sectionRef}>
      <h2 id="projects-title" className="reveal">Projects</h2>
      <div className="filters reveal" style={{ '--reveal-delay': '80ms' }} role="toolbar" aria-label="Filter projects">
        {projectFilters.map(([value, label]) => (
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
        {!loading && error && (
          <div className="project-empty project-error" role="alert">
            <p>Projects could not be loaded. {error}</p>
            <button className="btn btn-sm" type="button" onClick={() => setRequestVersion((value) => value + 1)}>
              Try again
            </button>
          </div>
        )}
        {!loading && !error && visibleProjects.map((project) => (
          <ProjectCard
            project={project}
            onOpen={(trigger) => onOpenProject(project, trigger)}
            key={project.id}
          />
        ))}
        {!loading && !error && visibleProjects.length === 0 && (
          <p className="project-empty">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
}
