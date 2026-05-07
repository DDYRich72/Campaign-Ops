import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { scheduleCampaignPosts } from '@/lib/social';
import { NextResponse } from 'next/server';

/**
 * GET /api/campaigns/[id]/schedule
 * Returns the posting schedule and scheduled posts for a campaign
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();

  const [scheduleRes, postsRes] = await Promise.all([
    supabase
      .from('posting_schedules')
      .select('*')
      .eq('campaign_id', params.id)
      .eq('clerk_user_id', userId)
      .eq('is_active', true)
      .single(),
    supabase
      .from('scheduled_posts')
      .select(`*, social_accounts(platform, account_name)`)
      .eq('campaign_id', params.id)
      .eq('clerk_user_id', userId)
      .order('scheduled_at', { ascending: true }),
  ]);

  return NextResponse.json({
    schedule: scheduleRes.data ?? null,
    posts: postsRes.data ?? [],
  });
}

/**
 * POST /api/campaigns/[id]/schedule
 * Creates or replaces the posting schedule for a campaign
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { frequency, postsPerDay, bestTimes, timezone, platformAccountIds } = body;

  if (!platformAccountIds?.length) {
    return NextResponse.json({ error: 'Select at least one social account' }, { status: 400 });
  }

  const supabase = createServerClient();

  // Load full content for this campaign
  const { data: campaignData } = await supabase
    .from('campaigns')
    .select('full_content_json')
    .eq('id', params.id)
    .eq('clerk_user_id', userId)
    .single();

  if (!campaignData?.full_content_json?.length) {
    return NextResponse.json({ error: 'Generate full content first' }, { status: 400 });
  }

  // Deactivate any existing schedule
  await supabase
    .from('posting_schedules')
    .update({ is_active: false })
    .eq('campaign_id', params.id)
    .eq('clerk_user_id', userId);

  // Create new schedule record
  const { error: scheduleError } = await supabase
    .from('posting_schedules')
    .insert({
      clerk_user_id: userId,
      campaign_id: params.id,
      frequency,
      posts_per_day: postsPerDay,
      best_times: bestTimes,
      timezone,
      platforms_enabled: platformAccountIds,
      is_active: true,
    });

  if (scheduleError) {
    return NextResponse.json({ error: 'Failed to save schedule' }, { status: 500 });
  }

  // Schedule the actual posts
  try {
    const inserted = await scheduleCampaignPosts({
      clerkUserId: userId,
      campaignId: params.id,
      content: campaignData.full_content_json,
      schedule: { frequency, postsPerDay, bestTimes, timezone, platformAccountIds },
    });

    return NextResponse.json({ success: true, postsScheduled: inserted?.length ?? 0 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to schedule posts' },
      { status: 500 }
    );
  }
}
