import Link from 'next/link';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { CampaignRow } from '@/components/dashboard/CampaignRow';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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

  let campaigns: Campaign[] = [];
  let rawRows: CampaignRowType[] = [];
  let profile: BusinessProfileRow | null = null;
  let dbError = false;

  try {
    const supabase = createServerClient();
    const [campaignsRes, profileRes] = await Promise.all([
      supabase.from('campaigns').select('*').eq('clerk_user_id', userId!).order('updated_at', { ascending: false }),
      supabase.from('business_profiles').select('*').eq('clerk_user_id', userId!).single(),
    ]);
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
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="animate-in flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-widest mb-1">Mission Control</p>
          <h1 className="text-3xl font-bold font-display text-gradient leading-tight">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your campaigns today.
          </p>
        </div>
        <Link href="/campaigns/create" className="flex-shrink-0">
          <Button size="md">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Campaign
          </Button>
        </Link>
      </div>

      {/* DB error banner */}
      {dbError && (
        <div className="rounded-lg bg-amber-500/8 border border-amber-500/25 px-4 py-3 flex items-center gap-2 text-sm text-amber-400">
          <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Could not load campaigns from the database. Check your Supabase environment variables.
        </div>
      )}

      {!dbError && <OnboardingChecklist profile={profile} campaigns={rawRows} />}

      {/* Stat cards */}
      <div className="animate-in delay-1 grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-surface-card rounded-xl border border-border-subtle card-accent-violet p-5 shadow-card">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Total</p>
          <p className="mt-3 text-4xl font-bold font-display text-violet-400" style={{ textShadow: '0 0 30px rgba(168,85,247,0.5)' }}>
            {campaigns.length}
          </p>
          <p className="mt-2 text-xs text-slate-600">campaigns created</p>
        </div>

        {/* Active */}
        <div className="bg-surface-card rounded-xl border border-border-subtle card-accent-emerald p-5 shadow-card">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Active</p>
          <p className="mt-3 text-4xl font-bold font-display text-emerald-400" style={{ textShadow: '0 0 30px rgba(16,185,129,0.5)' }}>
            {activeCampaigns.length}
          </p>
          <p className="mt-2 text-xs text-slate-600">currently running</p>
        </div>

        {/* Ready */}
        <div className="bg-surface-card rounded-xl border border-border-subtle card-accent-cyan p-5 shadow-card">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Ready</p>
          <p className="mt-3 text-4xl font-bold font-display text-cyan-400" style={{ textShadow: '0 0 30px rgba(34,211,238,0.5)' }}>
            {readyCampaigns.length}
          </p>
          <p className="mt-2 text-xs text-slate-600">fully generated</p>
        </div>

        {/* Drafts */}
        <div className="bg-surface-card rounded-xl border border-border-subtle card-accent-amber p-5 shadow-card">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Drafts</p>
          <p className="mt-3 text-4xl font-bold font-display text-amber-400" style={{ textShadow: '0 0 30px rgba(245,158,11,0.5)' }}>
            {draftCampaigns.length}
          </p>
          <p className="mt-2 text-xs text-slate-600">in progress</p>
        </div>
      </div>

      <div className="animate-in delay-2 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent campaigns table */}
        <div className="xl:col-span-2">
          <Card padding="none">
            <div className="px-6 pt-5 pb-3 flex items-center justify-between">
              <CardTitle>Recent Campaigns</CardTitle>
              <Link href="/campaigns" className="text-[11px] font-semibold text-cyan-500 hover:text-cyan-300 transition-colors tracking-wide uppercase">
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
                    <tr className="border-t border-border-subtle">
                      <th className="py-2.5 pl-6 pr-3 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Campaign</th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-widest hidden sm:table-cell">Status</th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-widest hidden md:table-cell">Channels</th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-widest hidden lg:table-cell">Assets</th>
                      <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-widest hidden lg:table-cell">Updated</th>
                      <th className="py-2.5 pl-3 pr-6" />
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
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {campaignsWithPendingItems.length > 0 && (
            <Card accent="cyan">
              <CardHeader>
                <CardTitle>Ready to Post</CardTitle>
                <Badge variant="info" dot>{campaignsWithPendingItems.length}</Badge>
              </CardHeader>
              <div className="space-y-2">
                {campaignsWithPendingItems.map((row) => {
                  const stateMap = row.content_publish_state_json ?? {};
                  const readyCount = Object.values(stateMap).filter((s) => s.status === 'ready').length;
                  const scheduledCount = Object.values(stateMap).filter((s) => s.status === 'scheduled').length;
                  return (
                    <Link key={row.id} href={`/campaigns/${row.id}`} className="flex items-center justify-between rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-3 hover:bg-cyan-500/10 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-200 truncate">{row.name}</p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {readyCount > 0 && `${readyCount} ready`}
                          {readyCount > 0 && scheduledCount > 0 && ' · '}
                          {scheduledCount > 0 && `${scheduledCount} scheduled`}
                        </p>
                      </div>
                      <span className="ml-3 text-xs font-semibold text-cyan-500 flex-shrink-0">View →</span>
                    </Link>
                  );
                })}
              </div>
            </Card>
          )}

          {activeCampaigns.length > 0 && (
            <Card accent="emerald">
              <CardHeader>
                <CardTitle>Active Now</CardTitle>
                <Badge variant="success" dot>{activeCampaigns.length} running</Badge>
              </CardHeader>
              <div className="space-y-2">
                {activeCampaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="flex items-start gap-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 p-3 hover:bg-emerald-500/10 transition-colors">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-glow-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-200 truncate">{campaign.name}</p>
                      <p className="text-xs text-slate-600">{campaign.assetCount} assets</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {readyCampaigns.length > 0 && (
            <Card accent="violet">
              <CardHeader>
                <CardTitle>Ready to Launch</CardTitle>
                <Badge variant="info" dot>{readyCampaigns.length}</Badge>
              </CardHeader>
              <div className="space-y-2">
                {readyCampaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="flex items-center justify-between rounded-lg border border-violet-500/15 bg-violet-500/5 p-3 hover:bg-violet-500/10 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-200 truncate">{campaign.name}</p>
                      <p className="text-xs text-slate-600">{campaign.businessName}</p>
                    </div>
                    <span className="ml-3 text-xs font-semibold text-violet-400 flex-shrink-0">Launch →</span>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {draftCampaigns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Drafts</CardTitle>
                <Badge variant="default">{draftCampaigns.length}</Badge>
              </CardHeader>
              <div className="space-y-2">
                {draftCampaigns.map((campaign) => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="flex items-center justify-between rounded-lg border border-dashed border-border-DEFAULT p-3 hover:bg-surface-raised transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-300 truncate">{campaign.name}</p>
                      <p className="text-xs text-slate-600">{campaign.businessName}</p>
                    </div>
                    <span className="ml-3 text-xs font-semibold text-violet-400 flex-shrink-0">Edit →</span>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {campaigns.length === 0 && !dbError && (
            <Card accent="violet">
              <CardTitle>Quick Start</CardTitle>
              <p className="mt-2 text-sm text-slate-500">
                Create your first campaign to see activity here.
              </p>
              <div className="mt-4">
                <Link href="/campaigns/create">
                  <Button variant="secondary" size="sm" className="w-full">Create Campaign</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Create CTA banner */}
      <div className="animate-in delay-3 relative rounded-xl overflow-hidden border border-violet-500/20">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-violet-500/10 to-cyan-600/15" />
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        {/* Content */}
        <div className="relative px-6 py-8 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold text-violet-400/70 uppercase tracking-widest mb-1">AI-Powered</p>
            <h3 className="text-xl font-bold text-slate-100 font-display">Ready to launch your next campaign?</h3>
            <p className="mt-1.5 text-sm text-slate-400">
              Turn one offer into a full 30-day marketing campaign in minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
            <Link href="/campaigns/create">
              <Button size="lg">Create Campaign</Button>
            </Link>
            <Link
              href="/campaigns/create?template=lead-generation"
              className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap"
            >
              Use a template →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
