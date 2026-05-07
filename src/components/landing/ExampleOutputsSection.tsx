'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const tabs = ['Email', 'Social Post', 'Ad Copy', 'Blog Outline', 'Visual Prompt', 'Video Prompt'] as const;
type Tab = (typeof tabs)[number];

const outputs: Record<Tab, { title: string; content: string; meta: string }> = {
  Email: {
    title: 'Week 1 — Welcome Email',
    meta: '312 words · Subject line + full body',
    content: `Subject: Your summer transformation starts here

Hi [First Name],

Summer is here — and we think it's the perfect time to make a change.

Whether you've been meaning to get more active, or you're just looking for a cool place to escape the heat, AquaFit Studio has something for you: 50% off your first month, plus a free welcome gear bag when you sign up this week.

Here's what you get from day one:

— Unlimited access to our heated indoor pool
— Group fitness classes every day (including evenings)
— A beginner-friendly environment — no intimidation, no judgment

We designed AquaFit specifically for people who've felt left out of traditional gyms. You don't need to be a strong swimmer or an athlete. You just need to show up.

Ready to get started? Use code SUMMER50 at checkout.

[Claim Your Spot →]

To your best summer yet,
The AquaFit Team

P.S. This offer expires July 31. Don't leave a gear bag on the table.`,
  },
  'Social Post': {
    title: 'Instagram Carousel — Week 2',
    meta: '5 slides · Hook + value + CTA',
    content: `Slide 1 (Hook):
Beat the heat AND get fit this summer.
[Visual: aerial pool shot with bright water]

Slide 2:
Most people think they're "not gym people."
We built AquaFit for exactly those people.
No judgment. No intimidation. Just results.

Slide 3:
Here's what a typical week looks like at AquaFit:
→ Mon: Aqua Cardio (6am, 7pm)
→ Wed: Lap Swimming + Core
→ Fri: Beginner Swim Class
→ Sat: Family Open Swim

Slide 4:
This month only: 50% off your first month.
Plus a complimentary welcome gear bag.
That's an $85 value — yours free.

Slide 5 (CTA):
Don't let another summer go by.
Link in bio → Claim your spot.
Offer ends July 31.`,
  },
  'Ad Copy': {
    title: 'Google Ads — Search Campaign',
    meta: '3 headlines + 2 descriptions · Character-optimized',
    content: `Headline 1: 50% Off First Month at AquaFit
Headline 2: Indoor Pool + Fitness Classes | Austin
Headline 3: Beginner-Friendly | Sign Up Today

Description 1:
Beat the summer heat and get fit with AquaFit Studio. Heated indoor pool, group classes, and flexible scheduling. First month 50% off — claim now.

Description 2:
No experience needed. AquaFit is designed for adults who want to get active without the gym intimidation. Join this month and get a free gear bag.

———

Facebook Ad (Awareness):
Headline: Finally, a gym you'll actually want to go to.
Body: If you've avoided gyms because they feel unwelcoming — AquaFit was built for you. Indoor pool, real classes, real community. 50% off your first month → link below.
CTA Button: Learn More`,
  },
  'Blog Outline': {
    title: '5 Tips for Building a Summer Fitness Routine',
    meta: 'SEO blog post · ~1,200 words · Targets "summer fitness Austin"',
    content: `Title: 5 Tips for Building a Summer Fitness Routine (That You'll Actually Stick To)

Target Keyword: summer fitness routine Austin
Secondary: indoor fitness summer, pool workout benefits

Introduction (150 words):
Why summer is uniquely challenging for fitness — heat, schedule changes, motivation dips. Brief preview of tips.

Tip 1: Start with Low-Impact Activities (200 words)
→ Why swimming and aqua fitness are ideal for summer
→ Joint-friendly, cooling, effective
→ Internal link opportunity: "our group aqua fitness classes"

Tip 2: Build a Weekly Schedule, Not a Daily Habit (200 words)
→ Research on weekly planning vs. daily habits
→ Sample 3-day/week workout schedule

Tip 3: Find Social Accountability (150 words)
→ Group classes vs. solo workouts
→ Community benefits for motivation

Tip 4: Adjust for the Heat (150 words)
→ Indoor vs. outdoor timing
→ Hydration and recovery tips

Tip 5: Make It Enjoyable, Not Punishing (150 words)
→ Fitness you like = fitness you keep
→ Variety and fun as a strategy

Conclusion + CTA (100 words):
Soft pitch: AquaFit offers all of the above. Try it at 50% off this summer.`,
  },
  'Visual Prompt': {
    title: 'Day 12 — Image prompt for Instagram Reel',
    meta: 'Paste into DALL·E, GPT Image 2.0, or Gemini (Nano Banana) — your choice',
    content: `Visual Prompt:

A wide, low-angle photograph of a heated indoor lap pool at golden-hour light. Soft warm tones reflect off the water surface. A single swimmer in mid-stroke creates a quiet ripple; lane lines stretch toward the far end. The architecture is minimal and modern — exposed wood beams, large frosted-glass windows. Mood: serene, inviting, beginner-friendly. No people in foreground. Editorial, magazine-quality framing. 16:9 aspect ratio.

———

Alt-text (for accessibility):
A swimmer mid-stroke in a calm, sunlit indoor pool with wood-beam ceilings.

Suggested caption pairing:
"Most gyms are designed for people who already love them. We built AquaFit for the rest of us. ↓"`,
  },
  'Video Prompt': {
    title: 'Day 18 — Video prompt for Instagram Reel',
    meta: 'Paste into Sora, Veo 3 (Gemini), Runway, or Pika',
    content: `Video Prompt:

Open with a tight overhead shot of still water in an indoor lap pool — golden morning light catching the surface. A swimmer's hand breaks the frame, sending out concentric ripples. Cut to a slow side-tracking shot following the swimmer mid-lane, breath rhythmic. End on a wide static shot of the empty deck and warm wood beams overhead.

Mood: calm, considered, welcoming — not aggressive or "fitness-bro."
On-screen text (final 2 seconds): "Built for the rest of us." centred, sans-serif, soft fade in.
B-roll alternatives: empty pool at dawn; locker room with hung towels; chalkboard schedule.
Camera direction: handheld → smooth tracking → static. 9:16 vertical, 12 seconds total.

———

Suggested caption pairing:
"Most gyms are loud. Ours isn't. Sound on for a quiet swim →"

Recommended duration: 10-15 seconds (Reel/TikTok sweet spot).`,
  },
};

