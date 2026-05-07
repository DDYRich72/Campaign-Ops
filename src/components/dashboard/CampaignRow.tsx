import Link from 'next/link';
import { Campaign, CampaignStatus } from '@/data/mock';
import { Badge } from '@/components/ui/Badge';

const statusConfig: Record<CampaignStatus, { label: string; variant: 'success' | 'warning' | 'default' | 'info' }> = {
  draft:    { label: 'Draft',    variant: 'default' },
  ready:    { label: 'Ready',    variant: 'info' },
  active:   { label: 'Active',   variant: 'success' },
  archived: { label: 'Archived', variant: 'warning' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function CampaignRow({ campaign }: { campaign: Campaign }) {
  const { label, variant } = statusConfig[campaign.status];

  return (
    <tr className="group border-t border-rule hover:bg-paper transition-colors">
      <td className="py-5 pl-7 pr-4">
        <Link href={`/campaigns/${campaign.id}`} className="block">
          <p className="font-display text-[16px] text-ink group-hover:underline group-hover:decoration-ink underline-offset-[6px] decoration-rule tracking-tight">
            {campaign.name}
          </p>
          <p className="text-[12px] text-ink-faint mt-1 italic">{campaign.businessName}</p>
        </Link>
      </td>
      <td className="px-4 py-5 hidden sm:table-cell">
        <Badge variant={variant} dot>{label}</Badge>
      </td>
      <td className="px-4 py-5 hidden md:table-cell">
        <p className="text-[12px] text-ink-soft tabular-nums">{campaign.channels.length} channels</p>
      </td>
      <td className="px-4 py-5 hidden lg:table-cell">
        <p className="text-[12px] text-ink-soft tabular-nums">{campaign.assetCount} assets</p>
      </td>
      <td className="px-4 py-5 hidden lg:table-cell">
        <p className="text-[12px] text-ink-faint tabular-nums">{formatDate(campaign.updatedAt)}</p>
      </td>
      <td className="py-5 pl-4 pr-7">
        <Link
          href={`/campaigns/${campaign.id}`}
          className="text-[12px] text-ink hover:text-oxblood transition-colors whitespace-nowrap"
        >
          Open →
        </Link>
      </td>
    </tr>
  );
}
