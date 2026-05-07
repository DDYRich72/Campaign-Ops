import { cn } from '@/lib/utils';
import { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'block text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-soft mb-2',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-oxblood">*</span>}
    </label>
  );
}
