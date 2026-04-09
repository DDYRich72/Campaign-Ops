import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accent?: 'violet' | 'cyan' | 'emerald' | 'amber' | 'none';
}

const paddingClasses = {
  none:  '',
  sm:    'p-4',
  md:    'p-5',
  lg:    'p-8',
};

const accentClasses = {
  none:    '',
  violet:  'card-accent-violet',
  cyan:    'card-accent-cyan',
  emerald: 'card-accent-emerald',
  amber:   'card-accent-amber',
};

export function Card({ children, className, padding = 'md', accent = 'none' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface-card rounded-xl border border-border-subtle shadow-card transition-colors hover:border-border',
        accentClasses[accent],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-sm font-semibold text-slate-300 font-display tracking-wide', className)}>
      {children}
    </h3>
  );
}
