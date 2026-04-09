import Link from 'next/link';

const QUICK_STARTS = [
  { label: '🏠 Home Services', href: '/campaigns/create?preset=home-services' },
  { label: '✨ Med Spa', href: '/campaigns/create?preset=med-spa' },
  { label: '💪 Gym / Fitness', href: '/campaigns/create?preset=gym-fitness' },
  { label: '🏡 Real Estate', href: '/campaigns/create?preset=real-estate' },
  { label: '🎯 Lead Gen Offer', href: '/campaigns/create?template=lead-generation' },
  { label: '🚀 New Launch', href: '/campaigns/create?template=new-service-launch' },
  { label: '📅 Seasonal Promo', href: '/campaigns/create?template=seasonal-promo' },
];

export function QuickStartRow() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
          Quick start:
        </span>
        <div className="flex flex-wrap gap-2">
          {QUICK_STARTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/campaigns/create"
            className="inline-flex items-center rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-medium text-slate-400 hover:border-violet-400 hover:text-violet-600 transition-colors"
          >
            + From scratch
          </Link>
        </div>
      </div>
    </div>
  );
}
