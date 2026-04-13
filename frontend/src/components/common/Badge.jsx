export function Badge({ children, tone = 'default', className = '' }) {
  return <span className={['badge', `badge--${tone}`, className].filter(Boolean).join(' ')}>{children}</span>;
}
