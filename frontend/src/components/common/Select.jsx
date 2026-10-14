import { Field } from './Field';

export function Select({ label, helper, error, required, options = [], className = '', ...props }) {
  return (
    <Field className={className} error={error} helper={helper} label={label} required={required}>
      {(controlProps) => (
        <select className="field__control" {...controlProps} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
