import { useEffect, useState } from 'react';

const emptyProject = {
  id: null,
  title: '',
  type: 'personal',
  tags: '',
  desc: '',
  url: '',
  github: '',
  img: '',
  published: true,
  sortOrder: '',
};

function toFormState(project) {
  if (!project) return emptyProject;
  return {
    ...emptyProject,
    ...project,
    tags: project.tags.join(', '),
  };
}

export default function ProjectEditor({ project, busy, onCancel, onSave }) {
  const [form, setForm] = useState(() => toFormState(project));
  const [image, setImage] = useState(null);

  useEffect(() => {
    setForm(toFormState(project));
    setImage(null);
  }, [project]);

  const update = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const payload = new FormData();
    if (form.id) payload.set('id', form.id);
    payload.set('title', form.title.trim());
    payload.set('type', form.type);
    payload.set('tags', JSON.stringify(form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)));
    payload.set('description', form.desc.trim());
    payload.set('live_url', form.url.trim());
    payload.set('github_url', form.github.trim());
    payload.set('published', form.published ? '1' : '0');
    if (form.sortOrder !== '') payload.set('sort_order', String(form.sortOrder));
    if (image) payload.set('image', image);
    onSave(payload);
  };

  return (
    <section className="card admin-editor" aria-labelledby="project-editor-title">
      <div className="admin-section-heading">
        <div>
          <p className="admin-eyebrow">Editor</p>
          <h2 id="project-editor-title">{form.id ? `Edit ${form.title}` : 'New project'}</h2>
        </div>
      </div>

      <form className="admin-form admin-form--project" onSubmit={submit}>
        <div className="admin-form-grid">
          <label>
            Title
            <input name="title" value={form.title} onChange={update} maxLength="150" required />
          </label>
          <label>
            Category
            <select name="type" value={form.type} onChange={update} required>
              <option value="noroff">Noroff</option>
              <option value="personal">Personal</option>
            </select>
          </label>
        </div>

        <label>
          Description
          <textarea name="desc" value={form.desc} onChange={update} rows="7" maxLength="5000" required />
        </label>
        <label>
          Tags <span className="admin-label-hint">Comma separated</span>
          <input name="tags" value={form.tags} onChange={update} placeholder="React, Course Assignment" />
        </label>
        <label>
          Live website URL
          <input name="url" type="url" value={form.url} onChange={update} required />
        </label>
        <label>
          GitHub URL <span className="admin-label-hint">Optional</span>
          <input name="github" type="url" value={form.github} onChange={update} />
        </label>
        <div className="admin-form-grid">
          <label>
            Sort order
            <input name="sortOrder" type="number" value={form.sortOrder} onChange={update} min="0" max="10000" />
          </label>
          <label className="admin-checkbox">
            <input name="published" type="checkbox" checked={form.published} onChange={update} />
            Published
          </label>
        </div>
        <label>
          Project image {form.id && <span className="admin-label-hint">Leave empty to keep the current image</span>}
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required={!form.id && !form.img}
            onChange={(event) => setImage(event.target.files[0] || null)}
          />
        </label>

        {form.img && (
          <div className="admin-image-preview">
            <span>Current image</span>
            <img src={form.img} alt={`Current preview for ${form.title}`} />
          </div>
        )}

        <div className="admin-form-actions">
          <button className="btn admin-primary-action" type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save project'}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onCancel} disabled={busy}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
