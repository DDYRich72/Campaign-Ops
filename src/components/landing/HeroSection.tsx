import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-paper">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-14 pt-20 pb-24 lg:pt-32 lg:pb-32">
        {/* Editorial masthead row */}
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-16">
          <p className="editorial-eyebrow">Volume I &middot; Issue 01</p>
          <p className="editorial-eyebrow hidden sm:block">A field guide for small businesses</p>
          <p className="editorial-eyebrow">No. 30 / 30</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Headline column */}
          <div className="lg:col-span-7">
            <h1 className="font-display text-[44px] sm:text-[60px] lg:text-[78px] leading-[0.98] text-ink tracking-[-0.02em]">
              One offer.
              <br />
              <span className="display-italic">Thirty days</span> of
              <br />
              marketing, drafted
              <br />
              before lunch.
            </h1>

            <p className="mt-10 text-[17px] text-ink-soft leading-[1.6] max-w-[560px]">
              Campaign Operator turns a single offer into a complete thirty-day
              campaign — strategy, content calendar, emails, social posts, and
              ad copy — all written in your voice, ready to use.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center bg-ink px-7 text-[14px] font-medium text-paper hover:bg-black transition-colors rounded-[3px]"
              >
                Begin a campaign
              </Link>
              <Link
                href="#how-it-works"
                className="text-[14px] text-ink-soft hover:text-ink transition-colors underline underline-offset-[5px] decoration-rule hover:decoration-ink"
              >
                See how it works
              </Link>
            </div>

            <p className="mt-8 text-[12px] text-ink-faint">
              No credit card &middot; Free to start &middot; Two-minute setup
            </p>
          </div>

          {/* Specimen card column — replaces browser-chrome mockup */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-rule p-8 sm:p-10">
              <div className="flex items-baseline justify-between border-b border-rule pb-2 mb-6">
                <p className="editorial-eyebrow">Specimen</p>
                <p className="editorial-eyebrow">Day 01 / 30</p>
              </div>

              <p className="font-display text-[12px] uppercase tracking-[0.18em] text-ink-faint mb-2">
                Instagram &middot; Reel
              </p>
              <h3 className="font-display text-[24px] leading-tight text-ink mb-4">
                Why Most People Quit the Gym <span className="display-italic">by Week Three</span>
              </h3>
              <p className="text-[14px] text-ink-soft leading-relaxed italic mb-6 border-l border-ink pl-4">
                &ldquo;You don&rsquo;t have a motivation problem &mdash; you
                have a system problem.&rdquo;
              </p>
              <p className="text-[13px] text-ink-soft leading-relaxed">
                Hint: it&rsquo;s not willpower. Here&rsquo;s the three-step
                system our members use to stay consistent through the summer.
              </p>

              <div className="mt-8 pt-6 border-t border-rule flex items-baseline justify-between">
                <p className="editorial-eyebrow">Tomorrow</p>
                <p className="text-[12px] text-ink-soft">
                  Email &mdash; <span className="italic">Your Summer Body Starts With One Decision</span>
                </p>
              </div>
            </div>

            {/* Editorial caption */}
            <p className="mt-4 text-[11px] text-ink-faint italic px-1">
              Excerpt from a thirty-day campaign drafted for a fitness studio in Austin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
