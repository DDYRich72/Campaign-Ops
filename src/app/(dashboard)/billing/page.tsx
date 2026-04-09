import { auth } from '@clerk/nextjs/server';
import { Card } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { CheckoutButton } from '@/components/billing/CheckoutButton';
import { ManageBillingButton } from '@/components/billing/ManageBillingButton';
import { getSubscription, getUsageCounters } from '@/lib/subscription';
import { getPlan, getLimits, PLAN_ORDER, PLANS } from '@/lib/plans';
import type { PlanKey } from '@/lib/plans';

export const metadata = { title: 'Billing — Campaign Operator' };

function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const isNearLimit = pct >= 80;
  const isAtLimit = used >= limit;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`text-xs font-medium ${isAtLimit ? 'text-red-400' : isNearLimit ? 'text-amber-400' : 'text-slate-500'}`}>
          {used} / {limit}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-raised">
        <div
          className={`h-1.5 rounded-full transition-all ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-violet-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string };
}) {
  const { userId } = await auth();

  const [sub, usage] = await Promise.all([
    getSubscription(userId!),
    getUsageCounters(userId!),
  ]);

  const planKey = (sub?.plan_key as PlanKey) ?? null;
  const plan = getPlan(planKey);
  const limits = getLimits(planKey);
  const isActive = sub?.status === 'active';

  const periodEnd = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : null;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Billing</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your subscription and view usage.</p>
      </div>

      {/* Success / canceled banners */}
      {searchParams.success && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-4 py-3 text-sm text-emerald-400">
          Subscription activated — welcome to {plan?.label ?? 'your plan'}!
        </div>
      )}
      {searchParams.canceled && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 px-4 py-3 text-sm text-amber-400">
          Checkout canceled. Your plan has not changed.
        </div>
      )}

      {/* Current plan */}
      <Card>
        <h2 className="text-base font-semibold text-slate-200 mb-1">Current Plan</h2>
        <Separator />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-slate-100">{plan?.label ?? 'Free'}</p>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-surface-raised text-slate-500'
              }`}>
                {isActive ? 'Active' : 'Free tier'}
              </span>
            </div>
            {plan && <p className="text-sm text-slate-500 mt-0.5">{plan.price}/month</p>}
            {periodEnd && (
              <p className="text-xs text-slate-400 mt-1">Renews {periodEnd}</p>
            )}
            {!plan && (
              <p className="text-sm text-slate-500 mt-0.5">
                You are on the free tier with limited usage.
              </p>
            )}
          </div>
          <div className="flex-shrink-0 flex flex-col gap-2">
            {isActive ? (
              <ManageBillingButton />
            ) : (
              <CheckoutButton
                planKey="growth"
                label="Upgrade to Growth"
                className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors disabled:opacity-60"
              />
            )}
          </div>
        </div>
      </Card>

      {/* Usage */}
      <Card>
        <h2 className="text-base font-semibold text-slate-200 mb-1">Usage This Period</h2>
        <p className="text-xs text-slate-500 mb-4">
          {plan ? `Your ${plan.label} plan limits.` : 'Free tier limits — upgrade to get more.'}
        </p>
        <Separator />
        <div className="mt-4 space-y-4">
          <UsageBar
            label="Campaigns created"
            used={usage?.campaigns_created ?? 0}
            limit={limits.campaigns}
          />
          <UsageBar
            label="Strategy generations"
            used={usage?.strategy_generations ?? 0}
            limit={limits.strategyGenerations}
          />
          <UsageBar
            label="Full content generations"
            used={usage?.full_content_generations ?? 0}
            limit={limits.fullContentGenerations}
          />
          <UsageBar
            label="Funnel asset generations"
            used={usage?.funnel_generations ?? 0}
            limit={limits.funnelGenerations}
          />
        </div>
        {!isActive && (
          <div className="mt-4 rounded-lg bg-violet-500/10 border border-violet-500/20 px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-violet-300">Upgrade to unlock higher limits.</p>
            <CheckoutButton
              planKey="starter"
              label="See plans"
              className="flex-shrink-0 inline-flex items-center justify-center rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors disabled:opacity-60"
            />
          </div>
        )}
      </Card>

      {/* Plan comparison */}
      {!isActive && (
        <Card>
          <h2 className="text-base font-semibold text-slate-200 mb-1">Available Plans</h2>
          <Separator />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLAN_ORDER.map((key) => {
              const p = PLANS[key];
              return (
                <div
                  key={key}
                  className={`rounded-xl border p-4 flex flex-col gap-3 ${
                    p.highlighted ? 'border-violet-500/50 bg-violet-500/10' : 'border-border-subtle bg-surface-raised'
                  }`}
                >
                  {p.highlighted && (
                    <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">Most popular</span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-200">{p.label}</p>
                    <p className="text-lg font-bold text-slate-100">{p.price}<span className="text-xs font-normal text-slate-500">/mo</span></p>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400 flex-1">
                    {p.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <svg className="h-3.5 w-3.5 flex-shrink-0 text-violet-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <CheckoutButton
                    planKey={key}
                    label={`Choose ${p.label}`}
                    className={`w-full inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
                      p.highlighted
                        ? 'bg-violet-600 text-white hover:bg-violet-700'
                        : 'border border-border-subtle bg-surface-card text-slate-300 hover:bg-surface-raised'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
