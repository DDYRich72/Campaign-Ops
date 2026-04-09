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
            'w-full rounded-lg border bg-surface-raised px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
            error
              ? 'border-red-500/60 focus:ring-red-500'
              : 'border-border-subtle hover:border-border',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-slate-600">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
