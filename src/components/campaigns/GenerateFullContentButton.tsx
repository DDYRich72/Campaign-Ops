'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateFullContentAction } from '@/app/actions/generate';
import { Button } from '@/components/ui/Button';

interface GenerateFullContentButtonProps {
  campaignId: string;
  hasContent: boolean;
}

export function GenerateFullContentButton({
  campaignId,
  hasContent,
}: GenerateFullContentButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await generateFullContentAction(campaignId);
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
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {isPending
          ? 'Generating Content…'
          : hasContent
          ? 'Regenerate Full Content'
          : 'Generate Full Content'}
      </Button>
      {error && (
        <p className="text-xs text-red-600 max-w-sm">{error}</p>
      )}
    </div>
  );
}
