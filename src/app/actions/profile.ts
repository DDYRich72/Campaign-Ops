'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import type { BusinessProfileRow } from '@/lib/supabase/types';

export interface BusinessProfileInput {
  businessName: string;
  industry: string;
  targetAudience: string;
  geographicMarket: string;
  website: string;
  brandVoice: string;
  primaryCTA: string;
  audiencePainPoints: string;
  uniqueSellingPoints: string;
}

export type ProfileResult =
  | { success: true }
  | { success: false; error: string };

export async function getBusinessProfileAction(): Promise<BusinessProfileRow | null> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = createServerClient();
  const { data } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  return (data as BusinessProfileRow) ?? null;
}

export async function upsertBusinessProfileAction(
  input: BusinessProfileInput
): Promise<ProfileResult> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = createServerClient();

  const upsertData = {
    clerk_user_id: userId,
    business_name: input.businessName || null,
    industry: input.industry || null,
    target_audience: input.targetAudience || null,
    geographic_market: input.geographicMarket || null,
    website: input.website || null,
    default_brand_voice: input.brandVoice || null,
    primary_cta: input.primaryCTA || null,
    audience_pain_points: input.audiencePainPoints || null,
    unique_selling_points: input.uniqueSellingPoints || null,
  };

  const { error } = await supabase
    .from('business_profiles')
    .upsert(upsertData, { onConflict: 'clerk_user_id' });

  if (error) {
    console.error('Profile upsert error:', error);
    return { success: false, error: 'Failed to save profile. Please try again.' };
  }

  return { success: true };
}
