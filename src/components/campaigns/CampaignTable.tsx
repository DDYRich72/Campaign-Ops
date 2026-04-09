'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { CampaignRow, CampaignStatusDB, ContentItemStatus } from '@/lib/supabase/types';

const statusConfig: Record<
  CampaignStatusDB,
  { label: string; variant: 'success' | 'warning' | 'default' | 'info' }
> = {
  draft: { label: 'Draft', variant: 'default' },
  ready: { label: 'Ready', variant: 'info' },
  active: { label: 'Active', variant: 'success' },
  archived: { label: 'Archived', variant: 'warning' },
};

function getPublishProgress(campaign: CampaignRow): { published: number; total: number } | null {
  if (!campaign.full_content_json?.length) return null;
  const total = campaign.full_content_json.length;
  const stateMap = campaign.content_publish_state_json ?? {};
  const published = Object.values(stateMap).filter(
    (s): s is { status: ContentItemStatus; scheduled_for: string | null; published_at: string | null; notes: string | null } =>
      s.status === 'published'
  ).length;
  return { published, total };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface CampaignTableProps {
  campaigns: CampaignRow[];
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CampaignStatusDB>('all');

  const filtered = campaigns.filter((c) => {
    const matchesSearch =
      search.trim() === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.business_name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Search / filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full rounded-lg border border-border-subtle bg-surface-raised py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | CampaignStatusDB)}
          className="rounded-lg border border-border-subtle bg-surface-raised px-3 py-2.5 text-sm text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 sm:w-40"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="ready">Ready</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-400">No campaigns match your filters.</p>
          <p className="mt-1 text-xs text-slate-600">Try adjusting your search or status filter.</p>
        </div>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border-subtle">
                <tr>
                  <th className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Campaign</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Goal</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Channels</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Updated</th>
                  <th className="py-3.5 pl-3 pr-6" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((campaign) => {
                  const { label, variant } = statusConfig[campaign.status];
                  return (
                    <tr key={campaign.id} className="hover:bg-surface-raised transition-colors group">
                      <td className="py-4 pl-6 pr-3">
                        <Link href={`/campaigns/${campaign.id}`} className="block">
                          <p className="text-sm font-medium text-slate-200 group-hover:text-violet-400 transition-colors">
                            {campaign.name}
                          </p>
                          {campaign.business_name && (
                            <p className="text-xs text-slate-500 mt-0.5">{campaign.business_name}</p>
                          )}
                          {(() => {
                            const progress = getPublishProgress(campaign);
                            if (!progress) return null;
                            return (
                              <p className="text-xs text-slate-400 mt-0.5">
                                <span className={progress.published === progress.total ? 'text-emerald-400 font-medium' : ''}>
                                  {progress.published}/{progress.total} published
                                </span>
                              </p>
                            );
                          })()}
                        </Link>
                      </td>
                      <td className="px-3 py-4 hidden sm:table-cell">
                        <Badge variant={variant}>{label}</Badge>
                      </td>
                      <td className="px-3 py-4 hidden md:table-cell">
                        <p className="text-sm text-slate-400 truncate max-w-[180px]">
                          {campaign.goal ?? <span className="text-slate-400 italic">—</span>}
                        </p>
                      </td>
                      <td className="px-3 py-4 hidden lg:table-cell">
                        <div className="flex gap-1 flex-wrap">
                          {(campaign.channels ?? []).slice(0, 3).map((ch) => (
                            <span key={ch} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-surface-raised text-slate-400 capitalize">
                              {ch.replace('_', ' ')}
                            </span>
                          ))}
                          {(campaign.channels ?? []).length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-surface-raised text-slate-500">
                              +{campaign.channels.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 hidden xl:table-cell">
                        <p className="text-xs text-slate-500">{formatDate(campaign.updated_at)}</p>
                      </td>
                      <td className="py-4 pl-3 pr-6">
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
