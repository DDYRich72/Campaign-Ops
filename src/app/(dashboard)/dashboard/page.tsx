import Link from 'next/link';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { mockStats, mockAssets } from '@/data/mock';
import { StatCard } from '@/components/dashboard/StatCard';
import { CampaignRow } from '@/components/dashboard/CampaignRow';
import { AssetCard } from '@/components/dashboard/AssetCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { CampaignRow as CampaignRowType } from '@/lib/supabase/types';
import type { Campaign } from '@/data/mock';

// Map a Supabase campaign row to the shape our UI components expect
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
    status: row.status,
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

  // Load campaigns from Supabase, scoped to the current user
  let campaigns: Campaign[] = [];
  let dbError = false;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('clerk_user_id', userId!)
      .order('created_at', { ascending: false });

    if (error) throw error;
    campaigns = ((data ?? []) as CampaignRowType[]).map(toUICampaign);
  } catch {
    dbError = true;
  }

  const activeCampaigns = campaigns.filter((c) => c.status === 'active');
  const draftCampaigns = campaigns.filter((c) => c.status === 'draft');
  const recentAssets = mockAssets.slice(0, 4); // Still mock — assets are phase 3

  // Build live stat cards on top of the mock structure
  const stats = mockStats.map((s) => {
    if (s.id === 'stat-001') return { ...s, value: String(campaigns.length) };
    return s;
  });

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good morning, {firstName}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your campaigns today.
          </p>
        </div>
        <Link href="/campaigns/create">
          <Button size="md">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Campaign
          </Button>
        </Link>
      </div>

      {/* DB error banner */}
      {dbError && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-2 text-sm text-amber-800">
          <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Could not load campaigns from the database. Check your Supabase environment variables.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent campaigns */}
        <div className="xl:col-span-2">
          <Card padding="none">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <CardTitle>Recent Campaigns</CardTitle>
              <Link href="/campaigns" className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors">
                View all →
              </Link>
            </div>

            {campaigns.length === 0 && !dbError ? (
              <div className="px-6 pb-6">
                <EmptyState
                  icon={
                    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  }
                  title="No campaigns yet"
                  description="Create your first campaign to get started."
                  action={
                    <Link href="/campaigns/create">
                      <Button size="sm">Create Campaign</Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-t border-slate-100">
                      <th className="py-2.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Campaign</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Channels</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Assets</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Created</th>
                      <th className="py-2.5 pl-3 pr-6" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {campaigns.slice(0, 5).map((campaign) => (
                      <CampaignRow key={campaign.id} campaign={campaign} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Active campaigns */}
          {activeCampaigns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Now</CardTitle>
                <Badge variant="success">{activeCampaigns.length} running</Badge>
              </CardHeader>
              <div className="space-y-3">
                {activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{campaign.name}</p>
                      <p className="text-xs text-slate-500">
                        {campaign.daysRemaining != null ? `${campaign.daysRemaining} days remaining · ` : ''}{campaign.assetCount} assets
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Drafts */}
          {draftCampaigns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Drafts</CardTitle>
                <Badge variant="default">{draftCampaigns.length}</Badge>
              </CardHeader>
              <div className="space-y-2">
                {draftCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700 truncate">{campaign.name}</p>
                      <p className="text-xs text-slate-500">{campaign.businessName}</p>
                    </div>
                    <Link href="/campaigns/create" className="ml-3 text-xs font-medium text-violet-600 hover:text-violet-800 flex-shrink-0">
                      Edit →
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Placeholder when no campaigns yet */}
          {campaigns.length === 0 && !dbError && (
            <Card>
              <CardTitle>Quick Start</CardTitle>
              <p className="mt-2 text-sm text-slate-500">
                Create your first campaign to see activity here.
              </p>
              <div className="mt-4">
                <Link href="/campaigns/create">
                  <Button variant="secondary" size="sm" className="w-full">
                    Create Campaign
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Recent assets — still mock until phase 3 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Recent Assets</h2>
          <Link href="/assets" className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>

      {/* Create CTA */}
      <div className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Ready to launch your next campaign?</h3>
            <p className="mt-1 text-sm text-violet-200">
              Describe your offer and let AI build a complete 30-day marketing plan.
            </p>
          </div>
          <Link href="/campaigns/create" className="flex-shrink-0">
            <Button variant="secondary" size="lg">
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
