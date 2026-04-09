import { cn } from '@/lib/utils';
import { DashboardStat } from '@/data/mock';

const iconMap = {
  campaigns: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
    </svg>
  ),
  assets: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    </svg>
  ),
  channels: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm3 6v-1h4v1a2 2 0 11-4 0zm4-3a3 3 0 10-4 0h4z" />
    </svg>
  ),
  time: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  ),
};

const changeTypeStyles = {
  positive: 'text-emerald-400',
  negative: 'text-red-500',
  neutral: 'text-slate-500',
};

export function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <div className="bg-surface-card rounded-xl border border-border-subtle shadow-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.title}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-100">{stat.value}</p>
        </div>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
          {iconMap[stat.iconType]}
        </div>
      </div>
      <p className={cn('mt-3 text-xs font-medium', changeTypeStyles[stat.changeType])}>
        {stat.changeType === 'positive' && '↑ '}
        {stat.changeType === 'negative' && '↓ '}
        {stat.change}
      </p>
    </div>
  );
}
