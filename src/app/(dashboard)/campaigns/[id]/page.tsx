import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { getPlanKey } from '@/lib/subscription';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GenerateButton } from '@/components/campaigns/GenerateButton';
import { GeneratedContent } from '@/components/campaigns/GeneratedContent';
import { CampaignExportSection } from '@/components/campaigns/CampaignExportSection';
import { ReadinessChecklist } from '@/components/campaigns/ReadinessChecklist';
import { CampaignStatusActions } from '@/components/campaigns/CampaignStatusActions';
import { DeleteCampaignButton } from '@/components/campaigns/DeleteCampaignButton';
import type { CampaignRow, CampaignStatusDB } from '@/lib/supabase/types';

const statusConfig: Record<
  CampaignStatusDB,
  { label: string; variant: 'success' | 'warning' | 'default' | 'info' }
> = {
  draft: { label: 'Draft', variant: 'default' },
  ready: { label: 'Ready', variant: 'info' },
  active: { label: 'Active', variant: 'success' },
  archived: { label: 'Archived', variant: 'warning' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="py-3 grid grid-cols-3 gap-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-300 col-span-2 whitespace-pre-wrap">
        {value}
      </dd>
    </div>
  );
}

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  const supabase = createServerClient();

  const [{ data }, planKey] = await Promise.all([
    supabase
      .from('campaigns')
      .select('*')
      .eq('id', params.id)
      .eq('clerk_user_id', userId!)
      .single(),
    getPlanKey(userId!),
  ]);

  if (!data) notFound();
  const campaign = data as CampaignRow;
  const isFree = planKey === null;

  const { label, variant } = statusConfig[campaign.status];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        {/* Back + badge row */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <Link
            href="/campaigns"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Campaigns
          </Link>
          <Badge variant={variant}>{label}</Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-100 leading-tight">
              {campaign.name}
            </h1>
            {campaign.business_name && (
              <p className="mt-1 text-sm text-slate-500">
                {campaign.business_name}
              </p>
            )}
          </div>

          {/* Actions — stack on mobile, row on sm+ */}
          <div className="flex flex-col gap-2 sm:items-end flex-shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/campaigns/${campaign.id}/edit`}>
                <Button variant="secondary" size="md">
                  Edit
                </Button>
              </Link>
              <GenerateButton campaignId={campaign.id} />
            </div>
            <CampaignStatusActions
              campaignId={campaign.id}
              currentStatus={campaign.status}
            />
          </div>
        </div>
      </div>

      {/* Section: Campaign Identity */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Campaign Identity
        </h2>
        <dl className="divide-y divide-border-subtle">
          <DetailRow label="Campaign Name" value={campaign.name} />
          <DetailRow label="Business Name" value={campaign.business_name} />
          <DetailRow label="Industry" value={campaign.industry} />
        </dl>
      </Card>

      {/* Section: Audience & Market */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Audience & Market
        </h2>
        <dl className="divide-y divide-border-subtle">
          <DetailRow label="Target Audience" value={campaign.target_audience} />
          <DetailRow
            label="Geographic Market"
            value={campaign.geographic_market}
          />
          <DetailRow
            label="Pain Points"
            value={campaign.audience_pain_points}
          />
        </dl>
      </Card>

      {/* Section: Offer & Goals */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Offer & Goals
        </h2>
        <dl className="divide-y divide-border-subtle">
          <DetailRow label="Offer" value={campaign.offer} />
          <DetailRow label="Campaign Goal" value={campaign.goal} />
          <DetailRow label="Primary CTA" value={campaign.primary_cta} />
        </dl>
      </Card>

      {/* Section: Content & Voice */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Content & Voice
        </h2>
        <dl className="divide-y divide-border-subtle">
          <DetailRow label="Brand Voice" value={campaign.brand_voice} />
          <DetailRow
            label="Unique Selling Points"
            value={campaign.unique_selling_points}
          />
          <div className="py-3 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-slate-500">Channels</dt>
            <dd className="col-span-2">
              {campaign.channels && campaign.channels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {campaign.channels.map((ch) => (
                    <span
                      key={ch}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 capitalize"
                    >
                      {ch.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-slate-400 italic">
                  None selected
                </span>
              )}
            </dd>
          </div>
        </dl>
      </Card>

      <hr className="border-slate-200" />

      {/* AI-Generated sections (Phase 4 + Phase 5) */}
      <GeneratedContent
        campaignId={campaign.id}
        campaignName={campaign.name}
        generationStatus={campaign.generation_status ?? 'idle'}
        strategy={campaign.strategy_json ?? null}
        pillars={campaign.content_pillars_json ?? null}
        outline={campaign.campaign_outline_json ?? null}
        generatedAt={campaign.generated_at ?? null}
        fullContent={campaign.full_content_json ?? null}
        contentGenerationStatus={campaign.content_generation_status ?? 'idle'}
        contentGeneratedAt={campaign.content_generated_at ?? null}
        publishState={campaign.content_publish_state_json ?? {}}
        landingPage={campaign.landing_page_json ?? null}
        emailSequence={campaign.email_sequence_json ?? null}
        funnelGenerationStatus={campaign.funnel_generation_status ?? 'idle'}
        funnelGeneratedAt={campaign.funnel_generated_at ?? null}
        isFree={isFree}
      />

      {/* Readiness checklist */}
      <ReadinessChecklist campaign={campaign} />

      {/* Export & Copy */}
      <CampaignExportSection
        isFree={isFree}
        campaign={{
          name: campaign.name,
          business_name: campaign.business_name,
          industry: campaign.industry,
          target_audience: campaign.target_audience,
          geographic_market: campaign.geographic_market,
          offer: campaign.offer,
          goal: campaign.goal,
          primary_cta: campaign.primary_cta,
          brand_voice: campaign.brand_voice,
          channels: campaign.channels ?? [],
          created_at: campaign.created_at,
          strategy_json: campaign.strategy_json ?? null,
          content_pillars_json: campaign.content_pillars_json ?? null,
          campaign_outline_json: campaign.campaign_outline_json ?? null,
          full_content_json: campaign.full_content_json ?? null,
          landing_page_json: campaign.landing_page_json ?? null,
          email_sequence_json: campaign.email_sequence_json ?? null,
        }}
      />

      {/* Meta + delete */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-slate-400">
          <span>Created {formatDate(campaign.created_at)}</span>
          <span className="mx-2">·</span>
          <span>Updated {formatDate(campaign.updated_at)}</span>
        </div>
        <DeleteCampaignButton campaignId={campaign.id} campaignName={campaign.name} />
      </div>
    </div>
  );
}
