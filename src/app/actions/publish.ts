'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import type { ContentPublishStateMap } from '@/lib/supabase/types';

export type PublishActionResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Saves the entire publish state map for a campaign's full content items.
 * The client computes the new state optimistically and calls this to persist.
 */
export async function saveContentPublishStateAction(
  campaignId: string,
  stateMap: ContentPublishStateMap
): Promise<PublishActionResult> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = createServerClient();

  // Verify ownership
  const { data: existing } = await supabase
    .from('campaigns')
    .select('id')
    .eq('id', campaignId)
    .eq('clerk_user_id', userId)
    .single();

  if (!existing) return { success: false, error: 'Campaign not found.' };

  const { error } = await supabase
    .from('campaigns')
    .update({ content_publish_state_json: stateMap })
    .eq('id', campaignId)
    .eq('clerk_user_id', userId);

  if (error) {
    console.error('Publish state save error:', error);
    return { success: false, error: 'Failed to save publish state.' };
  }

  return { success: true };
}
