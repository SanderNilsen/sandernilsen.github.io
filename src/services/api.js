import fallbackProjects from '../../server/api/projects-fallback.json';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const apiBaseUrl = (
  configuredApiUrl
  || (window.location.hostname.endsWith('github.io')
    ? 'https://sandernilsen.no/api'
    : '/api')
).replace(/\/$/, '');

export const isGitHubPages = window.location.hostname.endsWith('github.io');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { body, headers, ...options } = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    body,
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    // A useful fallback is returned below for non-JSON server errors.
  }

  if (!response.ok) {
    throw new ApiError(payload?.error || 'The server could not complete the request.', response.status);
  }

  return payload;
}

function jsonRequest(path, method, data, csrfToken) {
  return request(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    body: JSON.stringify(data),
  });
}

export function getPublicProjects(signal) {
  const normalize = (payload) => ({
    ...payload,
    projects: payload.projects.map((project) => ({
      ...project,
      img: isGitHubPages && project.img.startsWith('/')
        ? `https://sandernilsen.no${project.img}`
        : project.img,
    })),
  });

  return request('/projects', { signal, credentials: 'omit' })
    .then(normalize)
    .catch((error) => {
      if (error.name === 'AbortError') throw error;
      return normalize({ ...fallbackProjects, source: 'fallback' });
    });
}

export function getAdminSession() {
  return request('/auth/session');
}

export function login(email, password) {
  return jsonRequest('/auth/login', 'POST', { email, password });
}

export function logout(csrfToken) {
  return jsonRequest('/auth/logout', 'POST', {}, csrfToken);
}

export function getAdminProjects() {
  return request('/admin/projects');
}

export function saveProject(formData, csrfToken) {
  return request('/admin/projects', {
    method: 'POST',
    headers: { 'X-CSRF-Token': csrfToken },
    body: formData,
  });
}

export function deleteProject(id, csrfToken) {
  return request(`/admin/projects/${id}`, {
    method: 'DELETE',
    headers: { 'X-CSRF-Token': csrfToken },
  });
}

export function reorderProjects(ids, csrfToken) {
  return jsonRequest('/admin/projects/reorder', 'POST', { ids }, csrfToken);
}
