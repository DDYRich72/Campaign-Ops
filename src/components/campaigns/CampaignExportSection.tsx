'use client';

import { CopyButton } from '@/components/ui/CopyButton';
import {
  generateCSV,
  generateMarkdown,
  generateJSON,
  generatePlainTextCopy,
  downloadFile,
  slugify,
  type ExportableCampaign,
} from '@/lib/export';

interface CampaignExportSectionProps {
  campaign: ExportableCampaign;
  isFree?: boolean;
}

export function CampaignExportSection({ campaign, isFree = false }: CampaignExportSectionProps) {
  const hasOutline = !!campaign.campaign_outline_json?.length;
  const hasStrategy = !!campaign.strategy_json;
  const hasFullContent = !!campaign.full_content_json?.length;
  const slug = slugify(campaign.name);

  function handleDownloadCSV() {
    downloadFile(generateCSV(campaign), `${slug}-content.csv`, 'text/csv;charset=utf-8;');
  }

  function handleDownloadMarkdown() {
    downloadFile(
      generateMarkdown(campaign),
      `${slug}-campaign.md`,
      'text/markdown;charset=utf-8;'
    );
  }

  function handleDownloadJSON() {
    downloadFile(
      generateJSON(campaign),
      `${slug}-campaign.json`,
      'application/json;charset=utf-8;'
    );
  }

  // Describe what the export includes
  const hasFunnel = !!(campaign.landing_page_json || campaign.email_sequence_json);

  const exportItems: string[] = ['campaign summary'];
  if (hasStrategy) exportItems.push('strategy');
  if (campaign.content_pillars_json?.length) exportItems.push('content pillars');
  if (hasOutline) exportItems.push('30-day outline');
  if (hasFullContent) exportItems.push('full content');
  if (hasFunnel) exportItems.push('funnel assets');

  if (isFree) {
    return (
      <div className="rounded-xl border border-violet-500/25 bg-violet-500/5 px-5 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Export & Copy
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Export your full campaign as CSV, Markdown, or JSON — available on paid plans.
            </p>
          </div>
          <a
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors flex-shrink-0"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Unlock Exports →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised px-5 py-4">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Export & Copy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Includes {exportItems.join(', ')}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Copy Full Campaign */}
          {hasStrategy && (
            <CopyButton
              text={generatePlainTextCopy(campaign)}
              label="Copy Campaign"
            />
          )}

          {/* Export CSV */}
          {hasOutline && (
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors hover:border-violet-500/40 hover:text-violet-400"
            >
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export CSV
            </button>
          )}

          {/* Export Markdown */}
          {hasStrategy && (
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors hover:border-violet-500/40 hover:text-violet-400"
            >
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export Markdown
            </button>
          )}

          {/* Export JSON */}
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors hover:border-violet-500/40 hover:text-violet-400"
          >
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}
