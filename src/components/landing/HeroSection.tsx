import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Grid pattern bg */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 border border-violet-200 px-3.5 py-1.5 text-xs font-medium text-violet-700 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
            Now in Beta — Build smarter campaigns in minutes
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
            Turn One Offer Into a{' '}
            <span className="text-gradient">Full 30-Day</span>{' '}
            Marketing Campaign
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            AI Campaign Operator helps small businesses go from a single offer to a complete, coordinated marketing campaign — strategy, content, captions, and copy — in minutes, not weeks.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-700 px-8 text-base font-semibold text-white shadow-sm transition-colors"
            >
              Start for Free
              <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white hover:bg-slate-50 border border-slate-200 px-8 text-base font-semibold text-slate-700 shadow-sm transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Trust line */}
          <p className="mt-6 text-xs text-slate-400">
            No credit card required · Free to start · Setup in 2 minutes
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="mt-16 mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-violet-100/50 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4">
                <div className="h-5 rounded-md bg-slate-200 max-w-xs mx-auto" />
              </div>
            </div>
            {/* Mock app UI */}
            <div className="flex h-64 sm:h-80">
              {/* Sidebar stub */}
              <div className="w-48 bg-white border-r border-slate-100 p-3 hidden sm:block">
                <div className="h-6 rounded bg-slate-100 mb-4" />
                {['Dashboard', 'Campaigns', 'Create', 'Assets'].map((item) => (
                  <div
                    key={item}
                    className={`h-7 rounded-lg mb-1 ${item === 'Campaigns' ? 'bg-violet-50' : 'bg-slate-50'}`}
                  />
                ))}
              </div>
              {/* Main content stub */}
              <div className="flex-1 p-5 bg-slate-50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-white border border-slate-200 shadow-sm" />
                  ))}
                </div>
                <div className="h-32 rounded-xl bg-white border border-slate-200 shadow-sm mb-3" />
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-white border border-slate-200 shadow-sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
