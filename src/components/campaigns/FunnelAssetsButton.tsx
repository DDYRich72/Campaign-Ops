'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateFunnelAssetsAction } from '@/app/actions/generate';
import { Button } from '@/components/ui/Button';

interface FunnelAssetsButtonProps {
  campaignId: string;
  hasContent: boolean;
}

export function FunnelAssetsButton({
  campaignId,
  hasContent,
}: FunnelAssetsButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await generateFunnelAssetsAction(campaignId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <Button
        variant="primary"
        size="md"
        onClick={handleGenerate}
        loading={isPending}
        disabled={isPending}
      >
        {!isPending && (
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {isPending
          ? 'Generating Funnel…'
          : hasContent
          ? 'Regenerate Funnel Assets'
          : 'Generate Funnel Assets'}
      </Button>
      {error && (
        <p className="text-xs text-red-600 max-w-sm">{error}</p>
      )}
    </div>
  );
}
