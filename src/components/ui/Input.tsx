import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';
import { Label } from './Label';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-paper border-b text-[14px] text-ink placeholder:text-ink-faint',
            'px-1 py-2.5 rounded-none transition-colors',
            'focus:outline-none focus:border-ink',
            error
              ? 'border-oxblood'
              : 'border-rule hover:border-ink/40',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-[11px] text-oxblood">{error}</p>}
        {hint && !error && <p className="mt-2 text-[11px] text-ink-faint">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
