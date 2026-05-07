'use server';

/**
 * Social Scheduling Service
 * Manages the publishing queue in scheduled_posts.
 * Actual posting is done manually by the user via the Publishing Queue UI.
 */

import { createServerClient } from '@/lib/supabase/server';

/**
 * Schedule campaign content into the scheduled_posts queue
 */
export async function scheduleCampaignPosts({
  clerkUserId,
  campaignId,
  content,
  schedule,
}: {
  clerkUserId: string;
  campaignId: string;
  content: Array<{
    day: number;
    platform: string;
    caption: string;
    hashtags: string[];
    image_url?: string;
  }>;
  schedule: {
    frequency: 'immediate' | 'daily' | 'weekly' | 'smart';
    postsPerDay: number;
    bestTimes: Array<{ hour: number; minute: number }>;
    timezone: string;
    platformAccountIds: string[];
  };
}) {
  const supabase = createServerClient();

  const currentDate = new Date();

  const rows = content.map((item, index) => {
    // Calculate scheduled time based on frequency
    let scheduledAt: Date;
    const { frequency, postsPerDay, bestTimes } = schedule;

    switch (frequency) {
      case 'immediate':
        scheduledAt = new Date(currentDate.getTime() + index * 60000);
        break;
      case 'weekly': {
        const weekOffset = Math.floor(index / (postsPerDay * 7));
        const dayOfWeek = Math.floor((index % (postsPerDay * 7)) / postsPerDay);
        const slot = bestTimes[index % bestTimes.length];
        scheduledAt = new Date(currentDate);
        scheduledAt.setDate(scheduledAt.getDate() + weekOffset * 7 + dayOfWeek);
        scheduledAt.setHours(slot.hour, slot.minute, 0, 0);
        break;
      }
      case 'smart': {
        const smartSlots = [{ hour: 9, minute: 0 }, { hour: 12, minute: 0 }, { hour: 15, minute: 0 }, { hour: 18, minute: 0 }];
        scheduledAt = new Date(currentDate);
        scheduledAt.setDate(scheduledAt.getDate() + Math.floor(index / 4));
        scheduledAt.setHours(smartSlots[index % 4].hour, smartSlots[index % 4].minute, 0, 0);
        break;
      }
      case 'daily':
      default: {
        const slot = bestTimes[index % bestTimes.length];
        scheduledAt = new Date(currentDate);
        scheduledAt.setDate(scheduledAt.getDate() + Math.floor(index / postsPerDay));
        scheduledAt.setHours(slot.hour, slot.minute, 0, 0);
        break;
      }
    }

    const hashtags = item.hashtags?.map((h: string) => `#${h}`).join(' ') ?? '';
    const contentText = `${item.caption}\n\n${hashtags}`.trim();

    return {
      clerk_user_id: clerkUserId,
      campaign_id: campaignId,
      content_item_id: `day_${item.day}`,
      platform_account_id: null,
      content_text: contentText,
      media_urls: item.image_url ? [item.image_url] : [],
      scheduled_at: scheduledAt.toISOString(),
      status: 'pending',
    };
  });

  const { data: inserted, error } = await supabase
    .from('scheduled_posts')
    .insert(rows)
    .select();

  if (error) throw error;
  return inserted;
}
