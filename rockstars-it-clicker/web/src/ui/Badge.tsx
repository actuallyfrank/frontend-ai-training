import type { HTMLAttributes } from 'react';
import './Badge.css';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={['rs-badge', className].filter(Boolean).join(' ')} {...props} />;
}
