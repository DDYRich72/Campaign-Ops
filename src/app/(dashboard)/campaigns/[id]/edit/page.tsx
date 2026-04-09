import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { CampaignForm, CampaignFormValues } from '@/components/campaigns/CampaignForm';
import type { Channel } from '@/data/mock';
import type { CampaignRow } from '@/lib/supabase/types';

export const metadata = { title: 'Edit Campaign — Campaign Operator' };

export default async function EditCampaignPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  const supabase = createServerClient();

  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', params.id)
    .eq('clerk_user_id', userId!)
    .single();

  if (!data) notFound();
  const campaign = data as CampaignRow;

  const initialValues: Partial<CampaignFormValues> = {
    campaignName: campaign.name ?? '',
    businessName: campaign.business_name ?? '',
    industry: campaign.industry ?? '',
    targetAudience: campaign.target_audience ?? '',
    geographicMarket: campaign.geographic_market ?? '',
    offer: campaign.offer ?? '',
    goal: campaign.goal ?? '',
    primaryCTA: campaign.primary_cta ?? '',
    brandVoice: campaign.brand_voice ?? '',
    audiencePainPoints: campaign.audience_pain_points ?? '',
    uniqueSellingPoints: campaign.unique_selling_points ?? '',
    channels: (campaign.channels ?? []) as Channel[],
  };

  return (
    <CampaignForm
      mode="edit"
      initialValues={initialValues}
      campaignId={campaign.id}
    />
  );
}
