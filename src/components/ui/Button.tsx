import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantClasses = {
  primary:
    'btn-shimmer text-white border border-violet-600/50 shadow-glow-violet hover:shadow-glow-violet-lg hover:border-violet-500 transition-shadow',
  secondary:
    'bg-surface-raised hover:bg-border-subtle text-slate-200 border border-border-DEFAULT hover:border-border-bright transition-colors',
  ghost:
    'bg-transparent hover:bg-surface-raised text-slate-400 hover:text-slate-200 border border-transparent hover:border-border-subtle transition-colors',
  destructive:
    'bg-red-600/90 hover:bg-red-500 text-white border border-red-500/50 transition-colors',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-9 px-4 text-sm rounded-lg gap-2',
  lg: 'h-11 px-6 text-sm rounded-xl gap-2 font-semibold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-body',
          variantClasses[variant],
          sizeClasses[size],
          (disabled || loading) && 'opacity-40 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
