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
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Who It&apos;s For</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Built for people who do everything
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            You shouldn&apos;t need a marketing team to run a great campaign. AI Campaign Operator is your team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona) => (
            <div
              key={persona.title}
              className="rounded-xl border border-slate-200 bg-white p-6 hover:border-violet-200 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-4">{persona.icon}</div>
              <h3 className="text-base font-semibold text-slate-900 mb-3">{persona.title}</h3>
              <p className="text-xs text-slate-500 italic mb-3 leading-relaxed">{persona.painPoint}</p>
              <div className="h-px bg-slate-100 mb-3" />
              <p className="text-sm text-slate-600 leading-relaxed">{persona.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
