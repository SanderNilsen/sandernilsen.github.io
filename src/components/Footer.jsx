export default function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <div className="container footer-wrap">
        <div className="footer-brand">
          <a className="brand" href="#hero">Sander Nilsen</a>
          <p className="footer-lead">Open to freelance &amp; collaboration.</p>
        </div>

        <div className="footer-actions">
          <a
            className="btn btn--icon"
            href="https://www.linkedin.com/in/sandernilsen/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fa-brands fa-linkedin" aria-hidden="true" />
          </a>
          <a
            className="btn btn--icon"
            href="https://github.com/SanderNilsen"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <i className="fa-brands fa-github" aria-hidden="true" />
          </a>
        </div>

        <div className="footer-meta">© {new Date().getFullYear()} Sander Nilsen</div>
      </div>
    </footer>
  );
}
