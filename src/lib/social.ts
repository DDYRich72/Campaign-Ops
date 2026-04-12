'use server';

/**
 * Social Media Posting Service
 * Handles Buffer API integration and scheduled posting
 */

import { createServerClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/encryption';

const BUFFER_API_URL = 'https://api.bufferapp.com/1';

interface BufferProfile {
  id: string;
  service: string;
  service_username: string;
  formatted_username: string;
  avatar_https: string;
}

interface CreatePostResponse {
  success: boolean;
  updates?: Array<{
    id: string;
    created_at: number;
    service_update_id?: string;
  }>;
  error?: string;
}

/**
 * Get Buffer profiles for authenticated user
 */
export async function getBufferProfiles(accessToken: string): Promise<BufferProfile[]> {
  const res = await fetch(`${BUFFER_API_URL}/profiles.json?access_token=${accessToken}`);
  if (!res.ok) throw new Error('Failed to fetch Buffer profiles');
  return res.json();
}

/**
 * Create a post via Buffer API
 */
export async function createBufferPost({
  accessToken,
  profileIds,
  text,
  mediaUrls = [],
  scheduledAt,
}: {
  accessToken: string;
  profileIds: string[];
  text: string;
  mediaUrls?: string[];
  scheduledAt?: Date;
}): Promise<CreatePostResponse> {
  const formData = new URLSearchParams();
  formData.append('access_token', accessToken);
  profileIds.forEach(id => formData.append('profile_ids[]', id));
  formData.append('text', text);
  
  // Add media if provided (Buffer expects media[photo] or media[video])
  if (mediaUrls.length > 0) {
    // Primary image
    formData.append('media[photo]', mediaUrls[0]);
    // Additional images (Buffer supports up to 4)
    mediaUrls.slice(1, 4).forEach((url, i) => {
      formData.append(`media[photo][${i + 1}]`, url);
    });
  }
  
  // Schedule or post now
  if (scheduledAt) {
    formData.append('scheduled_at', scheduledAt.toISOString());
  } else {
    formData.append('now', 'true');
  }
  
  const res = await fetch(`${BUFFER_API_URL}/updates/create.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    return { success: false, error: data.message || 'Failed to create post' };
  }
  
  return { success: true, updates: data.updates };
}

/**
 * Exchange Buffer code for access token
 */
export async function exchangeBufferCode(code: string): Promise<{ access_token: string }> {
  const clientId = process.env.BUFFER_CLIENT_ID;
  const clientSecret = process.env.BUFFER_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/buffer/callback`;
  
  const res = await fetch(`${BUFFER_API_URL}/oauth/token.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri,
      code,
      grant_type: 'authorization_code',
    }),
  });
  
  if (!res.ok) throw new Error('Failed to exchange Buffer code');
  return res.json();
}

/**
 * Schedule campaign content for social posting
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
    visual_prompt?: string;
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
  
  // Get social accounts
  const { data: accounts } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .in('id', schedule.platformAccountIds);
  
  if (!accounts?.length) throw new Error('No social accounts found');
  
  // Calculate posting times based on frequency
  const posts: Array<{
    content_text: string;
    scheduled_at: Date;
    platform_account_id: string;
    content_item_id: string;
  }> = [];
  
  let currentDate = new Date();
  const timeZoneOffset = getTimezoneOffset(schedule.timezone);
  
  content.forEach((item, index) => {
    // Find matching account for platform
    const account = accounts.find(a => {
      const platformMap: Record<string, string> = {
        'Twitter/X': 'twitter',
        'LinkedIn': 'linkedin',
        'Facebook': 'facebook',
        'Instagram': 'instagram',
        'TikTok': 'tiktok',
      };
      return a.platform === (platformMap[item.platform] || item.platform.toLowerCase());
    });
    
    if (!account) return;
    
    // Calculate scheduled time
    let scheduledAt: Date;
    
    switch (schedule.frequency) {
      case 'immediate':
        scheduledAt = new Date(currentDate.getTime() + index * 60000); // 1 min apart
        break;
      case 'daily':
        const dayOffset = Math.floor(index / schedule.postsPerDay);
        const timeSlot = schedule.bestTimes[index % schedule.bestTimes.length];
        scheduledAt = new Date(currentDate);
        scheduledAt.setDate(scheduledAt.getDate() + dayOffset);
        scheduledAt.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
        break;
      case 'weekly':
        const weekOffset = Math.floor(index / (schedule.postsPerDay * 7));
        const dayOfWeek = Math.floor((index % (schedule.postsPerDay * 7)) / schedule.postsPerDay);
        const weeklyTimeSlot = schedule.bestTimes[index % schedule.bestTimes.length];
        scheduledAt = new Date(currentDate);
        scheduledAt.setDate(scheduledAt.getDate() + (weekOffset * 7) + dayOfWeek);
        scheduledAt.setHours(weeklyTimeSlot.hour, weeklyTimeSlot.minute, 0, 0);
        break;
      case 'smart':
        // AI-optimized times (9am, 12pm, 3pm, 6pm based on engagement)
        const smartSlots = [
          { hour: 9, minute: 0 },
          { hour: 12, minute: 0 },
          { hour: 15, minute: 0 },
          { hour: 18, minute: 0 },
        ];
        const smartDayOffset = Math.floor(index / 4);
        const smartTimeSlot = smartSlots[index % 4];
        scheduledAt = new Date(currentDate);
        scheduledAt.setDate(scheduledAt.getDate() + smartDayOffset);
        scheduledAt.setHours(smartTimeSlot.hour, smartTimeSlot.minute, 0, 0);
        break;
      default:
        scheduledAt = new Date(currentDate.getTime() + index * 3600000); // 1 hour apart
    }
    
    // Format content with hashtags
    const hashtags = item.hashtags?.map((h: string) => `#${h}`).join(' ') || '';
    const contentText = `${item.caption}\n\n${hashtags}`.trim();
    
    posts.push({
      content_text: contentText,
      scheduled_at: scheduledAt,
      platform_account_id: account.id,
      content_item_id: `day_${item.day}`,
    });
  });
  
  // Insert scheduled posts (with image URLs if available)
  const { data: inserted, error } = await supabase
    .from('scheduled_posts')
    .insert(
      content.map((item, index) => {
        const post = posts[index];
        if (!post) return null;
        return {
          clerk_user_id: clerkUserId,
          campaign_id: campaignId,
          content_item_id: post.content_item_id,
          platform_account_id: post.platform_account_id,
          content_text: post.content_text,
          media_urls: item.image_url ? [item.image_url] : [],
          scheduled_at: post.scheduled_at.toISOString(),
          status: 'pending',
        };
      }).filter(Boolean)
    )
    .select();
  
  if (error) throw error;
  return inserted;
}

/**
 * Process pending scheduled posts
 * Called by cron job
 */
export async function processScheduledPosts() {
  const supabase = createServerClient();
  
  // Get posts that are due
  const { data: pendingPosts } = await supabase
    .from('scheduled_posts')
    .select(`
      *,
      social_accounts!inner(*)
    `)
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())
    .limit(50);
  
  if (!pendingPosts?.length) return { processed: 0 };
  
  const results = await Promise.allSettled(
    pendingPosts.map(async (post) => {
      try {
        const account = post.social_accounts;
        
        if (!account.buffer_token) {
          throw new Error('No access token for account');
        }
        
        // Decrypt token and create post
        const decryptedToken = decrypt(account.buffer_token);
        
        const result = await createBufferPost({
          accessToken: decryptedToken,
          profileIds: [account.buffer_account_id!],
          text: post.content_text,
          mediaUrls: post.media_urls || [],
        });
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to post');
        }
        
        // Update as posted
        await supabase
          .from('scheduled_posts')
          .update({
            status: 'posted',
            posted_at: new Date().toISOString(),
            buffer_post_id: result.updates?.[0]?.id,
          })
          .eq('id', post.id);
        
        return { success: true, postId: post.id };
      } catch (err) {
        // Mark as failed
        await supabase
          .from('scheduled_posts')
          .update({
            status: 'failed',
            error_message: err instanceof Error ? err.message : 'Unknown error',
          })
          .eq('id', post.id);
        
        return { success: false, postId: post.id, error: err };
      }
    })
  );
  
  const succeeded = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.filter(r => r.status === 'rejected' || !r.value?.success).length;
  
  return { processed: pendingPosts.length, succeeded, failed };
}

function getTimezoneOffset(timezone: string): number {
  // Simple timezone offset map for common zones
  const offsets: Record<string, number> = {
    'America/New_York': -5,
    'America/Chicago': -6,
    'America/Denver': -7,
    'America/Los_Angeles': -8,
    'Europe/London': 0,
    'Europe/Paris': 1,
    'Asia/Tokyo': 9,
    'Australia/Sydney': 11,
  };
  return offsets[timezone] || 0;
}
