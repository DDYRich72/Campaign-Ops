import Link from 'next/link';
import { mockCampaigns, CampaignStatus } from '@/data/mock';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const metadata = { title: 'Campaigns — Campaign Operator' };

const statusConfig: Record<CampaignStatus, { label: string; variant: 'success' | 'warning' | 'default' | 'info' }> = {
  active: { label: 'Active', variant: 'success' },
  draft: { label: 'Draft', variant: 'default' },
  paused: { label: 'Paused', variant: 'warning' },
  completed: { label: 'Completed', variant: 'info' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="mt-1 text-sm text-slate-500">{mockCampaigns.length} campaigns total</p>
        </div>
        <Link href="/campaigns/create">
          <Button size="md">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Search / filter bar (visual only) */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search campaigns..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            readOnly
          />
        </div>
        <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 sm:w-40">
          <option>All statuses</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Campaigns table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Campaign</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Industry</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Channels</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Assets</th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Created</th>
                <th className="py-3.5 pl-3 pr-6" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCampaigns.map((campaign) => {
                const { label, variant } = statusConfig[campaign.status];
                return (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 pl-6 pr-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900 group-hover:text-violet-700 transition-colors">
                          {campaign.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{campaign.businessName}</p>
                      </div>
                    </td>
                    <td className="px-3 py-4 hidden sm:table-cell">
                      <Badge variant={variant}>{label}</Badge>
                    </td>
                    <td className="px-3 py-4 hidden md:table-cell">
                      <p className="text-sm text-slate-600">{campaign.industry}</p>
                    </td>
                    <td className="px-3 py-4 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {campaign.channels.slice(0, 3).map((ch) => (
                          <span key={ch} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-600 capitalize">
                            {ch.replace('_', ' ')}
                          </span>
                        ))}
                        {campaign.channels.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-500">
                            +{campaign.channels.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 hidden lg:table-cell">
                      <p className="text-sm text-slate-600">{campaign.assetCount}</p>
                    </td>
                    <td className="px-3 py-4 hidden xl:table-cell">
                      <p className="text-xs text-slate-500">{formatDate(campaign.createdAt)}</p>
                    </td>
                    <td className="py-4 pl-3 pr-6">
                      <button className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors">
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
