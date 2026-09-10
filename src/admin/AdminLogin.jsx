export default function AdminLogin({ busy, error, onLogin }) {
  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get('email').trim();
    const password = form.get('password');

    onLogin(email, password);
  };

  return (
    <main className="admin-auth">
      <section className="card admin-auth__card" aria-labelledby="admin-login-title">
        <a className="brand" href="/">Sander Nilsen</a>
        <p className="admin-eyebrow">Portfolio administration</p>
        <h1 id="admin-login-title">Sign in</h1>
        <p className="admin-muted">
          Manage the projects shown on your portfolio.
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
              autoComplete="current-password"
              maxLength="1024"
              required
            />
          </label>
          <button className="btn admin-primary-action" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
