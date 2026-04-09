import Link from 'next/link';
import { Campaign, CampaignStatus } from '@/data/mock';
import { Badge } from '@/components/ui/Badge';

const statusConfig: Record<CampaignStatus, { label: string; variant: 'success' | 'warning' | 'default' | 'info' }> = {
  draft:    { label: 'Draft',    variant: 'default' },
  ready:    { label: 'Ready',    variant: 'info' },
  active:   { label: 'Active',  variant: 'success' },
  archived: { label: 'Archived',variant: 'warning' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function CampaignRow({ campaign }: { campaign: Campaign }) {
  const { label, variant } = statusConfig[campaign.status];

  return (
    <tr className="group border-t border-border-subtle hover:bg-surface-raised/40 transition-colors">
      <td className="py-3.5 pl-6 pr-3">
        <div>
          <p className="text-sm font-medium text-slate-300 group-hover:text-violet-300 transition-colors">
            {campaign.name}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">{campaign.businessName}</p>
        </div>
      </td>
      <td className="px-3 py-3.5 hidden sm:table-cell">
        <Badge variant={variant} dot>{label}</Badge>
      </td>
      <td className="px-3 py-3.5 hidden md:table-cell">
        <p className="text-xs text-slate-500">{campaign.channels.length} channels</p>
      </td>
      <td className="px-3 py-3.5 hidden lg:table-cell">
        <p className="text-xs text-slate-500">{campaign.assetCount} assets</p>
      </td>
      <td className="px-3 py-3.5 hidden lg:table-cell">
        <p className="text-xs text-slate-600">{formatDate(campaign.updatedAt)}</p>
      </td>
      <td className="py-3.5 pl-3 pr-6">
        <Link
          href={`/campaigns/${campaign.id}`}
          className="text-xs font-semibold text-cyan-500 hover:text-cyan-300 transition-colors"
        >
          View →
        </Link>
      </td>
    </tr>
  );
}
