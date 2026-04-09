import Link from 'next/link';
import { PLANS, PLAN_ORDER, FREE_LIMITS } from '@/lib/plans';

export const metadata = { title: 'Pricing — Campaign Operator' };

function CheckIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 text-violet-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-900">Campaign Operator</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/sign-in" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-violet-600 hover:bg-violet-700 px-4 text-sm font-semibold text-white shadow-sm transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            One offer. One plan. A complete 30-day marketing campaign — generated in minutes.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {PLAN_ORDER.map((key) => {
            const plan = PLANS[key];
            return (
              <div
                key={key}
                className={`relative rounded-2xl border p-8 flex flex-col gap-6 ${
                  plan.highlighted
                    ? 'border-violet-400 shadow-xl shadow-violet-100'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      Most popular
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{plan.label}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-sm text-slate-500">/month</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">{plan.description}</p>
                </div>

                <Link
                  href="/sign-up"
                  className={`w-full inline-flex items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-violet-600 text-white hover:bg-violet-700'
                      : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Get started with {plan.label}
                </Link>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">What&apos;s included</p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckIcon />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limits summary */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Monthly limits</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                    <span className="text-xs text-slate-500">Campaigns</span>
                    <span className="text-xs font-medium text-slate-700">{plan.limits.campaigns}</span>
                    <span className="text-xs text-slate-500">Strategy runs</span>
                    <span className="text-xs font-medium text-slate-700">{plan.limits.strategyGenerations}</span>
                    <span className="text-xs text-slate-500">Content runs</span>
                    <span className="text-xs font-medium text-slate-700">{plan.limits.fullContentGenerations}</span>
                    <span className="text-xs text-slate-500">Funnel runs</span>
                    <span className="text-xs font-medium text-slate-700">{plan.limits.funnelGenerations}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free tier note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Not ready to commit?{' '}
            <Link href="/sign-up" className="font-medium text-violet-600 hover:text-violet-800 transition-colors">
              Start free
            </Link>{' '}
            — {FREE_LIMITS.campaigns} campaign, {FREE_LIMITS.strategyGenerations} strategy generations included.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Common questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel anytime from your billing settings. You keep access until the end of your billing period.',
              },
              {
                q: 'What counts as a generation?',
                a: 'Each time you run "Generate Campaign", "Generate Full Content", or "Generate Funnel Assets" counts as one generation toward your plan limit.',
              },
              {
                q: 'What happens when I hit a limit?',
                a: 'The action is blocked and you will see a clear upgrade prompt. Nothing fails silently.',
              },
              {
                q: 'Can I upgrade mid-month?',
                a: 'Yes. Stripe prorates upgrades automatically. You only pay the difference.',
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="text-sm font-semibold text-slate-800">{q}</p>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
