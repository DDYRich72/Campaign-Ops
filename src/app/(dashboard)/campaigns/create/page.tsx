import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { CreateCampaignClient } from '@/components/campaigns/CreateCampaignClient';
import { industryPresets, campaignTemplates } from '@/data/presets';
import type { BusinessProfileRow } from '@/lib/supabase/types';
import type { CampaignFormValues } from '@/components/campaigns/CampaignForm';

export const metadata = { title: 'Create Campaign — Campaign Operator' };

export default async function CreateCampaignPage({
  searchParams,
}: {
  searchParams: { preset?: string; template?: string };
}) {
  const { userId } = await auth();

  let profile: BusinessProfileRow | null = null;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('clerk_user_id', userId!)
      .single();
    profile = (data as BusinessProfileRow) ?? null;
  } catch {
    // Profile not found — form starts with preset/template or blank
  }

  const profileDefaults: Partial<CampaignFormValues> = profile
    ? {
        businessName: profile.business_name ?? '',
        industry: profile.industry ?? '',
        targetAudience: profile.target_audience ?? '',
        geographicMarket: profile.geographic_market ?? '',
        brandVoice: profile.default_brand_voice ?? '',
        primaryCTA: profile.primary_cta ?? '',
        audiencePainPoints: profile.audience_pain_points ?? '',
        uniqueSellingPoints: profile.unique_selling_points ?? '',
      }
    : {};

  // If a preset or template was requested via query param, resolve it
  // and pass as the initial tab + selected item to the client component
  const initialPresetId = searchParams.preset ?? null;
  const initialTemplateId = searchParams.template ?? null;

  // Validate they exist in our data
  const validPresetId = industryPresets.find((p) => p.id === initialPresetId)?.id ?? null;
  const validTemplateId = campaignTemplates.find((t) => t.id === initialTemplateId)?.id ?? null;

  return (
    <CreateCampaignClient
      profileDefaults={profileDefaults}
      initialPresetId={validPresetId}
      initialTemplateId={validTemplateId}
    />
  );
}
