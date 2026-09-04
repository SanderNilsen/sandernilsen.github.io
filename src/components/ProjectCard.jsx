import ExternalButton from './ExternalButton.jsx';

export default function ProjectCard({ project, onOpen }) {
  return (
    <article
      className="project card reveal"
      data-type={project.type}
      data-reveal-row="true"
    >
      <button
        className="project-card__open"
        type="button"
        aria-label={`Open ${project.title} project details`}
        onClick={(event) => onOpen(event.currentTarget)}
      />
      <figure>
        <img
          src={project.img}
          alt={`Screenshot of ${project.title}`}
          loading="lazy"
          width="800"
          height="500"
        />
      </figure>
      <h3>{project.title}</h3>
      <p>{project.desc}</p>
      <div className="tags">
        {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
      <div className="project-links">
        <ExternalButton href={project.url} icon="fa-solid fa-arrow-up-right-from-square" small>
          Live Website
        </ExternalButton>
        {project.github && (
          <ExternalButton href={project.github} icon="fa-brands fa-github" ghost small>
            View on GitHub
          </ExternalButton>
        )}
      </div>
    </article>
  );
}
