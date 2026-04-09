'use client';

import { useState, useCallback } from 'react';
import { StarterPicker } from '@/components/campaigns/StarterPicker';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { industryPresets, campaignTemplates } from '@/data/presets';
import type { CampaignFormValues } from '@/components/campaigns/CampaignForm';

interface CreateCampaignClientProps {
  profileDefaults: Partial<CampaignFormValues>;
  initialPresetId?: string | null;
  initialTemplateId?: string | null;
}

function resolveInitialOverrides(
  presetId: string | null | undefined,
  templateId: string | null | undefined
): Partial<CampaignFormValues> {
  if (presetId) {
    const preset = industryPresets.find((p) => p.id === presetId);
    if (preset) {
      return {
        industry: preset.industry,
        targetAudience: preset.targetAudience,
        audiencePainPoints: preset.audiencePainPoints,
        uniqueSellingPoints: preset.uniqueSellingPoints,
        brandVoice: preset.brandVoice,
        primaryCTA: preset.primaryCTA,
        channels: preset.channels,
      };
    }
  }
  if (templateId) {
    const template = campaignTemplates.find((t) => t.id === templateId);
    if (template) {
      return {
        goal: template.goal,
        primaryCTA: template.primaryCTA,
        brandVoice: template.brandVoice,
        channels: template.channels,
        offer: template.offer,
      };
    }
  }
  return {};
}

export function CreateCampaignClient({
  profileDefaults,
  initialPresetId,
  initialTemplateId,
}: CreateCampaignClientProps) {
  const [appliedOverrides, setAppliedOverrides] = useState<Partial<CampaignFormValues>>(
    () => resolveInitialOverrides(initialPresetId, initialTemplateId)
  );
  // Bumps when a preset/template is applied so the form re-mounts with fresh state
  const [formKey, setFormKey] = useState(0);

  const handlePickerApply = useCallback((overrides: Partial<CampaignFormValues>) => {
    setAppliedOverrides(overrides);
    setFormKey((k) => k + 1);
  }, []);

  // Merge order: profile defaults → preset/template overrides
  // Preset/template wins on overlapping fields (intentional — user chose it)
  const mergedInitialValues: Partial<CampaignFormValues> = {
    ...profileDefaults,
    ...appliedOverrides,
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create Campaign</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Fill in the details below and AI will build a complete 30-day campaign strategy, content calendar, captions, and more.
        </p>
      </div>

      {/* Starter picker — sits above the form */}
      <StarterPicker
        onApply={handlePickerApply}
        initialPresetId={initialPresetId ?? null}
        initialTemplateId={initialTemplateId ?? null}
      />

      {/* Campaign form — key forces remount when preset/template is applied */}
      <CampaignForm
        key={formKey}
        mode="create"
        initialValues={mergedInitialValues}
        hideHeader
      />
    </div>
  );
}
