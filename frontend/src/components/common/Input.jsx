export function Input({ label, helper, error, className = '', ...props }) {
  return (
    <label className={['field', className].filter(Boolean).join(' ')}>
      <span className="field__label">{label}</span>
      <input className="field__control" {...props} />
      {(helper || error) && <span className="field__help">{error || helper}</span>}
    </label>
  );
}
