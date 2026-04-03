'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const tabs = ['Email', 'Social Post', 'Ad Copy', 'Blog Outline'] as const;
type Tab = (typeof tabs)[number];

const outputs: Record<Tab, { title: string; content: string; meta: string }> = {
  Email: {
    title: 'Week 1 — Welcome Email',
    meta: '312 words · Subject line + full body',
    content: `Subject: Your summer transformation starts here 🏊

Hi [First Name],

Summer is here — and we think it's the perfect time to make a change.

Whether you've been meaning to get more active, or you're just looking for a cool place to escape the heat, AquaFit Studio has something for you: 50% off your first month, plus a free welcome gear bag when you sign up this week.

Here's what you get from day one:

✅ Unlimited access to our heated indoor pool
✅ Group fitness classes every day (including evenings)
✅ A beginner-friendly environment — no intimidation, no judgment

We designed AquaFit specifically for people who've felt left out of traditional gyms. You don't need to be a strong swimmer or an athlete. You just need to show up.

Ready to get started? Use code SUMMER50 at checkout.

[Claim Your Spot →]

To your best summer yet,
The AquaFit Team

P.S. This offer expires July 31. Don't leave a gear bag on the table. 🎒`,
  },
  'Social Post': {
    title: 'Instagram Carousel — Week 2',
    meta: '5 slides · Hook + value + CTA',
    content: `Slide 1 (Hook):
🌊 Beat the heat AND get fit this summer.
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
+ FREE welcome gear bag.
That's a $85 value — yours free.

Slide 5 (CTA):
Don't let another summer go by.
Link in bio → Claim your spot.
Offer ends July 31. 🏊‍♀️`,
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

---

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
};

export function ExampleOutputsSection() {
  const [activeTab, setActiveTab] = useState<Tab>('Email');

  return (
    <section className="py-20 lg:py-28 bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Example Outputs</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            See what gets generated
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Real examples from a campaign for a fitness studio. Your output will be tailored to your business.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Output card */}
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div>
                <p className="text-sm font-semibold text-white">{outputs[activeTab].title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{outputs[activeTab].meta}</p>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                  <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                </svg>
                Copy
              </button>
            </div>
            {/* Content */}
            <div className="px-6 py-5">
              <pre className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                {outputs[activeTab].content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
