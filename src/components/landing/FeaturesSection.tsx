const features = [
  {
    title: 'Campaign strategy',
    description:
      'A thirty-day plan built around your specific offer, audience, and goal — not a template.',
  },
  {
    title: 'Multi-channel output',
    description:
      'Email, social posts, paid-ad copy, SEO blog topics, landing pages, and SMS — drafted together so they tell one story.',
  },
  {
    title: 'Image prompts, your choice of tool',
    description:
      'Every day comes with a visual prompt you can paste into DALL·E, GPT Image, or Gemini (Nano Banana) — pick the model that matches your style. Or upload your own.',
  },
  {
    title: 'Video prompts for the moving days',
    description:
      'Reels, Stories, TikToks and video ads come with a shot-by-shot description ready for Sora, Veo 3, Runway, or Pika. Generate the clip; publish it your way.',
  },
  {
    title: 'Audience-aware copy',
    description:
      'Describe your audience’s pain points; the writing speaks to them, not to a marketing committee.',
  },
  {
    title: 'Brand voice matching',
    description:
      'Set your tone — energetic, professional, warm — and every piece stays consistent.',
  },
  {
    title: 'Thirty-day calendar',
    description:
      'A day-by-day publishing queue so you always know what to post, when, and where.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-paper">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-14 py-24 lg:py-32">
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-12">
          <p className="editorial-eyebrow">§ II &middot; The Brief</p>
          <p className="editorial-eyebrow hidden sm:block">Six provisions</p>
          <p className="editorial-eyebrow">Pages 8 &mdash; 9</p>
        </div>

        <div className="max-w-[640px] mb-20">
          <h2 className="font-display text-[36px] sm:text-[46px] leading-[1.05] text-ink tracking-[-0.02em]">
            Everything you need
            <br />
            to run a <span className="display-italic">proper</span> campaign.
          </h2>
          <p className="mt-6 text-[16px] text-ink-soft leading-relaxed max-w-[480px]">
            Stop piecing together tools. One brief in, a coordinated campaign out.
          </p>
        </div>

        {/* Editorial two-column list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2 border-t border-ink pt-1">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className="grid grid-cols-[auto_1fr] gap-6 py-7 border-b border-rule"
            >
              <span className="font-display text-[12px] tabular-nums text-ink-faint pt-1 tracking-tight">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-[20px] text-ink mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-ink-soft leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
