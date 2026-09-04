import { useEffect, useMemo, useState } from 'react';

export default function GitHubStat({ theme, darkSrc, lightSrc, label, link, alt, width, height }) {
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const source = theme === 'light' ? lightSrc : darkSrc;
  const src = useMemo(
    () => (retry ? `${source}${source.includes('?') ? '&' : '?'}reload=${Date.now()}` : source),
    [source, retry],
  );

  useEffect(() => setFailed(false), [source]);

  return (
    <>
      <img
        className={failed ? 'github-stat--hidden' : undefined}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
        onLoad={() => setFailed(false)}
        onError={() => setFailed(true)}
      />
      {failed && (
        <div className="github-fallback" role="status">
          <p className="github-fallback__text">
            {label} is temporarily unavailable. These GitHub visuals sometimes hit rate limits.
          </p>
          <div className="github-fallback__actions">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                setFailed(false);
                setRetry((value) => value + 1);
              }}
            >
              Try again
            </button>
            <a className="btn btn-sm btn-ghost" href={link} target="_blank" rel="noopener noreferrer">
              Open on GitHub
            </a>
          </div>
        </div>
      )}
    </>
  );
}
