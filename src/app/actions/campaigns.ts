'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { checkLimit, incrementUsage } from '@/lib/subscription';
import type { CampaignStatusDB } from '@/lib/supabase/types';

export interface CampaignFormInput {
  campaignName: string;
  businessName: string;
  industry: string;
  targetAudience: string;
  geographicMarket: string;
  audiencePainPoints: string;
  offer: string;
  goal: string;
  primaryCTA: string;
  brandVoice: string;
  channels: string[];
  uniqueSellingPoints: string;
}

export type ActionResult =
  | { success: true; campaignId: string }
  | { success: false; error: string };

export type StatusActionResult =
  | { success: true }
  | { success: false; error: string };

// Valid transitions: which statuses can a current status move to?
const ALLOWED_TRANSITIONS: Record<CampaignStatusDB, CampaignStatusDB[]> = {
  draft: ['ready'],
  ready: ['active', 'draft'],
  active: ['archived'],
  archived: ['ready', 'draft'],
};

export async function updateCampaignStatusAction(
  campaignId: string,
  newStatus: CampaignStatusDB
): Promise<StatusActionResult> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = createServerClient();

  const { data: existing } = await supabase
    .from('campaigns')
    .select('status')
    .eq('id', campaignId)
    .eq('clerk_user_id', userId)
    .single();

  if (!existing) return { success: false, error: 'Campaign not found.' };

  const allowed = ALLOWED_TRANSITIONS[existing.status as CampaignStatusDB] ?? [];
  if (!allowed.includes(newStatus)) {
    return { success: false, error: `Cannot move from ${existing.status} to ${newStatus}.` };
  }

  const { error } = await supabase
    .from('campaigns')
    .update({ status: newStatus })
    .eq('id', campaignId)
    .eq('clerk_user_id', userId);

  if (error) {
    console.error('Status update error:', error);
    return { success: false, error: 'Failed to update status. Please try again.' };
  }

  return { success: true };
}

// ── Create ────────────────────────────────────────────────────

export async function createCampaignAction(
  input: CampaignFormInput
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const limitCheck = await checkLimit(userId, 'campaigns');
  if (!limitCheck.allowed) {
    return {
      success: false,
      error: `Campaign limit reached (${limitCheck.used}/${limitCheck.limit}). Upgrade your plan to create more campaigns.`,
    };
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      clerk_user_id: userId,
      name: input.campaignName,
      business_name: input.businessName || null,
      industry: input.industry || null,
      target_audience: input.targetAudience || null,
      geographic_market: input.geographicMarket || null,
      audience_pain_points: input.audiencePainPoints || null,
      offer: input.offer || null,
      goal: input.goal || null,
      primary_cta: input.primaryCTA || null,
      brand_voice: input.brandVoice || null,
      channels: input.channels,
      unique_selling_points: input.uniqueSellingPoints || null,
      status: 'draft' as const,
      asset_count: 0,
      days_remaining: null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Campaign insert error:', error);
    return { success: false, error: 'Failed to save campaign. Please try again.' };
  }

  await incrementUsage(userId, 'campaigns_created');

  return { success: true, campaignId: (data as { id: string }).id };
}

// ── Delete ────────────────────────────────────────────────────

export async function deleteCampaignAction(
  campaignId: string
): Promise<StatusActionResult> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = createServerClient();

  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', campaignId)
    .eq('clerk_user_id', userId);

  if (error) {
    console.error('Campaign delete error:', error);
    return { success: false, error: 'Failed to delete campaign. Please try again.' };
  }

  return { success: true };
}

// ── Update ────────────────────────────────────────────────────

export async function updateCampaignAction(
  campaignId: string,
  input: CampaignFormInput
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = createServerClient();

  // Verify ownership before updating
  const { data: existing } = await supabase
    .from('campaigns')
    .select('id')
    .eq('id', campaignId)
    .eq('clerk_user_id', userId)
    .single();

  if (!existing) {
    return { success: false, error: 'Campaign not found.' };
  }

  const { error } = await supabase
    .from('campaigns')
    .update({
      name: input.campaignName,
      business_name: input.businessName || null,
      industry: input.industry || null,
      target_audience: input.targetAudience || null,
      geographic_market: input.geographicMarket || null,
      audience_pain_points: input.audiencePainPoints || null,
      offer: input.offer || null,
      goal: input.goal || null,
      primary_cta: input.primaryCTA || null,
      brand_voice: input.brandVoice || null,
      channels: input.channels,
      unique_selling_points: input.uniqueSellingPoints || null,
    })
    .eq('id', campaignId)
    .eq('clerk_user_id', userId);

  if (error) {
    console.error('Campaign update error:', error);
    return { success: false, error: 'Failed to update campaign. Please try again.' };
  }

  return { success: true, campaignId };
}
