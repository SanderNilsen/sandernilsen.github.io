export default function ExternalButton({ href, icon, children, ghost = false, small = false }) {
  const classes = ['btn'];
  if (small) classes.push('btn-sm');
  if (ghost) classes.push('btn-ghost');

  return (
    <a className={classes.join(' ')} href={href} target="_blank" rel="noopener noreferrer">
      <i className={icon} aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}
