import { useId, type SelectHTMLAttributes } from 'react';
import './Field.css';

type SelectOption = { value: string; label: string };

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'children'> & {
  /** Visible label. Required: every select needs one. */
  label: string;
  options: SelectOption[];
};

export function Select({ label, options, className, ...props }: SelectProps) {
  const id = useId();
  return (
    <div className={['rs-field', className].filter(Boolean).join(' ')}>
      <label className="rs-field__label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="rs-field__control" {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
