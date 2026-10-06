import type { HTMLAttributes } from 'react';
import './Card.css';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Draws a border in the spotlight colour, e.g. for selected or featured items. */
  highlighted?: boolean;
};

export function Card({ highlighted = false, className, ...props }: CardProps) {
  const classes = ['rs-card', highlighted && 'rs-card--highlighted', className]
    .filter(Boolean)
    .join(' ');
  return <div className={classes} {...props} />;
}
