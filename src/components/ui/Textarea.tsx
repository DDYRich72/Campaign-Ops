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
            'w-full resize-none bg-paper border text-[14px] text-ink placeholder:text-ink-faint leading-relaxed',
            'px-3 py-2.5 rounded-[3px] transition-colors',
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

Textarea.displayName = 'Textarea';
