export default function ProjectList({ projects, busy, onCreate, onEdit, onDelete, onMove }) {
  return (
    <section className="card admin-project-list" aria-labelledby="admin-projects-title">
      <div className="admin-section-heading">
        <div>
          <p className="admin-eyebrow">Content</p>
          <h2 id="admin-projects-title">Projects</h2>
        </div>
        <button className="btn btn-sm" type="button" onClick={onCreate}>New project</button>
      </div>

      {!projects.length && <p className="admin-muted">No projects have been added yet.</p>}

      <ol className="admin-projects">
        {projects.map((project, index) => (
          <li className="admin-project-row" key={project.id}>
            {project.img && <img src={project.img} alt="" width="88" height="56" />}
            <div className="admin-project-row__content">
              <strong>{project.title}</strong>
              <span>{project.type} · {project.published ? 'Published' : 'Draft'}</span>
            </div>
            <div className="admin-project-row__actions">
              <button className="btn btn-sm btn-ghost" type="button" onClick={() => onMove(index, -1)} disabled={busy || index === 0} aria-label={`Move ${project.title} up`}>↑</button>
              <button className="btn btn-sm btn-ghost" type="button" onClick={() => onMove(index, 1)} disabled={busy || index === projects.length - 1} aria-label={`Move ${project.title} down`}>↓</button>
              <button className="btn btn-sm" type="button" onClick={() => onEdit(project)}>Edit</button>
              <button className="btn btn-sm admin-danger" type="button" onClick={() => onDelete(project)} disabled={busy}>Delete</button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
