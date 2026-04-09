import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';
import { Label } from './Label';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, id, rows = 4, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={textareaId} required={required}>
            {label}
          </Label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full resize-none rounded-lg border bg-surface-raised px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 transition-colors',
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

Textarea.displayName = 'Textarea';
