const personas = [
  {
    title: 'Solopreneurs',
    painPoint: 'I know my offer is good — I just don’t have time to write all the content.',
    solution: 'A full campaign in minutes, so you can focus on delivering your product or service.',
  },
  {
    title: 'Small Business Owners',
    painPoint: 'I’ve tried promotions before, but they never feel coordinated or professional.',
    solution: 'A cohesive multi-channel plan so every touchpoint reinforces the same message.',
  },
  {
    title: 'Coaches & Consultants',
    painPoint: 'Every launch I spend days writing emails and posts — it drains me.',
    solution: 'Describe your program once; receive every asset you need to fill it.',
  },
  {
    title: 'E-commerce Brands',
    painPoint: 'Our seasonal promotions never quite feel aligned across channels.',
    solution: 'Email, social, and ad copy drafted from a single brief — always in step.',
  },
];

export function WhoItsForSection() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-14 py-24 lg:py-32">
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-12">
          <p className="editorial-eyebrow">§ IV &middot; Readers</p>
          <p className="editorial-eyebrow hidden sm:block">Who this is for</p>
          <p className="editorial-eyebrow">Pages 16 &mdash; 17</p>
        </div>

        <div className="max-w-[640px] mb-20">
          <h2 className="font-display text-[36px] sm:text-[46px] leading-[1.05] text-ink tracking-[-0.02em]">
            Built for people
            <br />
            who do <span className="display-italic">everything</span>.
          </h2>
          <p className="mt-6 text-[16px] text-ink-soft leading-relaxed max-w-[480px]">
            You shouldn’t need a marketing team to run a serious campaign.
            Campaign Operator <span className="italic">is</span> the team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 border-t border-ink pt-1">
          {personas.map((persona, i) => (
            <article key={persona.title} className="grid grid-cols-[auto_1fr] gap-6 py-8 border-b border-rule">
              <span className="font-display text-[12px] tabular-nums text-ink-faint pt-1.5 tracking-tight">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-[24px] text-ink mb-4 tracking-tight">
                  {persona.title}
                </h3>
                <p className="text-[14px] text-ink-soft italic leading-relaxed mb-4 border-l border-ink pl-4">
                  &ldquo;{persona.painPoint}&rdquo;
                </p>
                <p className="text-[14px] text-ink leading-relaxed">
                  {persona.solution}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
