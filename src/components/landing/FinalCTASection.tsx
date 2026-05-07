import Link from 'next/link';

export function FinalCTASection() {
  return (
    <section className="bg-paper-deep border-y border-rule">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-14 py-28 lg:py-36">
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-16">
          <p className="editorial-eyebrow">Colophon</p>
          <p className="editorial-eyebrow hidden sm:block">An invitation</p>
          <p className="editorial-eyebrow">Final page</p>
        </div>

        <div className="max-w-[820px] mx-auto text-center">
          <p className="ornament-asterism" />

          <h2 className="font-display text-[40px] sm:text-[58px] lg:text-[72px] leading-[1.0] text-ink tracking-[-0.02em]">
            Your next campaign
            <br />
            is <span className="display-italic">five minutes</span> away.
          </h2>

          <p className="mt-10 text-[17px] text-ink-soft leading-relaxed max-w-[560px] mx-auto">
            Stop putting off your next promotion. Describe your offer; we&rsquo;ll draft the campaign while you focus on running your business.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center bg-ink px-8 text-[14px] font-medium text-paper hover:bg-black transition-colors rounded-[3px]"
            >
              Begin a campaign
            </Link>
            <Link
              href="/sign-in"
              className="text-[14px] text-ink-soft hover:text-ink transition-colors underline underline-offset-[5px] decoration-rule hover:decoration-ink"
            >
              Already a subscriber? Sign in
            </Link>
          </div>

          <p className="mt-10 text-[12px] text-ink-faint">
            No credit card &middot; Free to start &middot; Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
