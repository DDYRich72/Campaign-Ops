import Link from 'next/link';

export function FinalCTASection() {
  return (
    <section className="py-20 lg:py-28 bg-surface-sidebar relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-violet-500/10 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-dot-grid-faint pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 tracking-tight leading-tight font-display">
            Your next campaign is{' '}
            <span className="text-gradient">5 minutes away</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400">
            Stop putting off your next promotion. Describe your offer and let AI build the whole campaign while you focus on running your business.
          </p>
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
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-surface-raised hover:bg-border-subtle border border-border-subtle px-8 text-base font-semibold text-slate-300 transition-colors"
            >
              Create a Campaign →
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-600">
            No credit card required · Free to start · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
