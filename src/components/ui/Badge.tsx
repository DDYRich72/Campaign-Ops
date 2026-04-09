import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-surface-raised text-slate-400 border border-border-DEFAULT',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
  error:   'bg-red-500/10 text-red-400 border border-red-500/25',
  info:    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25',
};

const dotColors = {
  default: 'bg-slate-500',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error:   'bg-red-400',
  info:    'bg-cyan-400',
};

export function Badge({ variant = 'default', dot = false, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide',
        variantClasses[variant],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
}
