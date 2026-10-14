import { Field } from './Field';

export function Input({ label, helper, error, required, className = '', ...props }) {
  return (
    <Field className={className} error={error} helper={helper} label={label} required={required}>
      {(controlProps) => <input className="field__control" {...controlProps} {...props} />}
    </Field>
  );
}
