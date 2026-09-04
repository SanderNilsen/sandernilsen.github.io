import { useCallback, useEffect, useState } from 'react';
import AdminLogin from './AdminLogin.jsx';
import ProjectEditor from './ProjectEditor.jsx';
import ProjectList from './ProjectList.jsx';
import {
  ApiError,
  deleteProject,
  getAdminProjects,
  getAdminSession,
  isGitHubPages,
  login,
  logout,
  reorderProjects,
  runInitialSetup,
  saveProject,
} from '../services/api.js';

export default function AdminApp() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
  );

  const handleApiError = useCallback((requestError) => {
    if (requestError instanceof ApiError && requestError.status === 401) {
      setAuthenticated(false);
      setCsrfToken('');
      setProjects([]);
      setError('Your session expired. Please sign in again.');
      return;
    }
    setError(requestError.message || 'Something went wrong.');
  }, []);

  const loadProjects = useCallback(async () => {
    const payload = await getAdminProjects();
    setProjects(payload.projects);
  }, []);

  useEffect(() => {
    if (isGitHubPages) {
      setCheckingSession(false);
      return;
    }

    getAdminSession()
      .then(async (session) => {
        setAuthenticated(session.authenticated);
        setCsrfToken(session.csrfToken || '');
        if (session.authenticated) await loadProjects();
      })
      .catch(handleApiError)
      .finally(() => setCheckingSession(false));
  }, [handleApiError, loadProjects]);

  const authenticate = async (action) => {
    setBusy(true);
    setError('');
    try {
      const session = await action();
      setAuthenticated(true);
      setCsrfToken(session.csrfToken);
      await loadProjects();
    } catch (requestError) {
      handleApiError(requestError);
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (formData) => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await saveProject(formData, csrfToken);
      await loadProjects();
      setEditingProject(null);
      setMessage('Project saved. The public portfolio has been updated.');
    } catch (requestError) {
      handleApiError(requestError);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await deleteProject(project.id, csrfToken);
      await loadProjects();
      if (editingProject?.id === project.id) setEditingProject(null);
      setMessage('Project deleted.');
    } catch (requestError) {
      handleApiError(requestError);
    } finally {
      setBusy(false);
    }
  };

  const handleMove = async (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= projects.length) return;
    const reordered = [...projects];
    [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
    setProjects(reordered);
    setBusy(true);
    setError('');
    try {
      const payload = await reorderProjects(reordered.map((project) => project.id), csrfToken);
      setProjects(payload.projects);
    } catch (requestError) {
      handleApiError(requestError);
      await loadProjects().catch(() => {});
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    try {
      await logout(csrfToken);
    } catch (_) {
      // Clear the local session state even if the server session already expired.
    } finally {
      setAuthenticated(false);
      setCsrfToken('');
      setProjects([]);
      setEditingProject(null);
      setBusy(false);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('portfolio-theme', next);
    } catch (_) {
      // The theme still applies for this browser session.
    }
  };

  if (isGitHubPages) {
    return (
      <main className="admin-auth">
        <section className="card admin-auth__card">
          <p className="admin-eyebrow">Portfolio administration</p>
          <h1>Use the primary website</h1>
          <p className="admin-muted">The database-backed dashboard is available only on sandernilsen.no.</p>
          <a className="btn admin-primary-action" href="https://sandernilsen.no/admin/">Open admin dashboard</a>
        </section>
      </main>
    );
  }

  if (checkingSession) {
    return <main className="admin-loading" aria-live="polite">Checking your session…</main>;
  }

  if (!authenticated) {
    return (
      <AdminLogin
        busy={busy}
        error={error}
        onLogin={(email, password) => authenticate(() => login(email, password))}
        onSetup={(email, password, token) => authenticate(() => runInitialSetup(email, password, token))}
      />
    );
  }

  return (
    <div className="admin-shell">
      <header className="site-header">
        <div className="container admin-header">
          <a className="brand" href="/">Sander Nilsen</a>
          <div className="admin-header__actions">
            <button className="btn btn-sm btn-ghost" type="button" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button className="btn btn-sm" type="button" onClick={handleLogout} disabled={busy}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="container admin-main">
        <div className="admin-title">
          <p className="admin-eyebrow">Dashboard</p>
          <h1>Portfolio projects</h1>
          <p className="admin-muted">Add, edit, publish, remove, and reorder projects without rebuilding the website.</p>
        </div>

        {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
        {message && <p className="admin-message admin-message--success" role="status">{message}</p>}

        <div className="admin-layout">
          <ProjectList
            projects={projects}
            busy={busy}
            onCreate={() => setEditingProject({})}
            onEdit={setEditingProject}
            onDelete={handleDelete}
            onMove={handleMove}
          />
          {editingProject !== null && (
            <ProjectEditor
              project={editingProject}
              busy={busy}
              onCancel={() => setEditingProject(null)}
              onSave={handleSave}
            />
          )}
        </div>
      </main>
    </div>
  );
}
