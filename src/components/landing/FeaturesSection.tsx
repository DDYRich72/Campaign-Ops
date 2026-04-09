const features = [
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    title: 'AI Campaign Strategy',
    description: 'Get a complete 30-day marketing plan built around your specific offer, audience, and goals — in minutes.',
    color: 'text-violet-400 bg-violet-500/15',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
      </svg>
    ),
    title: 'Multi-Channel Output',
    description: 'Generate content for email, social media, paid ads, SEO blog posts, landing pages, and SMS — all in one go.',
    color: 'text-cyan-400 bg-cyan-500/15',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Ready-to-Use Content',
    description: 'Every asset is production-ready — copy-paste emails, captions, ad headlines, and blog outlines straight into your tools.',
    color: 'text-emerald-400 bg-emerald-500/15',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Deep Audience Targeting',
    description: "Input your audience's pain points and the AI tailors every message to resonate with the right people.",
    color: 'text-violet-400 bg-violet-500/15',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Brand Voice Matching',
    description: 'Set your tone — energetic, professional, warm — and every piece of content stays consistent with how your brand sounds.',
    color: 'text-amber-400 bg-amber-500/15',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
    title: '30-Day Content Calendar',
    description: 'Walk away with a day-by-day publishing schedule so you always know what to post and when.',
    color: 'text-cyan-400 bg-cyan-500/15',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-surface-sidebar relative">
      <div className="absolute inset-0 bg-dot-grid-faint pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight font-display">
            Everything you need to run a campaign
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Stop piecing together tools. One input, one platform, one complete campaign.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-surface-card rounded-xl border border-border-subtle shadow-card p-6 hover:border-violet-500/30 hover:shadow-glow-violet transition-all"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
