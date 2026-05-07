import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accent?: 'violet' | 'cyan' | 'emerald' | 'amber' | 'none';
}

const paddingClasses = {
  none:  '',
  sm:    'p-5',
  md:    'p-6',
  lg:    'p-8',
};

// Accent prop kept for backward compat; on paper we render a single ink hairline
// at the top regardless of color, since the editorial language uses one accent.
const accentClasses = {
  none:    '',
  violet:  'border-t-[1.5px] border-t-ink',
  cyan:    'border-t-[1.5px] border-t-ink',
  emerald: 'border-t-[1.5px] border-t-ink',
  amber:   'border-t-[1.5px] border-t-ink',
};

export function Card({ children, className, padding = 'md', accent = 'none' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-rule rounded-[3px] transition-colors',
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
    <div className={cn('flex items-center justify-between mb-5', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('font-display text-[17px] font-medium text-ink tracking-tight', className)}>
      {children}
    </h3>
  );
}
