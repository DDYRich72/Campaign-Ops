import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = { title: 'Assets — Campaign Operator' };

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Assets</h1>
          <p className="mt-1 text-sm text-slate-500">
            Generated content lives inside each campaign.
          </p>
        </div>
        <Link href="/campaigns/create">
          <Button size="md">Create Campaign</Button>
        </Link>
      </div>

      {/* Empty state */}
      <div className="rounded-xl border-2 border-dashed border-border px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-raised">
          <svg className="h-6 w-6 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-300">Assets live inside campaigns</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
          Your captions, emails, landing page copy, and visual prompts are generated and managed inside each campaign.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/campaigns">
            <Button variant="primary" size="md">View Campaigns</Button>
          </Link>
          <Link href="/campaigns/create">
            <Button variant="secondary" size="md">Create Campaign</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
