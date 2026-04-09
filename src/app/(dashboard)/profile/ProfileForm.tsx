'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Card } from '@/components/ui/Card';
import { industryOptions, brandVoiceOptions } from '@/data/mock';
import { upsertBusinessProfileAction } from '@/app/actions/profile';
import type { BusinessProfileRow } from '@/lib/supabase/types';

interface Props {
  profile: BusinessProfileRow | null;
}

export function ProfileForm({ profile }: Props) {
  const [form, setForm] = useState({
    businessName: profile?.business_name ?? '',
    industry: profile?.industry ?? '',
    targetAudience: profile?.target_audience ?? '',
    geographicMarket: profile?.geographic_market ?? '',
    website: profile?.website ?? '',
    brandVoice: profile?.default_brand_voice ?? '',
    primaryCTA: profile?.primary_cta ?? '',
    audiencePainPoints: profile?.audience_pain_points ?? '',
    uniqueSellingPoints: profile?.unique_selling_points ?? '',
  });

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== 'idle') setStatus('idle');
  }

  function handleSave() {
    startTransition(async () => {
      const result = await upsertBusinessProfileAction(form);
      if (result.success) {
        setStatus('success');
        router.refresh(); // re-fetch server component so profile loads correctly on next visit
      } else {
        setErrorMsg(result.error);
        setStatus('error');
      }
    });
  }

  return (
    <Card>
      <div className="space-y-8">
        {/* Section 1: Business Info */}
        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Business Info</h2>
            <p className="text-xs text-slate-500 mt-0.5">Basic details about your business.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Input
                label="Business Name"
                placeholder="e.g. AquaFit Studio"
                value={form.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
              />
            </div>
            <Select
              label="Industry"
              options={industryOptions.map((o) => ({ value: o, label: o }))}
              placeholder="Select industry..."
              value={form.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
            />
            <Input
              label="Website URL"
              placeholder="https://yourbusiness.com"
              value={form.website}
              onChange={(e) => handleChange('website', e.target.value)}
              type="url"
            />
          </div>
        </div>

        <Separator />

        {/* Section 2: Audience */}
        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Target Audience</h2>
            <p className="text-xs text-slate-500 mt-0.5">Who you typically sell to.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
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
            <div className="sm:col-span-2">
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

        {/* Section 3: Brand */}
        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Brand & Messaging</h2>
            <p className="text-xs text-slate-500 mt-0.5">How you sound and what you stand for.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Default Brand Voice"
              options={brandVoiceOptions.map((o) => ({ value: o, label: o }))}
              placeholder="Select brand voice..."
              value={form.brandVoice}
              onChange={(e) => handleChange('brandVoice', e.target.value)}
            />
            <Input
              label="Primary Call-to-Action"
              placeholder="e.g. Book a Free Consult, Shop Now"
              value={form.primaryCTA}
              onChange={(e) => handleChange('primaryCTA', e.target.value)}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Unique Selling Points"
                placeholder="What makes your business stand out from competitors?"
                value={form.uniqueSellingPoints}
                onChange={(e) => handleChange('uniqueSellingPoints', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            {status === 'success' && (
              <p className="text-sm text-emerald-400 flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Profile saved successfully.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errorMsg}
              </p>
            )}
            {status === 'success' && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
            )}
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            loading={isPending}
            disabled={isPending}
          >
            Save Profile
          </Button>
        </div>
      </div>
    </Card>
  );
}
