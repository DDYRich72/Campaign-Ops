import Link from 'next/link';
import { mockAssets } from '@/data/mock';
import { AssetCard } from '@/components/dashboard/AssetCard';
import { Button } from '@/components/ui/Button';

export const metadata = { title: 'Assets — Campaign Operator' };

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assets</h1>
          <p className="mt-1 text-sm text-slate-500">
            {mockAssets.length} assets generated across all campaigns
          </p>
        </div>
        <Link href="/campaigns/create">
          <Button size="md">Create Campaign</Button>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Email', 'Social', 'Ad Copy', 'Blog', 'SMS'].map((filter) => (
          <button
            key={filter}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === 'All'
                ? 'bg-violet-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Assets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}
