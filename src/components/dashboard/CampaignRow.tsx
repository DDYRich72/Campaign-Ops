import Link from 'next/link';
import { Campaign, CampaignStatus } from '@/data/mock';
import { Badge } from '@/components/ui/Badge';

const statusConfig: Record<CampaignStatus, { label: string; variant: 'success' | 'warning' | 'default' | 'info' }> = {
  active: { label: 'Active', variant: 'success' },
  draft: { label: 'Draft', variant: 'default' },
  paused: { label: 'Paused', variant: 'warning' },
  completed: { label: 'Completed', variant: 'info' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function CampaignRow({ campaign }: { campaign: Campaign }) {
  const { label, variant } = statusConfig[campaign.status];

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="py-3.5 pl-6 pr-3">
        <div>
          <p className="text-sm font-medium text-slate-900 group-hover:text-violet-700 transition-colors">
            {campaign.name}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{campaign.businessName}</p>
        </div>
      </td>
      <td className="px-3 py-3.5 hidden sm:table-cell">
        <Badge variant={variant}>{label}</Badge>
      </td>
      <td className="px-3 py-3.5 hidden md:table-cell">
        <p className="text-sm text-slate-600">{campaign.channels.length} channels</p>
      </td>
      <td className="px-3 py-3.5 hidden lg:table-cell">
        <p className="text-sm text-slate-600">{campaign.assetCount} assets</p>
      </td>
      <td className="px-3 py-3.5 hidden lg:table-cell">
        <p className="text-xs text-slate-500">{formatDate(campaign.createdAt)}</p>
      </td>
      <td className="py-3.5 pl-3 pr-6">
        <Link
          href={`/campaigns`}
          className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
        >
          View →
        </Link>
      </td>
    </tr>
  );
}
