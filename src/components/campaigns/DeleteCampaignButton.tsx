'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCampaignAction } from '@/app/actions/campaigns';

interface DeleteCampaignButtonProps {
  campaignId: string;
  campaignName: string;
}

export function DeleteCampaignButton({ campaignId, campaignName }: DeleteCampaignButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteCampaignAction(campaignId);
      if (result.success) {
        router.push('/campaigns');
      } else {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-xs text-red-700 flex-1">
            Delete &ldquo;{campaignName}&rdquo;? This cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isPending ? 'Deleting…' : 'Yes, delete'}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-xs font-medium text-slate-400 hover:text-red-600 transition-colors"
    >
      Delete campaign
    </button>
  );
}
