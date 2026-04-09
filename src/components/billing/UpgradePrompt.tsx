import Link from 'next/link';

interface UpgradePromptProps {
  feature: string;
  used: number;
  limit: number;
}

export function UpgradePrompt({ feature, used, limit }: UpgradePromptProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <p className="text-sm font-semibold text-amber-900">
          {feature} limit reached ({used}/{limit})
        </p>
        <p className="mt-0.5 text-sm text-amber-700">
          You have used all {limit} {feature.toLowerCase()} on your current plan. Upgrade to continue.
        </p>
      </div>
      <Link
        href="/billing"
        className="flex-shrink-0 inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
      >
        Upgrade plan
      </Link>
    </div>
  );
}
