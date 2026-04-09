import { Card } from '@/components/ui/Card';
import { GenerateFullContentButton } from '@/components/campaigns/GenerateFullContentButton';
import { FunnelAssetsButton } from '@/components/campaigns/FunnelAssetsButton';
import { FullContentSection } from '@/components/campaigns/FullContentSection';
import { OutlineSection } from '@/components/campaigns/OutlineSection';
import { LandingPageSection } from '@/components/campaigns/LandingPageSection';
import { EmailSequenceSection } from '@/components/campaigns/EmailSequenceSection';
import type {
  CampaignStrategy,
  ContentPillar,
  OutlineItem,
  FullContentItem,
  LandingPageCopy,
  EmailItem,
  GenerationStatus,
  ContentPublishStateMap,
} from '@/lib/supabase/types';

// ── Strategy Summary ──────────────────────────────────────────────────────────

function StrategySection({ strategy }: { strategy: CampaignStrategy }) {
  const rows: { label: string; value: string }[] = [
    { label: 'Campaign Objective', value: strategy.campaign_objective },
    { label: 'Target Audience', value: strategy.target_audience_summary },
    { label: 'Offer Positioning', value: strategy.offer_positioning },
    { label: 'Messaging Angle', value: strategy.messaging_angle },
    { label: 'CTA Strategy', value: strategy.cta_strategy },
  ];

  return (
    <Card>
      <h2 className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">
        Campaign Strategy
      </h2>
      <dl className="divide-y divide-border-subtle">
        {rows.map(({ label, value }) => (
          <div key={label} className="py-3 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-slate-400">{label}</dt>
            <dd className="text-sm text-slate-200 col-span-2 leading-relaxed">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

// ── Content Pillars ───────────────────────────────────────────────────────────

const PILLAR_ACCENTS = [
  { bg: 'bg-violet-500/10 border-violet-500/25', title: 'text-violet-400', body: 'text-slate-300', sub: 'text-slate-500' },
  { bg: 'bg-cyan-500/10 border-cyan-500/25',     title: 'text-cyan-400',   body: 'text-slate-300', sub: 'text-slate-500' },
  { bg: 'bg-emerald-500/10 border-emerald-500/25', title: 'text-emerald-400', body: 'text-slate-300', sub: 'text-slate-500' },
  { bg: 'bg-amber-500/10 border-amber-500/25',   title: 'text-amber-400',  body: 'text-slate-300', sub: 'text-slate-500' },
  { bg: 'bg-rose-500/10 border-rose-500/25',     title: 'text-rose-400',   body: 'text-slate-300', sub: 'text-slate-500' },
  { bg: 'bg-indigo-500/10 border-indigo-500/25', title: 'text-indigo-400', body: 'text-slate-300', sub: 'text-slate-500' },
];

function PillarsSection({ pillars }: { pillars: ContentPillar[] }) {
  return (
    <Card>
      <h2 className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">
        Content Pillars
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pillars.map((pillar, i) => {
          const accent = PILLAR_ACCENTS[i % PILLAR_ACCENTS.length];
          return (
            <div key={pillar.name} className={`rounded-lg border p-4 ${accent.bg}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${accent.title}`}>
                {pillar.name}
              </p>
              <p className={`text-sm leading-relaxed mb-2 ${accent.body}`}>
                {pillar.description}
              </p>
              <p className={`text-xs italic ${accent.sub}`}>{pillar.purpose}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Empty / Error states ──────────────────────────────────────────────────────

function NotGeneratedState() {
  return (
    <div className="rounded-xl border-2 border-dashed border-border-subtle px-6 py-12 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15">
        <svg className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-200">Ready to generate your campaign</p>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
        Click <strong className="text-slate-300">Generate Campaign</strong> above to build your strategy, content pillars, and full 30-day outline in seconds.
      </p>
    </div>
  );
}

function ErrorState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-6 py-8 text-center">
      <p className="text-sm font-medium text-red-400">Generation failed</p>
      <p className="mt-1 text-xs text-red-500/80">
        Click &ldquo;{label}&rdquo; above to try again.
      </p>
    </div>
  );
}

function FullContentNotGeneratedState() {
  return (
    <div className="rounded-xl border-2 border-dashed border-border-subtle px-6 py-12 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15">
        <svg className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-200">Full content not written yet</p>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
        Click <strong className="text-slate-300">Generate Full Content</strong> above to write ready-to-publish captions, hooks, hashtags, and visual prompts for all 30 days.
      </p>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ── Public component ──────────────────────────────────────────────────────────

interface GeneratedContentProps {
  campaignId: string;
  campaignName: string;
  generationStatus: GenerationStatus;
  strategy: CampaignStrategy | null;
  pillars: ContentPillar[] | null;
  outline: OutlineItem[] | null;
  generatedAt: string | null;
  fullContent: FullContentItem[] | null;
  contentGenerationStatus: GenerationStatus;
  contentGeneratedAt: string | null;
  publishState: ContentPublishStateMap;
  landingPage: LandingPageCopy | null;
  emailSequence: EmailItem[] | null;
  funnelGenerationStatus: GenerationStatus;
  funnelGeneratedAt: string | null;
  isFree?: boolean;
}

export function GeneratedContent({
  campaignId,
  campaignName,
  generationStatus,
  strategy,
  pillars,
  outline,
  generatedAt,
  fullContent,
  contentGenerationStatus,
  contentGeneratedAt,
  publishState,
  landingPage,
  emailSequence,
  funnelGenerationStatus,
  funnelGeneratedAt,
  isFree = false,
}: GeneratedContentProps) {
  const outlineDone = generationStatus === 'done' && strategy && pillars && outline;
  const contentDone = contentGenerationStatus === 'done' && fullContent;
  const funnelDone  = funnelGenerationStatus === 'done' && landingPage && emailSequence;

  return (
    <div className="space-y-6">
      {/* ── Phase 4: Strategy / Pillars / Outline ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-200">
          AI-Generated Campaign
        </h2>
        {outlineDone && generatedAt && (
          <p className="text-xs text-slate-500">
            Generated {formatDate(generatedAt)}
          </p>
        )}
      </div>

      {generationStatus === 'idle' && <NotGeneratedState />}
      {generationStatus === 'error' && <ErrorState label="Generate Campaign" />}

      {outlineDone && (
        <>
          <StrategySection strategy={strategy} />
          <PillarsSection pillars={pillars} />
          <OutlineSection outline={outline} />
        </>
      )}

      {/* ── Phase 5: Full Content ── */}
      {outlineDone && (
        <>
          <hr className="border-border-subtle" />
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-200">Full Content</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete captions, hashtags, and visual prompts for all 30 days.
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1">
                <GenerateFullContentButton campaignId={campaignId} hasContent={!!contentDone} />
                {contentDone && contentGeneratedAt && (
                  <p className="text-xs text-slate-500">Generated {formatDate(contentGeneratedAt)}</p>
                )}
              </div>
            </div>

            {contentGenerationStatus === 'idle' && <FullContentNotGeneratedState />}
            {contentGenerationStatus === 'error' && <ErrorState label="Generate Full Content" />}
            {contentDone && (
              <FullContentSection
                items={fullContent}
                campaignName={campaignName}
                campaignId={campaignId}
                initialPublishState={publishState}
                isFree={isFree}
              />
            )}
          </div>
        </>
      )}

      {/* ── Phase 8: Funnel Assets ── */}
      {outlineDone && (
        <>
          <hr className="border-border-subtle" />
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-200">Funnel Assets</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Landing page copy and 5-email follow-up sequence.
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1">
                <FunnelAssetsButton campaignId={campaignId} hasContent={!!funnelDone} />
                {funnelDone && funnelGeneratedAt && (
                  <p className="text-xs text-slate-500">Generated {formatDate(funnelGeneratedAt)}</p>
                )}
              </div>
            </div>

            {funnelGenerationStatus === 'idle' && (
              <div className="rounded-xl border-2 border-dashed border-border-subtle px-6 py-12 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15">
                  <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-200">Funnel assets not generated yet</p>
                <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
                  Click <strong className="text-slate-300">Generate Funnel Assets</strong> above to create a full landing page and a 5-email follow-up sequence ready to deploy.
                </p>
              </div>
            )}

            {funnelGenerationStatus === 'error' && <ErrorState label="Generate Funnel Assets" />}

            {funnelDone && (
              <div className="space-y-6">
                <LandingPageSection lp={landingPage} isFree={isFree} />
                <EmailSequenceSection emails={emailSequence} isFree={isFree} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
