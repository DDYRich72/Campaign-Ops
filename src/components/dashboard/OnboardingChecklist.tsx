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
    <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-5 py-5 border-b border-rule last:border-b-0">
      {/* Numeral / check */}
      <div className="font-display text-[13px] tabular-nums tracking-tight">
        {step.done ? (
          <span className="text-ink-faint">✓</span>
        ) : (
          <span className="text-ink">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>

      {/* Label + description */}
      <div className="min-w-0">
        <p className={`text-[14px] tracking-tight ${step.done ? 'text-ink-faint line-through' : 'text-ink'}`}>
          {step.label}
        </p>
        {!step.done && (
          <p className="text-[12px] text-ink-soft mt-1.5 leading-relaxed">{step.description}</p>
        )}
      </div>

      {/* CTA */}
      {!step.done ? (
        <Link
          href={step.href}
          className="text-[12px] text-ink hover:text-oxblood transition-colors whitespace-nowrap underline underline-offset-[5px] decoration-rule hover:decoration-oxblood"
        >
          {step.cta}
        </Link>
      ) : (
        <span />
      )}
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
      cta: 'Set up profile →',
    },
    {
      label: 'Create your first campaign',
      description: 'Describe your offer, goal, and channels to get started.',
      done: campaigns.length > 0,
      href: '/campaigns/create',
      cta: 'Create campaign →',
    },
    {
      label: 'Generate campaign strategy',
      description: 'Let the operator draft your strategy, content pillars, and 30-day outline.',
      done: !!(firstCampaign?.strategy_json),
      href: firstCampaign ? `/campaigns/${firstCampaign.id}` : '/campaigns',
      cta: 'Generate now →',
    },
    {
      label: 'Generate full content',
      description: 'Write captions, hooks, hashtags, and visual prompts for all 30 days.',
      done: !!(firstCampaign?.full_content_json?.length),
      href: firstCampaign ? `/campaigns/${firstCampaign.id}` : '/campaigns',
      cta: 'Generate content →',
    },
    {
      label: 'Generate funnel assets',
      description: 'Create landing-page copy and your five-email follow-up sequence.',
      done: !!(firstCampaign?.landing_page_json),
      href: firstCampaign ? `/campaigns/${firstCampaign.id}` : '/campaigns',
      cta: 'Generate assets →',
    },
    {
      label: 'Mark campaign ready to launch',
      description: 'Set your campaign to Ready or Active when you are prepared to publish.',
      done: campaigns.some((c) => c.status === 'ready' || c.status === 'active'),
      href: firstCampaign ? `/campaigns/${firstCampaign.id}` : '/campaigns',
      cta: 'Review campaign →',
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  if (allDone) return null;

  const progressPct = Math.round((completedCount / steps.length) * 100);

  return (
    <section className="bg-card border border-rule p-7 sm:p-9">
      <div className="flex items-baseline justify-between border-b border-ink pb-3 mb-5">
        <p className="editorial-eyebrow">Getting started</p>
        <p className="text-[12px] text-ink-soft tracking-tight tabular-nums">
          {completedCount} / {steps.length} complete
        </p>
      </div>

      {/* Progress rule — thin ink line over rule line */}
      <div className="mb-2 h-px w-full bg-rule relative">
        <div
          className="absolute inset-y-0 left-0 bg-ink transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="mb-7 text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink-faint">
        {progressPct}%
      </p>

      <div>
        {steps.map((step, i) => (
          <CheckStep key={step.label} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}
