'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import {
  industryOptions,
  goalOptions,
  brandVoiceOptions,
  channelOptions,
  Channel,
} from '@/data/mock';
import { createCampaignAction, updateCampaignAction, CampaignFormInput } from '@/app/actions/campaigns';

export interface CampaignFormValues {
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
  channels: Channel[];
  uniqueSellingPoints: string;
}

export const emptyCampaignValues: CampaignFormValues = {
  campaignName: '',
  businessName: '',
  industry: '',
  targetAudience: '',
  geographicMarket: '',
  audiencePainPoints: '',
  offer: '',
  goal: '',
  primaryCTA: '',
  brandVoice: '',
  channels: [],
  uniqueSellingPoints: '',
};

interface CampaignFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<CampaignFormValues>;
  campaignId?: string;
  hideHeader?: boolean;
}

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-sm font-bold border border-violet-500/25">
        {number}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export function CampaignForm({ mode, initialValues = {}, campaignId, hideHeader = false }: CampaignFormProps) {
  const [form, setForm] = useState<CampaignFormValues>({
    ...emptyCampaignValues,
    ...initialValues,
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(field: keyof CampaignFormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleChannel(channel: Channel) {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  }

  function handleSubmit() {
    if (!form.campaignName.trim()) {
      setError('Campaign name is required.');
      return;
    }
    setError(null);

    const input: CampaignFormInput = { ...form };

    startTransition(async () => {
      const result =
        mode === 'edit' && campaignId
          ? await updateCampaignAction(campaignId, input)
          : await createCampaignAction(input);

      if (result.success) {
        router.push(`/campaigns/${result.campaignId}`);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header — hidden when rendered inside CreateCampaignClient */}
      {!hideHeader && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100">
            {mode === 'edit' ? 'Edit Campaign' : 'Create Campaign'}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {mode === 'edit'
              ? 'Update your campaign details below.'
              : 'Fill in the details below and AI will build a complete 30-day campaign strategy, content calendar, captions, and more.'}
          </p>
        </div>
      )}

      <div className="bg-surface-card rounded-xl border border-border-subtle shadow-card overflow-hidden">
        {/* Info banner */}
        <div className="bg-violet-500/10 border-b border-violet-500/20 px-6 py-3 flex items-center gap-2">
          <svg className="h-4 w-4 text-violet-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-violet-300 font-medium">
            {mode === 'edit'
              ? 'Update any fields and save. Status will remain as draft until AI generation runs.'
              : 'Complete all fields for the best results. The more detail you provide, the better your campaign output.'}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* ── Section 1: Campaign Identity ── */}
          <div className="space-y-5">
            <SectionHeading
              number="1"
              title="Campaign Identity"
              description="Name your campaign and tell us about the business behind it."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  label="Campaign Name"
                  placeholder="e.g. Summer Membership Drive 2025"
                  value={form.campaignName}
                  onChange={(e) => handleChange('campaignName', e.target.value)}
                  required
                />
              </div>
              <Input
                label="Business Name"
                placeholder="e.g. AquaFit Studio"
                value={form.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
              />
              <Select
                label="Industry"
                options={industryOptions.map((o) => ({ value: o, label: o }))}
                placeholder="Select industry..."
                value={form.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* ── Section 2: Audience & Market ── */}
          <div className="space-y-5">
            <SectionHeading
              number="2"
              title="Audience & Market"
              description="Describe who you're targeting and where they are."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  label="Target Audience"
                  placeholder="e.g. Adults 25–45 interested in fitness and wellness"
                  value={form.targetAudience}
                  onChange={(e) => handleChange('targetAudience', e.target.value)}
                />
              </div>
              <Input
                label="Geographic Market"
                placeholder="e.g. Austin, TX or National (US)"
                value={form.geographicMarket}
                onChange={(e) => handleChange('geographicMarket', e.target.value)}
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Audience Pain Points"
                  placeholder="What problems, frustrations, or challenges does your audience face?"
                  value={form.audiencePainPoints}
                  onChange={(e) => handleChange('audiencePainPoints', e.target.value)}
                  rows={3}
                  hint="Think about what keeps your ideal customer up at night."
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Section 3: Offer & Goals ── */}
          <div className="space-y-5">
            <SectionHeading
              number="3"
              title="Offer & Goals"
              description="What are you promoting and what do you want to achieve?"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Textarea
                  label="Your Offer"
                  placeholder="Describe your product, service, or promotion in detail."
                  value={form.offer}
                  onChange={(e) => handleChange('offer', e.target.value)}
                  rows={3}
                  hint="Include pricing, discounts, bonuses, or any time-limited elements."
                />
              </div>
              <Select
                label="Campaign Goal"
                options={goalOptions.map((o) => ({ value: o, label: o }))}
                placeholder="Select a goal..."
                value={form.goal}
                onChange={(e) => handleChange('goal', e.target.value)}
              />
              <Input
                label="Primary Call-to-Action"
                placeholder="e.g. Start Free Trial, Book Now, Claim Offer"
                value={form.primaryCTA}
                onChange={(e) => handleChange('primaryCTA', e.target.value)}
                hint="The main action you want people to take."
              />
            </div>
          </div>

          <Separator />

          {/* ── Section 4: Content & Voice ── */}
          <div className="space-y-5">
            <SectionHeading
              number="4"
              title="Content & Voice"
              description="Define how your brand sounds and where you want to show up."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Brand Voice"
                options={brandVoiceOptions.map((o) => ({ value: o, label: o }))}
                placeholder="Select brand voice..."
                value={form.brandVoice}
                onChange={(e) => handleChange('brandVoice', e.target.value)}
              />

              {/* Channels */}
              <div className="md:col-span-2">
                <Label>Preferred Channels</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-1">
                  {channelOptions.map((channel) => {
                    const isSelected = form.channels.includes(channel.value);
                    return (
                      <button
                        key={channel.value}
                        type="button"
                        onClick={() => toggleChannel(channel.value)}
                        className={cn(
                          'flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors text-left',
                          isSelected
                            ? 'border-violet-500/60 bg-violet-500/10 text-violet-300'
                            : 'border-border-subtle bg-surface-raised text-slate-400 hover:border-border hover:text-slate-300'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors',
                            isSelected ? 'bg-violet-600 border-violet-600' : 'border-border'
                          )}
                        >
                          {isSelected && (
                            <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="currentColor">
                              <path d="M8.707 2.293a1 1 0 00-1.414 0L4 5.586 2.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" />
                            </svg>
                          )}
                        </div>
                        {channel.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Unique Selling Points"
                  placeholder="What makes your business or offer stand out?"
                  value={form.uniqueSellingPoints}
                  onChange={(e) => handleChange('uniqueSellingPoints', e.target.value)}
                  rows={3}
                  hint="Think about what competitors can't easily copy."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 bg-surface-card border-t border-border-subtle px-6 sm:px-8 py-4">
          {error && (
            <p className="mb-3 text-sm text-red-400 flex items-center gap-1.5">
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Saved as a draft when you click{' '}
              {mode === 'edit' ? 'Save Changes' : 'Save Draft'}.
            </p>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={handleSubmit}
                loading={isPending}
                disabled={isPending}
              >
                {mode === 'edit' ? 'Save Changes' : 'Save Draft'}
              </Button>
              <div title="AI generation is coming soon — this feature is currently in development.">
                <Button variant="primary" size="md" disabled className="gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Generate Campaign
                  <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">Soon</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
