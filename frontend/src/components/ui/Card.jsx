export function Card({ children, className = '', as: Component = 'article' }) {
  return <Component className={['card', className].filter(Boolean).join(' ')}>{children}</Component>;
}
