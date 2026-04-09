const personas = [
  {
    icon: '🧑‍💻',
    title: 'Solopreneurs',
    painPoint: '"I know my offer is good — I just don\'t have time to write all the content."',
    solution: 'Get a full campaign built in minutes so you can focus on delivering your product or service.',
  },
  {
    icon: '🏪',
    title: 'Small Business Owners',
    painPoint: '"I\'ve tried running promotions before but they never feel coordinated or professional."',
    solution: 'AI builds a cohesive multi-channel strategy so every touchpoint reinforces your message.',
  },
  {
    icon: '🎓',
    title: 'Coaches & Consultants',
    painPoint: '"Every time I launch something, I spend days writing emails and posts — it drains me."',
    solution: 'Launch faster. Describe your program once and get every asset you need to fill it.',
  },
  {
    icon: '🛍️',
    title: 'E-commerce Brands',
    painPoint: '"We run seasonal promotions but our messaging is inconsistent across channels."',
    solution: 'Aligned email, social, and ad copy for every promotion — all generated from one brief.',
  },
];

export function WhoItsForSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface-sidebar relative">
      <div className="absolute inset-0 bg-dot-grid-faint pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Who It&apos;s For</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight font-display">
            Built for people who do everything
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            You shouldn&apos;t need a marketing team to run a great campaign. AI Campaign Operator is your team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona) => (
            <div
              key={persona.title}
              className="rounded-xl border border-border-subtle bg-surface-card p-6 hover:border-violet-500/30 hover:shadow-glow-violet transition-all shadow-card"
            >
              <div className="text-3xl mb-4">{persona.icon}</div>
              <h3 className="text-base font-semibold text-slate-200 mb-3">{persona.title}</h3>
              <p className="text-xs text-slate-500 italic mb-3 leading-relaxed">{persona.painPoint}</p>
              <div className="h-px bg-border-subtle mb-3" />
              <p className="text-sm text-slate-400 leading-relaxed">{persona.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
