export function PageHeading({ label, title, lead, children }) {
  return (
    <header className="page-heading">
      {label ? <span className="page-heading__label mono">{label}</span> : null}
      <h1>{title}</h1>
      {lead ? <p className="page-heading__lead">{lead}</p> : null}
      {children}
    </header>
  );
}
