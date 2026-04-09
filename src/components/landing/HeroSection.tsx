import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-surface-body">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      {/* Dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/30 px-3.5 py-1.5 text-xs font-medium text-violet-300 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-glow-pulse" />
            Now in Beta — Build smarter campaigns in minutes
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 leading-tight font-display">
            Turn One Offer Into a{' '}
            <span className="text-gradient">Full 30-Day</span>{' '}
            Marketing Campaign
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            AI Campaign Operator helps small businesses go from a single offer to a complete, coordinated marketing campaign — strategy, content, captions, and copy — in minutes, not weeks.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center rounded-xl btn-shimmer px-8 text-base font-semibold text-white shadow-glow-violet transition-all"
            >
              Start for Free
              <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-surface-raised hover:bg-border-subtle border border-border-subtle px-8 text-base font-semibold text-slate-300 transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Trust line */}
          <p className="mt-6 text-xs text-slate-600">
            No credit card required · Free to start · Setup in 2 minutes
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="mt-16 mx-auto max-w-5xl">
          <div className="rounded-2xl border border-border-subtle bg-surface-card shadow-card shadow-violet-500/10 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-surface-sidebar border-b border-border-subtle">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-amber-500/70" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
              <div className="flex-1 mx-4">
                <div className="h-5 rounded-md bg-surface-raised max-w-xs mx-auto flex items-center justify-center">
                  <span className="text-[10px] text-slate-600">app.campaignoperator.com/campaigns/summer-launch</span>
                </div>
              </div>
            </div>

            {/* Mock app UI */}
            <div className="flex h-[360px] sm:h-[420px]">
              {/* Sidebar */}
              <div className="w-44 bg-surface-sidebar border-r border-border-subtle p-3 hidden sm:flex flex-col gap-1 flex-shrink-0">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
                  <div className="h-5 w-5 rounded bg-gradient-to-br from-violet-500 to-violet-700 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-slate-300 truncate">Campaign Operator</span>
                </div>
                {[
                  { label: 'Dashboard', active: false },
                  { label: 'Campaigns', active: true },
                  { label: 'Assets', active: false },
                  { label: 'Settings', active: false },
                ].map(({ label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${active ? 'nav-active' : 'text-slate-600'}`}
                  >
                    <span className={`text-xs font-medium ${active ? 'text-slate-200' : 'text-slate-500'}`}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-4 sm:p-5 bg-surface-body overflow-hidden flex flex-col gap-3">
                {/* Campaign header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">Summer Launch — Fitness Studio</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">Active</span>
                    </div>
                    <span className="text-[11px] text-slate-500">30-day campaign · Instagram · Email · Facebook</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    <span className="text-[10px] text-violet-400 font-medium">AI Generated</span>
                  </div>
                </div>

                {/* Strategy strip */}
                <div className="rounded-lg border border-border-subtle bg-surface-card px-3 py-2.5 flex gap-4 flex-shrink-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest mb-0.5">Campaign Objective</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed truncate">Drive 50 new memberships in 30 days through a limited summer offer targeting local fitness-seekers aged 25–45.</p>
                  </div>
                  <div className="flex-1 min-w-0 hidden sm:block">
                    <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest mb-0.5">Messaging Angle</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed truncate">Stop waiting for the "right time." Summer is here — and so is your last excuse.</p>
                  </div>
                </div>

                {/* Content day cards */}
                <div className="flex flex-col gap-2 overflow-hidden flex-1">
                  {[
                    {
                      day: 1,
                      platform: 'Instagram',
                      platformColor: 'bg-pink-500/15 text-pink-400',
                      type: 'Reel',
                      topic: 'Why Most People Quit the Gym by Week 3',
                      hook: 'You don\'t have a motivation problem — you have a system problem.',
                      caption: 'Hint: it\'s not willpower. Here\'s the 3-step system our members use to stay consistent all summer long...',
                    },
                    {
                      day: 2,
                      platform: 'Email',
                      platformColor: 'bg-sky-500/15 text-sky-400',
                      type: 'Newsletter',
                      topic: 'Your Summer Body Starts With One Decision',
                      hook: 'Most people wait until they "feel ready." Here\'s why that\'s the trap.',
                      caption: 'We\'re offering 50 founding summer memberships at 40% off — no contracts, cancel anytime.',
                    },
                    {
                      day: 3,
                      platform: 'Facebook',
                      platformColor: 'bg-blue-500/15 text-blue-400',
                      type: 'Post',
                      topic: 'Member Spotlight: Sarah Lost 18lbs in 8 Weeks',
                      hook: '"I had tried everything. This was the first place that felt like it was built for real people."',
                      caption: 'Real results from real members. Sarah joined during our last promotion — and never looked back.',
                    },
                  ].map((item) => (
                    <div key={item.day} className="flex items-start gap-2.5 rounded-lg border border-border-subtle bg-surface-card px-3 py-2">
                      <span className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-[10px] font-bold mt-0.5">{item.day}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${item.platformColor}`}>{item.platform}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-slate-200 truncate">{item.topic}</p>
                        <p className="text-[10px] text-slate-500 truncate italic">"{item.hook}"</p>
                      </div>
                      <span className="text-[10px] text-slate-600 flex-shrink-0 hidden sm:block">{item.type}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom hint */}
                <div className="flex items-center justify-between pt-1 border-t border-border-subtle flex-shrink-0">
                  <span className="text-[10px] text-slate-600">Showing 3 of 30 days</span>
                  <span className="text-[10px] text-violet-500 font-medium">+ 27 more days generated ✦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
