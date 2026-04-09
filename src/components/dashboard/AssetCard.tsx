import { Asset, AssetType } from '@/data/mock';
import { Badge } from '@/components/ui/Badge';

const typeConfig: Record<AssetType, { label: string; color: string }> = {
  email: { label: 'Email', color: 'text-blue-400 bg-blue-500/15' },
  social_post: { label: 'Social', color: 'text-pink-400 bg-pink-500/15' },
  ad_copy: { label: 'Ad Copy', color: 'text-orange-400 bg-orange-500/15' },
  blog_outline: { label: 'Blog', color: 'text-emerald-400 bg-emerald-500/15' },
  landing_page: { label: 'Landing Page', color: 'text-indigo-400 bg-indigo-500/15' },
  sms: { label: 'SMS', color: 'text-violet-400 bg-violet-500/15' },
};

const typeIcons: Record<AssetType, React.ReactNode> = {
  email: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  ),
  social_post: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
    </svg>
  ),
  ad_copy: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  ),
  blog_outline: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  ),
  landing_page: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
    </svg>
  ),
  sms: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  ),
};

export function AssetCard({ asset }: { asset: Asset }) {
  const { label, color } = typeConfig[asset.type];

  return (
    <div className="bg-surface-card rounded-xl border border-border-subtle shadow-card p-4 hover:border-violet-500/30 hover:shadow-glow-violet transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
          {typeIcons[asset.type]}
        </div>
        <Badge variant="default">{label}</Badge>
      </div>
      <p className="text-sm font-medium text-slate-200 leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
        {asset.title}
      </p>
      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
        {asset.preview}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">{asset.wordCount} words</p>
        <button className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors">
          Copy
        </button>
      </div>
    </div>
  );
}
