import { Link } from 'react-router-dom';

function buildClassName(parts) {
  return parts.filter(Boolean).join(' ');
}

export function Button({
  children,
  to,
  href,
  tone = 'primary',
  size = 'md',
  block = false,
  className = '',
  type = 'button',
  ...props
}) {
  const classes = buildClassName([
    'button',
    `button--${tone}`,
    `button--${size}`,
    block && 'button--block',
    className,
  ]);

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
