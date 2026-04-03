'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

export interface CreateCampaignInput {
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

export async function createCampaignAction(
  input: CreateCampaignInput
): Promise<ActionResult> {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = createServerClient();

  const insertData = {
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
  };

  const { data, error } = await supabase
    .from('campaigns')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return { success: false, error: 'Failed to save campaign. Please try again.' };
  }

  return { success: true, campaignId: (data as { id: string }).id };
}
