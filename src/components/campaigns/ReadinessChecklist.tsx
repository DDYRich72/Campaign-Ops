import type { CampaignRow } from '@/lib/supabase/types';

interface CheckItem {
  label: string;
  done: boolean;
}

function CheckRow({ label, done }: CheckItem) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      {done ? (
        <svg className="h-4 w-4 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="h-4 w-4 flex-shrink-0 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
        </svg>
      )}
      <span className={`text-sm ${done ? 'text-slate-300' : 'text-slate-500'}`}>{label}</span>
    </div>
  );
}

export function ReadinessChecklist({ campaign }: { campaign: CampaignRow }) {
  const items: CheckItem[] = [
    { label: 'Strategy generated', done: !!campaign.strategy_json },
    { label: 'Content pillars generated', done: !!(campaign.content_pillars_json?.length) },
    { label: '30-day outline generated', done: !!(campaign.campaign_outline_json?.length) },
    { label: 'Full content generated', done: !!(campaign.full_content_json?.length) },
    { label: 'Landing page generated', done: !!campaign.landing_page_json },
    { label: 'Email sequence generated', done: !!(campaign.email_sequence_json?.length) },
  ];

  const completedCount = items.filter((i) => i.done).length;
  const isReady = completedCount === items.length;

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-card px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Publish Readiness
        </h2>
        {isReady ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-2.5 py-0.5">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Ready to publish
          </span>
        ) : (
          <span className="text-xs text-slate-400">{completedCount} / {items.length} complete</span>
        )}
      </div>
      <div className="divide-y divide-border-subtle">
        {items.map((item) => (
          <CheckRow key={item.label} label={item.label} done={item.done} />
        ))}
      </div>
    </div>
  );
}
