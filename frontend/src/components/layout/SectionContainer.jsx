export function SectionContainer({ children, className = '', as: Component = 'section' }) {
  return <Component className={['section-container', className].filter(Boolean).join(' ')}>{children}</Component>;
}
