import { useId, type InputHTMLAttributes } from 'react';
import './Field.css';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  /** Visible label. Required: every input needs one. */
  label: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={['rs-field', className].filter(Boolean).join(' ')}>
      <label className="rs-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="rs-field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="rs-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
