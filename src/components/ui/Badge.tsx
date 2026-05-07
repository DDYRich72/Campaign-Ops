import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Editorial badges: paper-tone backgrounds, ink rules, low-chroma earth status colors.
const variantClasses = {
  default: 'bg-rule-soft text-ink-soft border border-rule',
  success: 'bg-[#EAEFE2] text-[#3A5731] border border-[#C8D4B8]',
  warning: 'bg-[#F4ECD8] text-[#8A6817] border border-[#DCCFA8]',
  error:   'bg-oxblood-tint text-oxblood border border-[#E0C9C2]',
  info:    'bg-[#E5ECEE] text-[#2D5868] border border-[#C5D2D6]',
};

const dotColors = {
  default: 'bg-ink-faint',
  success: 'bg-[#3A5731]',
  warning: 'bg-[#8A6817]',
  error:   'bg-oxblood',
  info:    'bg-[#2D5868]',
};

export function Badge({ variant = 'default', dot = false, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] text-[11px] font-medium tracking-tight',
        variantClasses[variant],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
}
