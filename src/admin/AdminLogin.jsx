import { useState } from 'react';

export default function AdminLogin({ busy, error, onLogin, onSetup }) {
  const [setupMode, setSetupMode] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get('email').trim();
    const password = form.get('password');

    if (setupMode) {
      onSetup(email, password, form.get('setupToken').trim());
    } else {
      onLogin(email, password);
    }
  };

  return (
    <main className="admin-auth">
      <section className="card admin-auth__card" aria-labelledby="admin-login-title">
        <a className="brand" href="/">Sander Nilsen</a>
        <p className="admin-eyebrow">Portfolio administration</p>
        <h1 id="admin-login-title">{setupMode ? 'Create the first administrator' : 'Sign in'}</h1>
        <p className="admin-muted">
          {setupMode
            ? 'This works only while the administrators table is empty and requires the private setup token.'
            : 'Manage the projects shown on your portfolio.'}
        </p>

        {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}

        <form className="admin-form" onSubmit={submit}>
          <label>
            Email
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete={setupMode ? 'new-password' : 'current-password'}
              minLength={setupMode ? 12 : undefined}
              maxLength="1024"
              required
            />
          </label>
          {setupMode && (
            <label>
              Setup token
              <input name="setupToken" type="password" autoComplete="off" minLength="32" maxLength="512" required />
            </label>
          )}
          <button className="btn admin-primary-action" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : setupMode ? 'Create administrator' : 'Sign in'}
          </button>
        </form>

        <button className="admin-text-button" type="button" onClick={() => setSetupMode((value) => !value)}>
          {setupMode ? 'Return to sign in' : 'First-time setup'}
        </button>
      </section>
    </main>
  );
}
