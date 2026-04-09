'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateCampaignAction } from '@/app/actions/generate';
import { Button } from '@/components/ui/Button';

interface GenerateButtonProps {
  campaignId: string;
}

export function GenerateButton({ campaignId }: GenerateButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await generateCampaignAction(campaignId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        variant="primary"
        size="md"
        onClick={handleGenerate}
        loading={isPending}
        disabled={isPending}
      >
        {!isPending && (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {isPending ? 'Generating…' : 'Generate Campaign'}
      </Button>
      {error && (
        <p className="text-xs text-red-600 max-w-xs text-right">{error}</p>
      )}
    </div>
  );
}
