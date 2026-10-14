import { useId } from 'react';

export function Field({ label, helper, error, required, className = '', children }) {
  const controlId = useId();
  const helpId = `${controlId}-help`;
  const helpText = error || helper;

  return (
    <div className={['field', error && 'field--invalid', className].filter(Boolean).join(' ')}>
      <label className="field__label" htmlFor={controlId}>
        {label}
        {required ? (
          <span aria-hidden="true" className="field__required">
            *
          </span>
        ) : null}
      </label>
      {children({
        id: controlId,
        required,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': helpText ? helpId : undefined,
      })}
      {helpText ? (
        <span className="field__help" id={helpId} role={error ? 'alert' : undefined}>
          {helpText}
        </span>
      ) : null}
    </div>
  );
}
