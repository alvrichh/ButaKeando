import { Link } from 'react-router-dom';

function buildClassName(parts) {
  return parts.filter(Boolean).join(' ');
}

export function Button({
  children,
  to,
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

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
