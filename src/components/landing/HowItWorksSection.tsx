const steps = [
  {
    number: '01',
    title: 'Describe Your Offer',
    description:
      'Fill in a simple intake form: your business, target audience, offer, goals, and brand voice. Takes about 5 minutes.',
    detail: 'No writing required — just answer the questions and we handle the rest.',
    color: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    glow: 'shadow-glow-violet',
  },
  {
    number: '02',
    title: 'AI Builds the Campaign',
    description:
      'Our AI generates a complete 30-day strategy, content calendar, email sequences, social posts, ad copy, and more.',
    detail: 'Every asset is tailored to your offer, audience, and brand — not generic templates.',
    color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    glow: 'shadow-glow-cyan',
  },
  {
    number: '03',
    title: 'Execute and Grow',
    description:
      'Download your assets, copy content straight to your tools, and follow the day-by-day plan to run your campaign.',
    detail: 'Iterate, refine, and generate new campaigns as your business grows.',
    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    glow: 'shadow-glow-emerald',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-surface-body relative">
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight font-display">
            From offer to campaign in 3 steps
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            No marketing degree required. Just tell us about your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+2rem)] right-[-50%] h-px bg-gradient-to-r from-border-bright to-transparent hidden lg:block" />
              )}

              {/* Step number circle */}
              <div className={`relative flex h-16 w-16 items-center justify-center rounded-full border ${step.color} ${step.glow} mb-6 z-10`}>
                <span className="text-lg font-bold font-display">{step.number}</span>
              </div>

              <h3 className="text-lg font-semibold text-slate-200 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-3">{step.description}</p>
              <p className="text-xs text-slate-600 italic">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
