'use client';

import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import {
  formatOutlineRow,
  generateOutlineCopyText,
} from '@/lib/export';
import type { OutlineItem } from '@/lib/supabase/types';

const PLATFORM_COLORS: Record<string, string> = {
  email:     'bg-sky-500/15 text-sky-400',
  social:    'bg-violet-500/15 text-violet-400',
  instagram: 'bg-pink-500/15 text-pink-400',
  facebook:  'bg-blue-500/15 text-blue-400',
  linkedin:  'bg-blue-500/15 text-blue-300',
  twitter:   'bg-sky-500/15 text-sky-400',
  x:         'bg-slate-500/15 text-slate-400',
  tiktok:    'bg-rose-500/15 text-rose-400',
  youtube:   'bg-red-500/15 text-red-400',
  paid_ads:  'bg-orange-500/15 text-orange-400',
  seo:       'bg-emerald-500/15 text-emerald-400',
  sms:       'bg-amber-500/15 text-amber-400',
};

function platformColor(platform: string): string {
  return (
    PLATFORM_COLORS[platform.toLowerCase().replace(' ', '_')] ??
    'bg-surface-raised text-slate-400'
  );
}

export function OutlineSection({ outline }: { outline: OutlineItem[] }) {
  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
          30-Day Campaign Outline
        </h2>
        <CopyButton
          text={generateOutlineCopyText(outline)}
          label="Copy Outline"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border-subtle bg-surface-sidebar">
            <tr>
              <th className="py-2.5 pl-5 pr-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide w-12">
                Day
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Platform
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide hidden sm:table-cell">
                Type
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Topic
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide hidden md:table-cell">
                Hook
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide hidden lg:table-cell">
                CTA
              </th>
              {/* Copy column — always visible */}
              <th className="py-2.5 pl-2 pr-5 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {outline.map((item) => (
              <tr key={item.day} className="hover:bg-surface-raised transition-colors group">
                <td className="py-3 pl-5 pr-3">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-violet-500/15 text-violet-400 text-xs font-semibold">
                    {item.day}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize ${platformColor(item.platform)}`}
                  >
                    {item.platform}
                  </span>
                </td>
                <td className="px-3 py-3 hidden sm:table-cell">
                  <span className="text-xs text-slate-500">{item.content_type}</span>
                </td>
                <td className="px-3 py-3 max-w-[180px]">
                  <p className="text-sm text-slate-200 font-medium truncate">
                    {item.topic}
                  </p>
                </td>
                <td className="px-3 py-3 hidden md:table-cell max-w-[220px]">
                  <p className="text-sm text-slate-400 truncate">{item.hook}</p>
                </td>
                <td className="px-3 py-3 hidden lg:table-cell max-w-[160px]">
                  <p className="text-xs text-slate-500 truncate">{item.cta}</p>
                </td>
                <td className="py-3 pl-2 pr-5">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton
                      text={formatOutlineRow(item)}
                      label="Copy"
                      variant="ghost"
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
