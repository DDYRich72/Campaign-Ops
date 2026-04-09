'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCampaignStatusAction } from '@/app/actions/campaigns';
import type { CampaignStatusDB } from '@/lib/supabase/types';

interface Action {
  label: string;
  newStatus: CampaignStatusDB;
  variant: 'primary' | 'secondary' | 'danger';
  requiresConfirm?: boolean;
}

const STATUS_ACTIONS: Record<CampaignStatusDB, Action[]> = {
  draft: [
    { label: 'Mark Ready', newStatus: 'ready', variant: 'primary' },
  ],
  ready: [
    { label: 'Mark Active', newStatus: 'active', variant: 'primary' },
    { label: 'Back to Draft', newStatus: 'draft', variant: 'secondary' },
  ],
  active: [
    { label: 'Archive Campaign', newStatus: 'archived', variant: 'danger', requiresConfirm: true },
  ],
  archived: [
    { label: 'Restore to Ready', newStatus: 'ready', variant: 'primary' },
    { label: 'Restore to Draft', newStatus: 'draft', variant: 'secondary' },
  ],
};

const buttonStyles: Record<Action['variant'], string> = {
  primary:
    'inline-flex items-center rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors disabled:opacity-50',
  secondary:
    'inline-flex items-center rounded-md border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs font-semibold text-slate-400 hover:border-border hover:text-slate-300 transition-colors disabled:opacity-50',
  danger:
    'inline-flex items-center rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50',
};

interface CampaignStatusActionsProps {
  campaignId: string;
  currentStatus: CampaignStatusDB;
}

export function CampaignStatusActions({
  campaignId,
  currentStatus,
}: CampaignStatusActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<CampaignStatusDB | null>(null);
  const router = useRouter();

  const actions = STATUS_ACTIONS[currentStatus] ?? [];
  if (actions.length === 0) return null;

  function handleAction(action: Action) {
    if (action.requiresConfirm) {
      setPendingConfirm(action.newStatus);
      return;
    }
    execute(action.newStatus);
  }

  function execute(newStatus: CampaignStatusDB) {
    setError(null);
    setPendingConfirm(null);
    startTransition(async () => {
      const result = await updateCampaignStatusAction(campaignId, newStatus);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  if (pendingConfirm) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2">
          <p className="text-xs text-red-400 flex-1">Archive this campaign?</p>
          <button
            type="button"
            onClick={() => execute(pendingConfirm)}
            disabled={isPending}
            className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isPending ? 'Updating…' : 'Yes, archive'}
          </button>
          <button
            type="button"
            onClick={() => setPendingConfirm(null)}
            disabled={isPending}
            className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.newStatus}
            type="button"
            disabled={isPending}
            onClick={() => handleAction(action)}
            className={buttonStyles[action.variant]}
          >
            {isPending ? 'Updating…' : action.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
