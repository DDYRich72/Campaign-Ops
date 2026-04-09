import { Card } from '@/components/ui/Card';

export const metadata = { title: 'Help & FAQ — Campaign Operator' };

const FAQ: { q: string; a: string }[] = [
  {
    q: 'What does Campaign Operator actually do?',
    a: 'Campaign Operator uses AI to build a complete 30-day marketing campaign for your business. You provide your offer, audience, and goals — it generates a strategy, content pillars, a full 30-day posting outline, ready-to-publish captions with hashtags and visual prompts, a landing page, and a 5-email follow-up sequence.',
  },
  {
    q: 'How do I generate my campaign?',
    a: 'Create a campaign, fill in your business details, then click "Generate Campaign" on the campaign detail page. This produces your strategy, content pillars, and 30-day outline. From there you can generate full content (captions, hooks, hashtags) and funnel assets (landing page + email sequence) separately.',
  },
  {
    q: 'What is the difference between the outline and full content?',
    a: 'The 30-day outline gives you the structure — topic, platform, content type, hook idea, and CTA — for each day. Full content takes each outline item and writes the complete ready-to-publish caption, hashtags, visual prompt, and more. Think of the outline as the plan and full content as the execution.',
  },
  {
    q: 'How many campaigns can I create?',
    a: 'It depends on your plan. Free accounts get 1 campaign. Starter ($29/mo) gets 3 campaigns, Growth ($79/mo) gets 15, and Agency ($199/mo) gets 100. You can check your current usage and limits on the Billing page.',
  },
  {
    q: 'What do free accounts get access to?',
    a: 'Free accounts can create one campaign and generate the full strategy, content pillars, and 30-day outline. Full content is previewed for the first 3 days only. Funnel assets (landing page and email sequence) show preview sections only. Exports and bulk copy tools require a paid plan.',
  },
  {
    q: 'Can I edit the AI-generated content?',
    a: 'You can copy any individual piece of content and paste it into your own editor or scheduling tool. Full in-app editing of generated text is not currently supported — the content is designed to be ready-to-use or require minimal tweaking.',
  },
  {
    q: 'What channels does Campaign Operator support?',
    a: 'You can specify any channel when creating a campaign — including Instagram, Facebook, LinkedIn, X (Twitter), TikTok, YouTube, email, SMS, paid ads, and SEO. The AI tailors the content type and tone to each channel you select.',
  },
  {
    q: 'How do I publish or schedule content?',
    a: 'Inside the Full Content section of your campaign, each day has a publish workflow. You can mark items as Draft, Ready, Scheduled (with a specific date/time), or Published. This is an internal tracker — Campaign Operator does not connect to social platforms directly.',
  },
  {
    q: 'What are funnel assets?',
    a: 'Funnel assets include a full landing page copy block (headline, subheadline, benefit bullets, problem/solution/offer sections, objection handling, closing CTA) and a 5-email follow-up sequence (Welcome, Problem Agitation, Solution Reveal, Objection Handling, Urgency Close).',
  },
  {
    q: 'Can I regenerate my campaign if I am not happy with it?',
    a: 'Yes. Each generation type (strategy/outline, full content, funnel assets) can be regenerated independently. Each regeneration counts against your plan\'s generation limits.',
  },
  {
    q: 'What export formats are available?',
    a: 'Paid plans can export campaigns as CSV (content calendar format), Markdown (readable document), or JSON (structured data for developers). You can also copy the full campaign to your clipboard. Free accounts do not have export access.',
  },
  {
    q: 'How do I cancel or change my plan?',
    a: 'Go to the Billing page from the sidebar. From there you can manage your subscription, upgrade, downgrade, or cancel. Billing is handled securely via Stripe.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your campaigns, business profile, and generated content are private to your account. We do not share your data with other users or use it to train AI models.',
  },
  {
    q: 'Something is broken or I have a question not listed here.',
    a: 'Email us at support@campaignoperator.com. Include your account email and a description of the issue and we will get back to you as quickly as possible.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="py-5 border-b border-border-subtle last:border-0">
      <p className="text-sm font-semibold text-slate-200 mb-2">{q}</p>
      <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Help & FAQ</h1>
        <p className="mt-1 text-sm text-slate-500">
          Common questions about Campaign Operator.
        </p>
      </div>

      <Card>
        <h2 className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-2">
          Frequently Asked Questions
        </h2>
        <div>
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">
          Still need help?
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Email us at{' '}
          <a
            href="mailto:support@campaignoperator.com"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            support@campaignoperator.com
          </a>{' '}
          and we will get back to you as quickly as possible.
        </p>
      </Card>
    </div>
  );
}
