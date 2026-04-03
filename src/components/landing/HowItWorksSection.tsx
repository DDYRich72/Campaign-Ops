const steps = [
  {
    number: '01',
    title: 'Describe Your Offer',
    description:
      'Fill in a simple intake form: your business, target audience, offer, goals, and brand voice. Takes about 5 minutes.',
    detail: 'No writing required — just answer the questions and we handle the rest.',
  },
  {
    number: '02',
    title: 'AI Builds the Campaign',
    description:
      'Our AI generates a complete 30-day strategy, content calendar, email sequences, social posts, ad copy, and more.',
    detail: 'Every asset is tailored to your offer, audience, and brand — not generic templates.',
  },
  {
    number: '03',
    title: 'Execute and Grow',
    description:
      'Download your assets, copy content straight to your tools, and follow the day-by-day plan to run your campaign.',
    detail: 'Iterate, refine, and generate new campaigns as your business grows.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            From offer to campaign in 3 steps
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            No marketing degree required. Just tell us about your business.
          </p>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-violet-200 via-violet-400 to-violet-200 hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Step number circle */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 shadow-lg shadow-violet-200 mb-6 z-10">
                  <span className="text-lg font-bold text-white">{step.number}</span>
                  {index < steps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-violet-400 hidden lg:block">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{step.description}</p>
                <p className="text-xs text-slate-400 italic">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
