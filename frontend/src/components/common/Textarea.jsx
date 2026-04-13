export function Textarea({ label, helper, error, className = '', ...props }) {
  return (
    <label className={['field', className].filter(Boolean).join(' ')}>
      <span className="field__label">{label}</span>
      <textarea className="field__control field__control--textarea" {...props} />
      {(helper || error) && <span className="field__help">{error || helper}</span>}
    </label>
  );
}