export function ExampleOutputsSection() {
  const [activeTab, setActiveTab] = useState<Tab>('Email');

  return (
    <section id="examples" className="bg-paper-deep border-y border-rule">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-14 py-24 lg:py-32">
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-12">
          <p className="editorial-eyebrow">§ III &middot; Specimens</p>
          <p className="editorial-eyebrow hidden sm:block">Selected works</p>
          <p className="editorial-eyebrow">Pages 11 &mdash; 14</p>
        </div>

        <div className="max-w-[640px] mb-16">
          <h2 className="font-display text-[36px] sm:text-[46px] leading-[1.05] text-ink tracking-[-0.02em]">
            See what gets <span className="display-italic">drafted</span>.
          </h2>
          <p className="mt-6 text-[16px] text-ink-soft leading-relaxed max-w-[480px]">
            Excerpts from a campaign drafted for a fitness studio in Austin. Yours will read in your voice, for your audience.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-x-7 gap-y-2 mb-10 border-b border-rule">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-4 text-[13px] tracking-tight transition-colors -mb-px border-b',
                activeTab === tab
                  ? 'text-ink border-ink font-medium'
                  : 'text-ink-soft border-transparent hover:text-ink'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Output card */}
        <div className="max-w-[820px]">
          <div className="bg-card border border-rule">
            {/* Card header */}
            <div className="flex items-baseline justify-between px-8 py-6 border-b border-rule">
              <div>
                <p className="font-display text-[18px] text-ink tracking-tight">
                  {outputs[activeTab].title}
                </p>
                <p className="text-[12px] text-ink-faint mt-1 italic">
                  {outputs[activeTab].meta}
                </p>
              </div>
              <p className="editorial-eyebrow hidden sm:block">Plate 03</p>
            </div>
            {/* Content */}
            <div className="px-8 py-8">
              <pre className="text-[13px] text-ink leading-[1.7] whitespace-pre-wrap font-sans">
                {outputs[activeTab].content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
