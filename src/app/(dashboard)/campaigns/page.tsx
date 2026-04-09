import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CampaignTable } from '@/components/campaigns/CampaignTable';
import { QuickStartRow } from '@/components/campaigns/QuickStartRow';
import type { CampaignRow } from '@/lib/supabase/types';

export const metadata = { title: 'Campaigns — Campaign Operator' };

export default async function CampaignsPage() {
  const { userId } = await auth();

  let campaigns: CampaignRow[] = [];
  let dbError = false;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('clerk_user_id', userId!)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    campaigns = (data ?? []) as CampaignRow[];
  } catch {
    dbError = true;
  }

  const activeCount = campaigns.filter((c) => c.status === 'active').length;
  const readyCount = campaigns.filter((c) => c.status === 'ready').length;
  const draftCount = campaigns.filter((c) => c.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 font-display">Campaigns</h1>
          <p className="mt-1 text-sm text-slate-500">
            {dbError
              ? 'Could not load campaigns'
              : `${campaigns.length} total · ${activeCount} active · ${readyCount} ready · ${draftCount} draft`}
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

      {dbError && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm text-amber-400">
          Could not load campaigns. Check your Supabase environment variables.
        </div>
      )}

      {/* Quick start row — always visible */}
      {!dbError && <QuickStartRow />}

      {campaigns.length === 0 && !dbError ? (
        <EmptyState
          icon={
            <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          }
          title="No campaigns yet"
          description="Create your first campaign to get started. Fill in your offer and goals and save it as a draft."
          action={
            <Link href="/campaigns/create">
              <Button size="sm">Create Your First Campaign</Button>
            </Link>
          }
        />
      ) : (
        !dbError && <CampaignTable campaigns={campaigns} />
      )}
    </div>
  );
}
