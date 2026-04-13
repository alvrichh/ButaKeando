export function Select({ label, helper, error, options = [], className = '', ...props }) {
  return (
    <label className={['field', className].filter(Boolean).join(' ')}>
      <span className="field__label">{label}</span>
      <select className="field__control" {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(helper || error) && <span className="field__help">{error || helper}</span>}
    </label>
  );
}
