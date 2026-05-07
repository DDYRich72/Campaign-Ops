const steps = [
  {
    number: '01',
    title: 'Describe your offer',
    description:
      'A short intake — your business, audience, offer, brand voice. Five minutes, no marketing jargon.',
    detail: 'No writing required. Answer the questions; we handle the rest.',
  },
  {
    number: '02',
    title: 'A campaign is drafted',
    description:
      'A complete thirty-day plan: strategy, content calendar, email sequences, social posts, ad copy, blog outlines.',
    detail: 'Tailored to your offer, audience, and brand — not generic templates.',
  },
  {
    number: '03',
    title: 'Publish at your pace',
    description:
      'Copy assets straight to your tools. Mark items posted as you go. Refine, regenerate, or upload your own images.',
    detail: 'Iterate, refine, and start the next campaign whenever you&rsquo;re ready.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-paper-deep border-y border-rule">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-14 py-24 lg:py-32">
        {/* Section masthead */}
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-12">
          <p className="editorial-eyebrow">§ I &middot; Method</p>
          <p className="editorial-eyebrow hidden sm:block">Three movements</p>
          <p className="editorial-eyebrow">Pages 4 &mdash; 6</p>
        </div>

        <div className="max-w-[640px] mb-20">
          <h2 className="font-display text-[36px] sm:text-[46px] leading-[1.05] text-ink tracking-[-0.02em]">
            From offer to campaign,
            <br />
            <span className="display-italic">in three movements</span>.
          </h2>
          <p className="mt-6 text-[16px] text-ink-soft leading-relaxed max-w-[480px]">
            No marketing degree required. Tell us about your business; we
            handle the structure, the copy, and the calendar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {steps.map((step, i) => (
            <article key={step.number} className="relative">
              {/* Connecting rule */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[88px] right-[-2.5rem] h-px bg-rule" />
              )}

              <div className="flex items-baseline gap-5 mb-6">
                <span className="font-display text-[56px] leading-none text-ink tracking-tight">
                  {step.number}
                </span>
                <span className="h-px flex-1 bg-rule mb-2" />
              </div>

              <h3 className="font-display text-[22px] text-ink mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-[14px] text-ink-soft leading-relaxed mb-3">
                {step.description}
              </p>
              <p className="text-[12px] text-ink-faint italic leading-relaxed">
                {step.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
