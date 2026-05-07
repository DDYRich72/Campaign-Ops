import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantClasses = {
  primary:
    'bg-ink text-paper border border-ink hover:bg-black active:translate-y-px',
  secondary:
    'bg-card text-ink border border-ink hover:bg-paper',
  ghost:
    'bg-transparent text-ink border border-transparent hover:bg-rule-soft',
  destructive:
    'bg-oxblood text-paper border border-oxblood hover:bg-oxblood-deep',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-[12px] rounded-[3px] gap-1.5',
  md: 'h-10 px-5 text-[13px] rounded-[3px] gap-2',
  lg: 'h-12 px-7 text-[14px] rounded-[3px] gap-2 font-medium',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium tracking-tight transition-colors duration-150 select-none',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
          variantClasses[variant],
          sizeClasses[size],
          (disabled || loading) && 'opacity-40 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
