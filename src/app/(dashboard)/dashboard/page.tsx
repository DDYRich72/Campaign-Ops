import Link from 'next/link';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { getPlanKey } from '@/lib/subscription';
import { CampaignRow } from '@/components/dashboard/CampaignRow';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { CampaignRow as CampaignRowType, BusinessProfileRow } from '@/lib/supabase/types';
import type { Campaign } from '@/data/mock';

function toUICampaign(row: CampaignRowType): Campaign {
  return {
    id: row.id,
    name: row.name,
    businessName: row.business_name ?? '',
    industry: row.industry ?? '',
    targetAudience: row.target_audience ?? '',
    geographicMarket: row.geographic_market ?? '',
    offer: row.offer ?? '',
    goal: row.goal ?? '',
    channels: (row.channels ?? []) as Campaign['channels'],
    brandVoice: row.brand_voice ?? '',
    primaryCTA: row.primary_cta ?? '',
    audiencePainPoints: row.audience_pain_points ?? '',
    uniqueSellingPoints: row.unique_selling_points ?? '',
    status: row.status as Campaign['status'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assetCount: row.asset_count,
    daysRemaining: row.days_remaining,
  };
}

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const firstName = user?.firstName ?? 'there';

  const hour = new Date().getUTCHours();
  const greeting =
    hour >= 5 && hour < 12 ? 'Good morning' :
    hour >= 12 && hour < 17 ? 'Good afternoon' :
    'Good evening';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  let campaigns: Campaign[] = [];
  let rawRows: CampaignRowType[] = [];
  let profile: BusinessProfileRow | null = null;
  let dbError = false;
  let planKey: string | null = null;

  try {
    const supabase = createServerClient();
    const [campaignsRes, profileRes, fetchedPlanKey] = await Promise.all([
      supabase.from('campaigns').select('*').eq('clerk_user_id', userId!).order('updated_at', { ascending: false }),
      supabase.from('business_profiles').select('*').eq('clerk_user_id', userId!).single(),
      getPlanKey(userId!),
    ]);
    planKey = fetchedPlanKey;
    if (campaignsRes.error) throw campaignsRes.error;
    rawRows = (campaignsRes.data ?? []) as CampaignRowType[];
    campaigns = rawRows.map(toUICampaign);
    profile = (profileRes.data as BusinessProfileRow) ?? null;
  } catch {
    dbError = true;
  }

  const activeCampaigns  = campaigns.filter((c) => c.status === 'active');
  const readyCampaigns   = campaigns.filter((c) => c.status === 'ready');
  const draftCampaigns   = campaigns.filter((c) => c.status === 'draft');

  const campaignsWithPendingItems = rawRows.filter((row) => {
    if (!row.content_publish_state_json) return false;
    return Object.values(row.content_publish_state_json).some(
      (s) => s.status === 'ready' || s.status === 'scheduled'
    );
  });

  return (
    <div className="space-y-14">
      {/* Editorial masthead */}
      <header className="animate-in">
        <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-10">
          <p className="editorial-eyebrow">The daily brief</p>
          <p className="editorial-eyebrow hidden sm:block">{today}</p>
          <p className="editorial-eyebrow">No. {String(campaigns.length).padStart(3, '0')}</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-[44px] sm:text-[58px] leading-[1.0] text-ink tracking-[-0.02em]">
              {greeting},
              <br />
              <span className="display-italic">{firstName}</span>.
            </h1>
            <p className="mt-6 text-[15px] text-ink-soft leading-relaxed">
              A quiet survey of your campaigns and what awaits your attention.
            </p>
          </div>
          <Link href="/campaigns/create" className="flex-shrink-0">
            <Button size="md">Begin a new campaign</Button>
          </Link>
        </div>
      </header>

      {/* DB error notice */}
      {dbError && (
        <div className="border border-oxblood bg-oxblood-tint px-5 py-4 flex items-baseline gap-3 text-[13px] text-oxblood">
          <span className="editorial-eyebrow text-oxblood">Notice</span>
          <span className="text-ink">
            Could not load campaigns from the database. Check your Supabase environment variables.
          </span>
        </div>
      )}

      {/* Free-tier upgrade card — quiet, editorial */}
      {!planKey && !dbError && (
        <div className="animate-in delay-1 border border-ink bg-card px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="editorial-eyebrow mb-2">A note on your subscription</p>
            <p className="font-display text-[18px] text-ink tracking-tight">
              You&rsquo;re on the <span className="display-italic">complimentary</span> plan.
            </p>
            <p className="text-[13px] text-ink-soft mt-2 leading-relaxed max-w-xl">
              Limited to one campaign, two strategy generations, and one full content draft. Upgrade to unlock the full press.
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 inline-flex h-10 items-center bg-ink px-5 text-[13px] text-paper hover:bg-black transition-colors rounded-[3px]"
          >
            Upgrade plan →
          </Link>
        </div>
      )}

      {!dbError && (
        <div className="animate-in delay-1">
          <OnboardingChecklist profile={profile} campaigns={rawRows} />
        </div>
      )}

      {/* Stat row — editorial display numerals on rule grid */}
      <section className="animate-in delay-2">
        <div className="flex items-baseline justify-between border-b border-ink pb-2 mb-0">
          <p className="editorial-eyebrow">By the numbers</p>
          <p className="editorial-eyebrow hidden sm:block">A summary of works in progress</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-rule border-b border-rule">
          {[
            { label: 'Total',   value: campaigns.length,         note: 'campaigns drafted' },
            { label: 'Active',  value: activeCampaigns.length,   note: 'currently running' },
            { label: 'Ready',   value: readyCampaigns.length,    note: 'awaiting launch' },
            { label: 'Drafts',  value: draftCampaigns.length,    note: 'in progress' },
          ].map((stat, i) => (
            <div key={stat.label} className={`px-7 py-9 ${i % 2 === 1 ? 'border-l border-rule lg:border-l-0' : ''} ${i >= 2 ? 'lg:border-l-0' : ''}`}>
              <p className="editorial-eyebrow">{stat.label}</p>
              <p className="stat-numeral mt-5 text-[64px] text-ink">{stat.value}</p>
              <p className="mt-3 text-[12px] text-ink-faint italic">{stat.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="animate-in delay-3 grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Recent campaigns */}
        <div className="xl:col-span-2">
          <div className="flex items-baseline justify-between border-b border-ink pb-3 mb-0">
            <p className="editorial-eyebrow">Recent campaigns</p>
            <Link href="/campaigns" className="text-[12px] text-ink-soft hover:text-ink transition-colors">
              View all →
            </Link>
          </div>

          {campaigns.length === 0 && !dbError ? (
            <div className="pt-8">
              <EmptyState
                title="No campaigns yet"
                description="Begin your first campaign to see it appear here."
                action={
                  <Link href="/campaigns/create">
                    <Button size="md">Begin a campaign</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sr-only">
                  <tr>
                    <th>Campaign</th>
                    <th>Status</th>
                    <th>Channels</th>
                    <th>Assets</th>
                    <th>Updated</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {campaigns.slice(0, 5).map((campaign) => (
                    <CampaignRow key={campaign.id} campaign={campaign} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column — quiet attention list */}
        <aside className="space-y-10">
          {campaignsWithPendingItems.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between border-b border-ink pb-3 mb-0">
                <p className="editorial-eyebrow">Awaiting publication</p>
                <p className="text-[11px] text-ink-faint tabular-nums">{campaignsWithPendingItems.length}</p>
              </div>
              <div className="divide-y divide-rule">
                {campaignsWithPendingItems.map((row) => {
                  const stateMap = row.content_publish_state_json ?? {};
                  const readyCount = Object.values(stateMap).filter((s) => s.status === 'ready').length;
                  const scheduledCount = Object.values(stateMap).filter((s) => s.status === 'scheduled').length;
                  return (
                    <Link key={row.id} href={`/campaigns/${row.id}`} className="flex items-baseline justify-between py-4 hover:bg-paper transition-colors">
                      <div className="min-w-0 flex-1 pr-3">
                        <p className="font-display text-[15px] text-ink truncate tracking-tight">{row.name}</p>
                        <p className="text-[11px] text-ink-faint mt-1 italic">
                          {readyCount > 0 && `${readyCount} ready`}
                          {readyCount > 0 && scheduledCount > 0 && ' · '}
                          {scheduledCount > 0 && `${scheduledCount} scheduled`}
                        </p>
                      </div>
                      <span className="text-[12px] text-ink-soft flex-shrink-0">→</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {activeCampaigns.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between border-b border-ink pb-3 mb-0">
                <p className="editorial-eyebrow">Active</p>
                <p className="text-[11px] text-ink-faint tabular-nums">{activeCampaigns.length}</p>
              </div>
              <div className="divide-y divide-rule">
                {activeCampaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="flex items-baseline justify-between py-4 hover:bg-paper transition-colors">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-display text-[15px] text-ink truncate tracking-tight">{campaign.name}</p>
                      <p className="text-[11px] text-ink-faint mt-1 tabular-nums">{campaign.assetCount} assets</p>
                    </div>
                    <span className="text-[12px] text-ink-soft flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {readyCampaigns.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between border-b border-ink pb-3 mb-0">
                <p className="editorial-eyebrow">Ready to launch</p>
                <p className="text-[11px] text-ink-faint tabular-nums">{readyCampaigns.length}</p>
              </div>
              <div className="divide-y divide-rule">
                {readyCampaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="flex items-baseline justify-between py-4 hover:bg-paper transition-colors">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-display text-[15px] text-ink truncate tracking-tight">{campaign.name}</p>
                      <p className="text-[11px] text-ink-faint mt-1 italic truncate">{campaign.businessName}</p>
                    </div>
                    <span className="text-[12px] text-ink-soft flex-shrink-0">Launch →</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {draftCampaigns.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between border-b border-rule pb-3 mb-0">
                <p className="editorial-eyebrow">Drafts</p>
                <p className="text-[11px] text-ink-faint tabular-nums">{draftCampaigns.length}</p>
              </div>
              <div className="divide-y divide-rule">
                {draftCampaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="flex items-baseline justify-between py-4 hover:bg-paper transition-colors">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-display text-[15px] text-ink truncate tracking-tight">{campaign.name}</p>
                      <p className="text-[11px] text-ink-faint mt-1 italic truncate">{campaign.businessName}</p>
                    </div>
                    <span className="text-[12px] text-ink-soft flex-shrink-0">Edit →</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {campaigns.length === 0 && !dbError && (
            <Card>
              <CardTitle>Quick start</CardTitle>
              <p className="mt-3 text-[13px] text-ink-soft leading-relaxed">
                Begin your first campaign to populate this column.
              </p>
              <div className="mt-6">
                <Link href="/campaigns/create">
                  <Button variant="secondary" size="sm" className="w-full">Begin a campaign</Button>
                </Link>
              </div>
            </Card>
          )}
        </aside>
      </div>

      {/* Closing call to action — editorial colophon style */}
      <section className="animate-in delay-4 border-y border-ink py-16 px-6 sm:px-12 text-center">
        <p className="ornament-asterism" />
        <h3 className="font-display text-[28px] sm:text-[36px] text-ink leading-tight tracking-[-0.02em] max-w-xl mx-auto">
          Ready to <span className="display-italic">draft</span> your next campaign?
        </h3>
        <p className="mt-5 text-[14px] text-ink-soft max-w-md mx-auto leading-relaxed">
          One offer. Thirty days of marketing. Drafted before lunch.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/campaigns/create">
            <Button size="lg">Begin a campaign</Button>
          </Link>
          <Link
            href="/campaigns/create?template=lead-generation"
            className="text-[13px] text-ink-soft hover:text-ink transition-colors underline underline-offset-[5px] decoration-rule hover:decoration-ink"
          >
            Start from a template →
          </Link>
        </div>
      </section>
    </div>
  );
}
