import { cn } from '@/lib/utils';
import { DashboardStat } from '@/data/mock';

const changeTypeStyles = {
  positive: 'text-[#3A5731]',
  negative: 'text-oxblood',
  neutral: 'text-ink-faint',
};

export function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <div className="bg-card border border-rule p-7">
      <p className="editorial-eyebrow">{stat.title}</p>
      <p className="stat-numeral mt-5 text-[52px] text-ink">{stat.value}</p>
      <p className={cn('mt-4 text-[12px] font-medium tracking-tight', changeTypeStyles[stat.changeType])}>
        {stat.changeType === 'positive' && '↑ '}
        {stat.changeType === 'negative' && '↓ '}
        {stat.change}
      </p>
    </div>
  );
}
