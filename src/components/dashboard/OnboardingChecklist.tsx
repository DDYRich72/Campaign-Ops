import Link from 'next/link';
import type { CampaignRow, BusinessProfileRow } from '@/lib/supabase/types';

interface Step {
  label: string;
  description: string;
  done: boolean;
  href: string;
  cta: string;
}

function CheckStep({ step, index }: { step: Step; index: number }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        {step.done ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
            <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border-subtle bg-surface-raised">
            <span className="text-xs font-semibold text-slate-400">{index + 1}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-medium ${step.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
            {step.label}
          </p>
          {!step.done && (
            <Link
              href={step.href}
              className="flex-shrink-0 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors whitespace-nowrap"
            >
              {step.cta} →
            </Link>
          )}
        </div>
        {!step.done && (
          <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
        )}
      </div>
    </div>
  );
}

interface OnboardingChecklistProps {
  profile: BusinessProfileRow | null;
  campaigns: CampaignRow[];
}

export function OnboardingChecklist({ profile, campaigns }: OnboardingChecklistProps) {
  const firstCampaign = campaigns[0] ?? null;

  const steps: Step[] = [
    {
      label: 'Complete your business profile',
      description: 'Add your business name, industry, and audience so campaigns pre-fill automatically.',
      done: !!(profile?.business_name && profile?.industry),
      href: '/profile',
      cta: 'Set up profile',
    },
    {
      label: 'Create your first campaign',
      description: 'Describe your offer, goal, and channels to get started.',
      done: campaigns.length > 0,
      href: '/campaigns/create',
      cta: 'Create campaign',
    },
    {
      label: 'Generate campaign strategy',
      description: 'Let AI build your strategy, content pillars, and 30-day outline.',
      done: !!(firstCampaign?.strategy_json),
      href: firstCampaign ? `/campaigns/${firstCampaign.id}` : '/campaigns',
      cta: 'Generate now',
    },
    {
      label: 'Generate full content',
      description: 'Write captions, hooks, hashtags, and visual prompts for all 30 days.',
      done: !!(firstCampaign?.full_content_json?.length),
      href: firstCampaign ? `/campaigns/${firstCampaign.id}` : '/campaigns',
      cta: 'Generate content',
    },
    {
      label: 'Generate funnel assets',
      description: 'Create landing page copy and your 5-email follow-up sequence.',
      done: !!(firstCampaign?.landing_page_json),
      href: firstCampaign ? `/campaigns/${firstCampaign.id}` : '/campaigns',
      cta: 'Generate assets',
    },
    {
      label: 'Mark campaign ready to launch',
      description: 'Set your campaign to Ready or Active when you are prepared to publish.',
      done: campaigns.some((c) => c.status === 'ready' || c.status === 'active'),
      href: firstCampaign ? `/campaigns/${firstCampaign.id}` : '/campaigns',
      cta: 'Review campaign',
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  // Hide once everything is done
  if (allDone) return null;

  const progressPct = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="rounded-xl border border-violet-500/25 bg-violet-500/10 p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-violet-300">Get started</h2>
          <p className="text-xs text-violet-400 mt-0.5">
            {completedCount} of {steps.length} steps complete
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="text-lg font-bold text-violet-400">{progressPct}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1.5 w-full rounded-full bg-violet-500/20">
        <div
          className="h-1.5 rounded-full bg-violet-600 transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <CheckStep key={step.label} step={step} index={i} />
        ))}
      </div>
    </div>
  );
}
