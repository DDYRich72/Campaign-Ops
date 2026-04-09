'use client';

import { useState } from 'react';
import { industryPresets, campaignTemplates } from '@/data/presets';
import type { IndustryPreset, CampaignTemplate } from '@/data/presets';
import type { CampaignFormValues } from '@/components/campaigns/CampaignForm';
import type { Channel } from '@/data/mock';

type Mode = 'scratch' | 'preset' | 'template';

interface StarterPickerProps {
  onApply: (values: Partial<CampaignFormValues>) => void;
  initialPresetId?: string | null;
  initialTemplateId?: string | null;
}

// ── Preview panel ─────────────────────────────────────────────────────────────

function PresetPreview({
  preset,
  onApply,
}: {
  preset: IndustryPreset;
  onApply: () => void;
}) {
  return (
    <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-violet-300">{preset.icon} {preset.label}</p>
          <p className="text-xs text-violet-400 mt-0.5">{preset.description}</p>
        </div>
        <button
          type="button"
          onClick={onApply}
          className="flex-shrink-0 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          Use this preset
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <PreviewRow label="Suggested goal" value={preset.sampleGoal} />
        <PreviewRow label="Primary CTA" value={preset.primaryCTA} />
        <PreviewRow label="Brand voice" value={preset.brandVoice} />
        <PreviewRow label="Channels" value={preset.channels.map(formatChannel).join(', ')} />
        <div className="sm:col-span-2">
          <PreviewRow label="Content focus" value={preset.sampleContentFocus} />
        </div>
      </div>
    </div>
  );
}

function TemplatePreview({
  template,
  onApply,
}: {
  template: CampaignTemplate;
  onApply: () => void;
}) {
  return (
    <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-violet-300">{template.icon} {template.label}</p>
          <p className="text-xs text-violet-400 mt-0.5">{template.description}</p>
        </div>
        <button
          type="button"
          onClick={onApply}
          className="flex-shrink-0 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          Use this template
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <PreviewRow label="Campaign goal" value={template.goal} />
        <PreviewRow label="Primary CTA" value={template.primaryCTA} />
        <PreviewRow label="Brand voice" value={template.brandVoice} />
        <PreviewRow label="Channels" value={template.channels.map(formatChannel).join(', ')} />
        <div className="sm:col-span-2">
          <PreviewRow label="Messaging angle" value={template.sampleMessaging} />
        </div>
        <div className="sm:col-span-2">
          <PreviewRow label="Content focus" value={template.sampleContentFocus} />
        </div>
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-violet-400 uppercase tracking-wide">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{value}</p>
    </div>
  );
}

function formatChannel(ch: Channel): string {
  const map: Record<Channel, string> = {
    email: 'Email',
    social: 'Social',
    paid_ads: 'Paid Ads',
    seo: 'SEO',
    sms: 'SMS',
  };
  return map[ch] ?? ch;
}

// ── Card grid items ───────────────────────────────────────────────────────────

function PickerCard({
  icon,
  label,
  description,
  selected,
  onClick,
}: {
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border p-4 transition-all ${
        selected
          ? 'border-violet-500/60 bg-violet-500/10 ring-1 ring-violet-500/40'
          : 'border-border-subtle bg-surface-raised hover:border-border hover:bg-border-subtle'
      }`}
    >
      <span className="text-xl leading-none">{icon}</span>
      <p className={`text-sm font-semibold mt-2 ${selected ? 'text-violet-300' : 'text-slate-200'}`}>
        {label}
      </p>
      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
    </button>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-surface-card text-violet-400 shadow-sm border border-border'
          : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function StarterPicker({ onApply, initialPresetId, initialTemplateId }: StarterPickerProps) {
  const [mode, setMode] = useState<Mode>(
    initialPresetId ? 'preset' : initialTemplateId ? 'template' : 'scratch'
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(initialPresetId ?? null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(initialTemplateId ?? null);

  const selectedPreset = industryPresets.find((p) => p.id === selectedPresetId) ?? null;
  const selectedTemplate = campaignTemplates.find((t) => t.id === selectedTemplateId) ?? null;

  function applyPreset(preset: IndustryPreset) {
    onApply({
      industry: preset.industry,
      targetAudience: preset.targetAudience,
      audiencePainPoints: preset.audiencePainPoints,
      uniqueSellingPoints: preset.uniqueSellingPoints,
      brandVoice: preset.brandVoice,
      primaryCTA: preset.primaryCTA,
      channels: preset.channels,
    });
  }

  function applyTemplate(template: CampaignTemplate) {
    onApply({
      goal: template.goal,
      primaryCTA: template.primaryCTA,
      brandVoice: template.brandVoice,
      channels: template.channels,
      offer: template.offer,
    });
  }

  function handleModeSwitch(newMode: Mode) {
    setMode(newMode);
    setSelectedPresetId(null);
    setSelectedTemplateId(null);
    if (newMode === 'scratch') {
      onApply({}); // clear any applied values when switching back to scratch
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-border-subtle bg-surface-raised p-4 space-y-4">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-slate-200">How do you want to start?</p>
        <p className="text-xs text-slate-500 mt-0.5">
          Choose a starting point — all values are fully editable after applying.
        </p>
      </div>

      {/* Tab row */}
      <div className="flex gap-1.5 bg-surface-card rounded-lg p-1 w-fit border border-border-subtle">
        <Tab active={mode === 'scratch'} onClick={() => handleModeSwitch('scratch')}>
          Start from scratch
        </Tab>
        <Tab active={mode === 'preset'} onClick={() => handleModeSwitch('preset')}>
          Industry preset
        </Tab>
        <Tab active={mode === 'template'} onClick={() => handleModeSwitch('template')}>
          Campaign template
        </Tab>
      </div>

      {/* Scratch mode */}
      {mode === 'scratch' && (
        <div className="rounded-lg border border-dashed border-border px-5 py-4 text-sm text-slate-500">
          Fill in the form below with your own details. All fields start blank except where your business profile has saved defaults.
        </div>
      )}

      {/* Preset mode */}
      {mode === 'preset' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {industryPresets.map((preset) => (
              <PickerCard
                key={preset.id}
                icon={preset.icon}
                label={preset.label}
                description={preset.description}
                selected={selectedPresetId === preset.id}
                onClick={() =>
                  setSelectedPresetId(
                    selectedPresetId === preset.id ? null : preset.id
                  )
                }
              />
            ))}
          </div>
          {selectedPreset && (
            <PresetPreview
              preset={selectedPreset}
              onApply={() => applyPreset(selectedPreset)}
            />
          )}
        </div>
      )}

      {/* Template mode */}
      {mode === 'template' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {campaignTemplates.map((template) => (
              <PickerCard
                key={template.id}
                icon={template.icon}
                label={template.label}
                description={template.description}
                selected={selectedTemplateId === template.id}
                onClick={() =>
                  setSelectedTemplateId(
                    selectedTemplateId === template.id ? null : template.id
                  )
                }
              />
            ))}
          </div>
          {selectedTemplate && (
            <TemplatePreview
              template={selectedTemplate}
              onApply={() => applyTemplate(selectedTemplate)}
            />
          )}
        </div>
      )}
    </div>
  );
}
