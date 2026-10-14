import { Field } from './Field';

export function Textarea({ label, helper, error, required, className = '', ...props }) {
  return (
    <Field className={className} error={error} helper={helper} label={label} required={required}>
      {(controlProps) => <textarea className="field__control field__control--textarea" {...controlProps} {...props} />}
    </Field>
  );
}
