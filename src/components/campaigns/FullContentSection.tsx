'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import {
  formatDayBlock,
  generateFilteredContentCSV,
  downloadFile,
  slugify,
} from '@/lib/export';
import { saveContentPublishStateAction } from '@/app/actions/publish';
import type { FullContentItem } from '@/lib/supabase/types';
import type { ContentPublishState, ContentPublishStateMap, ContentItemStatus } from '@/lib/supabase/types';

// ── Default publish state for an item ────────────────────────────────────────

const DEFAULT_PUBLISH_STATE: ContentPublishState = {
  status: 'draft',
  scheduled_for: null,
  published_at: null,
  notes: null,
};

// ── Platform color map ────────────────────────────────────────────────────────

const PLATFORM_COLORS: Record<string, string> = {
  email: 'bg-sky-500/15 text-sky-400',
  social: 'bg-violet-500/15 text-violet-400',
  instagram: 'bg-pink-500/15 text-pink-400',
  facebook: 'bg-blue-500/15 text-blue-400',
  linkedin: 'bg-blue-500/15 text-blue-400',
  twitter: 'bg-sky-500/15 text-sky-400',
  x: 'bg-surface-raised text-slate-300',
  tiktok: 'bg-rose-500/15 text-rose-400',
  youtube: 'bg-red-500/15 text-red-400',
  paid_ads: 'bg-orange-500/15 text-orange-400',
  seo: 'bg-emerald-500/15 text-emerald-400',
  sms: 'bg-amber-500/15 text-amber-400',
};

function platformColor(platform: string): string {
  return (
    PLATFORM_COLORS[platform.toLowerCase().replace(/\s+/g, '_')] ??
    'bg-surface-raised text-slate-400'
  );
}

// ── Publish status config ─────────────────────────────────────────────────────

const PUBLISH_STATUS_CONFIG: Record<
  ContentItemStatus,
  { label: string; badge: string }
> = {
  draft: { label: 'Draft', badge: 'bg-surface-raised text-slate-500' },
  ready: { label: 'Ready', badge: 'bg-blue-500/15 text-blue-400' },
  scheduled: { label: 'Scheduled', badge: 'bg-amber-500/15 text-amber-400' },
  published: { label: 'Published', badge: 'bg-emerald-500/15 text-emerald-400' },
};

function PublishBadge({ status }: { status: ContentItemStatus }) {
  const { label, badge } = PUBLISH_STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', badge)}>
      {label}
    </span>
  );
}

// ── Filter chip ───────────────────────────────────────────────────────────────

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors',
        active
          ? 'bg-violet-600 text-white'
          : 'bg-surface-raised text-slate-400 hover:bg-border-subtle hover:text-slate-300'
      )}
    >
      {label.replace(/_/g, ' ')}
    </button>
  );
}

// ── Publish controls (shown in expanded item body) ────────────────────────────

function PublishControls({
  state,
  onUpdate,
}: {
  state: ContentPublishState;
  onUpdate: (patch: Partial<ContentPublishState>) => void;
}) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledFor, setScheduledFor] = useState(
    state.scheduled_for ? state.scheduled_for.slice(0, 16) : ''
  );

  function markReady() {
    onUpdate({ status: 'ready', scheduled_for: null });
    setShowSchedule(false);
  }

  function confirmSchedule() {
    if (!scheduledFor) return;
    onUpdate({ status: 'scheduled', scheduled_for: new Date(scheduledFor).toISOString() });
    setShowSchedule(false);
  }

  function markPublished() {
    onUpdate({
      status: 'published',
      published_at: new Date().toISOString(),
      scheduled_for: state.scheduled_for,
    });
    setShowSchedule(false);
  }

  function backToDraft() {
    onUpdate({ status: 'draft', scheduled_for: null, published_at: null });
    setShowSchedule(false);
  }

  function backToReady() {
    onUpdate({ status: 'ready', scheduled_for: null, published_at: null });
    setShowSchedule(false);
  }

  const { status } = state;

  return (
    <div className="pt-3 border-t border-border-subtle">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Publish Status
        </p>
        <PublishBadge status={status} />
      </div>

      <div className="flex flex-wrap gap-2">
        {status === 'draft' && (
          <button
            type="button"
            onClick={markReady}
            className="inline-flex items-center rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Mark Ready
          </button>
        )}

        {status === 'ready' && (
          <>
            <button
              type="button"
              onClick={() => setShowSchedule((v) => !v)}
              className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              {showSchedule ? 'Cancel' : 'Schedule'}
            </button>
            <button
              type="button"
              onClick={markPublished}
              className="inline-flex items-center rounded-md bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
            >
              Mark Published
            </button>
            <button
              type="button"
              onClick={backToDraft}
              className="inline-flex items-center rounded-md border border-border-subtle px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              → Draft
            </button>
          </>
        )}

        {status === 'scheduled' && (
          <>
            <button
              type="button"
              onClick={markPublished}
              className="inline-flex items-center rounded-md bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
            >
              Mark Published
            </button>
            <button
              type="button"
              onClick={backToReady}
              className="inline-flex items-center rounded-md border border-border-subtle px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              → Ready
            </button>
          </>
        )}

        {status === 'published' && (
          <button
            type="button"
            onClick={backToReady}
            className="inline-flex items-center rounded-md border border-border-subtle px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            → Ready
          </button>
        )}
      </div>

      {/* Schedule date input */}
      {showSchedule && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            className="rounded-md border border-border-subtle bg-surface-raised px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="button"
            onClick={confirmSchedule}
            disabled={!scheduledFor}
            className="inline-flex items-center rounded-md bg-amber-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-40"
          >
            Confirm
          </button>
        </div>
      )}

      {/* Meta: scheduled_for / published_at */}
      {status === 'scheduled' && state.scheduled_for && (
        <p className="mt-2 text-xs text-amber-400">
          Scheduled: {new Date(state.scheduled_for).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </p>
      )}
      {status === 'published' && state.published_at && (
        <p className="mt-2 text-xs text-emerald-400">
          Published: {new Date(state.published_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </p>
      )}
    </div>
  );
}

// ── Single content item ───────────────────────────────────────────────────────

function ContentItem({
  item,
  isOpen,
  onToggle,
  publishState,
  onUpdatePublish,
}: {
  item: FullContentItem;
  isOpen: boolean;
  onToggle: () => void;
  publishState: ContentPublishState;
  onUpdatePublish: (patch: Partial<ContentPublishState>) => void;
}) {
  const captionPreview = item.caption.replace(/\n+/g, ' ').trim().slice(0, 90);
  const previewTruncated = item.caption.replace(/\n+/g, ' ').trim().length > 90;

  return (
    <div className="border border-border-subtle rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-4 py-3 bg-surface-card hover:bg-surface-raised transition-colors text-left"
      >
        {/* Day badge */}
        <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-xs font-semibold mt-0.5">
          {item.day}
        </span>

        {/* Platform + type badges */}
        <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0 mt-0.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize ${platformColor(item.platform)}`}>
            {item.platform}
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-surface-raised text-slate-500 text-xs">
            {item.content_type}
          </span>
        </div>

        {/* Topic + caption preview */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-slate-200 block truncate">
            {item.topic}
          </span>
          {!isOpen && (
            <span className="text-xs text-slate-400 block truncate mt-0.5">
              {captionPreview}{previewTruncated ? '…' : ''}
            </span>
          )}
        </div>

        {/* Publish status pill + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          <PublishBadge status={publishState.status} />
          <svg
            className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Expanded body */}
      {isOpen && (
        <div className="border-t border-border-subtle px-5 py-5 space-y-5 bg-surface-card">
          {/* Hook */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Hook</p>
            <p className="text-sm text-slate-300 italic leading-relaxed">&ldquo;{item.hook}&rdquo;</p>
          </div>

          {/* Caption */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Caption</p>
              <CopyButton text={item.caption} label="Copy Caption" variant="ghost" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{item.caption}</p>
          </div>

          {/* CTA */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">CTA</p>
              <CopyButton text={item.cta} label="Copy CTA" variant="ghost" />
            </div>
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400">
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {item.cta}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Hashtags */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Hashtags</p>
                <CopyButton text={item.hashtags.map((h) => `#${h}`).join(' ')} label="Copy" variant="ghost" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.hashtags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-raised text-slate-400 text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Visual Prompt</p>
                <CopyButton text={item.visual_prompt} label="Copy" variant="ghost" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic bg-surface-raised rounded-md px-3 py-2">
                {item.visual_prompt}
              </p>
            </div>
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-2">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-0.5">Note</p>
              <p className="text-xs text-amber-300">{item.notes}</p>
            </div>
          )}

          {/* Copy full day */}
          <div className="pt-1 border-t border-border-subtle flex justify-end">
            <CopyButton text={formatDayBlock(item)} label="Copy Full Day" />
          </div>

          {/* Publish controls */}
          <PublishControls
            state={publishState}
            onUpdate={onUpdatePublish}
          />
        </div>
      )}
    </div>
  );
}

// ── Publish summary bar ───────────────────────────────────────────────────────

function PublishSummary({
  items,
  publishState,
  onMarkAllReady,
}: {
  items: FullContentItem[];
  publishState: ContentPublishStateMap;
  onMarkAllReady: () => void;
}) {
  const counts = { draft: 0, ready: 0, scheduled: 0, published: 0 };
  for (const item of items) {
    const s = (publishState[String(item.day)] ?? DEFAULT_PUBLISH_STATE).status;
    counts[s]++;
  }
  const hasDrafts = counts.draft > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface-raised px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
        <span className="text-slate-500">{counts.draft} draft</span>
        <span className="text-blue-400">{counts.ready} ready</span>
        <span className="text-amber-400">{counts.scheduled} scheduled</span>
        <span className="text-emerald-400">{counts.published} published</span>
      </div>
      {hasDrafts && (
        <button
          type="button"
          onClick={onMarkAllReady}
          className="inline-flex items-center rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
        >
          Mark all draft → ready
        </button>
      )}
    </div>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

// ── Free-tier gate ────────────────────────────────────────────────────────────

const FREE_PREVIEW_COUNT = 3;

function LockedContentGate({ lockedCount }: { lockedCount: number }) {
  return (
    <div className="rounded-xl border border-violet-500/25 bg-violet-500/5 px-6 py-8 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15">
        <svg className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-200">
        {lockedCount} more day{lockedCount !== 1 ? 's' : ''} locked
      </p>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
        Upgrade to unlock all 30 days of full captions, CTAs, hashtags, visual prompts, and the publish workflow.
      </p>
      <a
        href="/pricing"
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
      >
        Unlock Full Campaign →
      </a>
    </div>
  );
}

// ── Locked single-item preview ────────────────────────────────────────────────

function LockedContentItem({ item }: { item: FullContentItem }) {
  return (
    <div className="border border-border-subtle rounded-lg overflow-hidden opacity-70">
      <div className="w-full flex items-start gap-3 px-4 py-3 bg-surface-card">
        <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-500 text-xs font-semibold mt-0.5">
          {item.day}
        </span>
        <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0 mt-0.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-raised text-slate-500 text-xs font-medium capitalize">
            {item.platform}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-slate-400 block truncate">{item.topic}</span>
          <span className="text-xs text-slate-600 block mt-0.5">Upgrade to unlock full content</span>
        </div>
        <div className="flex-shrink-0 mt-1">
          <svg className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface FullContentSectionProps {
  items: FullContentItem[];
  campaignName: string;
  campaignId: string;
  initialPublishState: ContentPublishStateMap;
  isFree?: boolean;
}

export function FullContentSection({
  items,
  campaignName,
  campaignId,
  initialPublishState,
  isFree = false,
}: FullContentSectionProps) {
  const [publishState, setPublishState] = useState<ContentPublishStateMap>(initialPublishState);
  const [view, setView] = useState<'content' | 'schedule'>('content');
  const [openDays, setOpenDays] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [activePlatforms, setActivePlatforms] = useState<Set<string>>(new Set());
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());
  const [activePublishStatus, setActivePublishStatus] = useState<Set<ContentItemStatus>>(new Set());
  const [, startTransition] = useTransition();

  // ── Publish state helpers ────────────────────────────────────────────────

  function updatePublishState(newState: ContentPublishStateMap) {
    setPublishState(newState);
    startTransition(async () => {
      await saveContentPublishStateAction(campaignId, newState);
    });
  }

  function handleUpdateItem(day: number, patch: Partial<ContentPublishState>) {
    const current = publishState[String(day)] ?? DEFAULT_PUBLISH_STATE;
    const updated = { ...current, ...patch };
    updatePublishState({ ...publishState, [String(day)]: updated });
  }

  function handleMarkAllReady() {
    const newState = { ...publishState };
    for (const item of items) {
      const key = String(item.day);
      const current = newState[key] ?? DEFAULT_PUBLISH_STATE;
      if (current.status === 'draft') {
        newState[key] = { ...current, status: 'ready' };
      }
    }
    updatePublishState(newState);
  }

  // ── Filter logic ─────────────────────────────────────────────────────────

  const platforms = Array.from(new Set(items.map((i) => i.platform.toLowerCase()))).sort();
  const contentTypes = Array.from(new Set(items.map((i) => i.content_type.toLowerCase()))).sort();

  const hasActiveFilters =
    search.trim() !== '' ||
    activePlatforms.size > 0 ||
    activeTypes.size > 0 ||
    activePublishStatus.size > 0;

  const filtered = items.filter((item) => {
    if (activePlatforms.size > 0 && !activePlatforms.has(item.platform.toLowerCase())) return false;
    if (activeTypes.size > 0 && !activeTypes.has(item.content_type.toLowerCase())) return false;
    if (activePublishStatus.size > 0) {
      const s = (publishState[String(item.day)] ?? DEFAULT_PUBLISH_STATE).status;
      if (!activePublishStatus.has(s)) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.topic.toLowerCase().includes(q) ||
        item.hook.toLowerCase().includes(q) ||
        item.caption.toLowerCase().includes(q) ||
        item.cta.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function togglePlatform(p: string) {
    setActivePlatforms((prev) => {
      const n = new Set(prev);
      if (n.has(p)) { n.delete(p); } else { n.add(p); }
      return n;
    });
  }
  function toggleType(t: string) {
    setActiveTypes((prev) => {
      const n = new Set(prev);
      if (n.has(t)) { n.delete(t); } else { n.add(t); }
      return n;
    });
  }
  function togglePublishStatus(s: ContentItemStatus) {
    setActivePublishStatus((prev) => {
      const n = new Set(prev);
      if (n.has(s)) { n.delete(s); } else { n.add(s); }
      return n;
    });
  }
  function clearFilters() {
    setSearch('');
    setActivePlatforms(new Set());
    setActiveTypes(new Set());
    setActivePublishStatus(new Set());
  }
  function toggle(day: number) {
    setOpenDays((prev) => {
      const n = new Set(prev);
      if (n.has(day)) { n.delete(day); } else { n.add(day); }
      return n;
    });
  }
  function expandAll() { setOpenDays(new Set(filtered.map((i) => i.day))); }
  function collapseAll() { setOpenDays(new Set()); }
  function handleDownloadFiltered() {
    downloadFile(generateFilteredContentCSV(filtered), `${slugify(campaignName)}-filtered-content.csv`, 'text/csv;charset=utf-8;');
  }

  const allOpen = filtered.length > 0 && filtered.every((i) => openDays.has(i.day));

  return (
    <div className="space-y-4">
      {/* Publish summary */}
      <PublishSummary
        items={items}
        publishState={publishState}
        onMarkAllReady={handleMarkAllReady}
      />

      {/* View toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-card p-1 w-fit">
        <button
          type="button"
          onClick={() => setView('content')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
            view === 'content' ? 'bg-surface-raised text-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-300'
          )}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setView('schedule')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
            view === 'schedule' ? 'bg-surface-raised text-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-300'
          )}
        >
          Schedule
        </button>
      </div>

      {/* ── CONTENT VIEW ── */}
      {view === 'content' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="space-y-3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search topics, hooks, captions, CTAs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-surface-raised py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            {platforms.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium mr-1">Platform:</span>
                {platforms.map((p) => (
                  <FilterChip key={p} label={p} active={activePlatforms.has(p)} onClick={() => togglePlatform(p)} />
                ))}
              </div>
            )}

            {contentTypes.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium mr-1">Type:</span>
                {contentTypes.map((t) => (
                  <FilterChip key={t} label={t} active={activeTypes.has(t)} onClick={() => toggleType(t)} />
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium mr-1">Status:</span>
              {(['draft', 'ready', 'scheduled', 'published'] as ContentItemStatus[]).map((s) => (
                <FilterChip key={s} label={s} active={activePublishStatus.has(s)} onClick={() => togglePublishStatus(s)} />
              ))}
            </div>
          </div>

          {/* Controls bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-500">
                {hasActiveFilters ? `${filtered.length} of ${items.length} items` : `${items.length} content items`}
              </p>
              {hasActiveFilters && (
                <button type="button" onClick={clearFilters} className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors">
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!isFree && hasActiveFilters && filtered.length > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadFiltered}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-raised px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors hover:border-violet-500/40 hover:text-violet-400"
                >
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export Filtered CSV
                </button>
              )}
              {filtered.length > 0 && (
                <button type="button" onClick={allOpen ? collapseAll : expandAll} className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors">
                  {allOpen ? 'Collapse all' : 'Expand all'}
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="rounded-lg border border-border-subtle px-5 py-8 text-center">
              <p className="text-sm text-slate-500">No items match your filters.</p>
              <button type="button" onClick={clearFilters} className="mt-2 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors">
                Clear filters
              </button>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="space-y-2">
              {(isFree ? filtered.slice(0, FREE_PREVIEW_COUNT) : filtered).map((item) => (
                <ContentItem
                  key={item.day}
                  item={item}
                  isOpen={openDays.has(item.day)}
                  onToggle={() => toggle(item.day)}
                  publishState={publishState[String(item.day)] ?? DEFAULT_PUBLISH_STATE}
                  onUpdatePublish={(patch) => handleUpdateItem(item.day, patch)}
                />
              ))}
              {isFree && items.length > FREE_PREVIEW_COUNT && (
                <>
                  {items.slice(FREE_PREVIEW_COUNT, FREE_PREVIEW_COUNT + 3).map((item) => (
                    <LockedContentItem key={item.day} item={item} />
                  ))}
                  <LockedContentGate lockedCount={items.length - FREE_PREVIEW_COUNT} />
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── SCHEDULE VIEW ── */}
      {view === 'schedule' && (
        <ScheduleView
          items={items}
          publishState={publishState}
          onUpdateItem={handleUpdateItem}
        />
      )}
    </div>
  );
}

// ── Schedule view (grouped by status) ────────────────────────────────────────

function ScheduleView({
  items,
  publishState,
  onUpdateItem,
}: {
  items: FullContentItem[];
  publishState: ContentPublishStateMap;
  onUpdateItem: (day: number, patch: Partial<ContentPublishState>) => void;
}) {
  const scheduled = items
    .filter((i) => (publishState[String(i.day)] ?? DEFAULT_PUBLISH_STATE).status === 'scheduled')
    .sort((a, b) => {
      const da = publishState[String(a.day)]?.scheduled_for ?? '';
      const db = publishState[String(b.day)]?.scheduled_for ?? '';
      return da.localeCompare(db);
    });

  const ready = items.filter((i) => (publishState[String(i.day)] ?? DEFAULT_PUBLISH_STATE).status === 'ready');
  const published = items
    .filter((i) => (publishState[String(i.day)] ?? DEFAULT_PUBLISH_STATE).status === 'published')
    .sort((a, b) => {
      const da = publishState[String(a.day)]?.published_at ?? '';
      const db = publishState[String(b.day)]?.published_at ?? '';
      return db.localeCompare(da); // most recent first
    });
  const draft = items.filter((i) => (publishState[String(i.day)] ?? DEFAULT_PUBLISH_STATE).status === 'draft');

  return (
    <div className="space-y-6">
      <ScheduleGroup
        title="Scheduled"
        badge="bg-amber-500/15 text-amber-400"
        items={scheduled}
        publishState={publishState}
        onUpdateItem={onUpdateItem}
        emptyText="No items scheduled yet."
        showDate="scheduled"
      />
      <ScheduleGroup
        title="Ready to Publish"
        badge="bg-blue-500/15 text-blue-400"
        items={ready}
        publishState={publishState}
        onUpdateItem={onUpdateItem}
        emptyText="No items marked ready."
      />
      <ScheduleGroup
        title="Published"
        badge="bg-emerald-500/15 text-emerald-400"
        items={published}
        publishState={publishState}
        onUpdateItem={onUpdateItem}
        emptyText="Nothing published yet."
        showDate="published"
      />
      <ScheduleGroup
        title="Draft"
        badge="bg-surface-raised text-slate-500"
        items={draft}
        publishState={publishState}
        onUpdateItem={onUpdateItem}
        emptyText="No drafts remaining."
      />
    </div>
  );
}

function ScheduleGroup({
  title,
  badge,
  items,
  publishState,
  onUpdateItem,
  emptyText,
  showDate,
}: {
  title: string;
  badge: string;
  items: FullContentItem[];
  publishState: ContentPublishStateMap;
  onUpdateItem: (day: number, patch: Partial<ContentPublishState>) => void;
  emptyText: string;
  showDate?: 'scheduled' | 'published';
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', badge)}>
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400 italic pl-1">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const state = publishState[String(item.day)] ?? DEFAULT_PUBLISH_STATE;
            let dateLabel: string | null = null;
            if (showDate === 'scheduled' && state.scheduled_for) {
              dateLabel = new Date(state.scheduled_for).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
            }
            if (showDate === 'published' && state.published_at) {
              dateLabel = new Date(state.published_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
            }

            return (
              <div key={item.day} className="flex items-start gap-3 rounded-lg border border-border-subtle bg-surface-card px-4 py-3">
                <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-xs font-semibold">
                  {item.day}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize ${platformColor(item.platform)}`}>
                      {item.platform}
                    </span>
                    <span className="text-xs text-slate-400">{item.content_type}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 truncate">{item.topic}</p>
                  {dateLabel && (
                    <p className={cn('text-xs mt-0.5', showDate === 'scheduled' ? 'text-amber-400' : 'text-emerald-400')}>
                      {dateLabel}
                    </p>
                  )}
                </div>
                {/* Quick action buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                  {state.status === 'draft' && (
                    <button
                      type="button"
                      onClick={() => onUpdateItem(item.day, { status: 'ready' })}
                      className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Ready
                    </button>
                  )}
                  {state.status === 'ready' && (
                    <>
                      <button
                        type="button"
                        onClick={() => onUpdateItem(item.day, { status: 'published', published_at: new Date().toISOString() })}
                        className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Publish
                      </button>
                      <span className="text-slate-200">|</span>
                      <button
                        type="button"
                        onClick={() => onUpdateItem(item.day, { status: 'draft' })}
                        className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Draft
                      </button>
                    </>
                  )}
                  {state.status === 'scheduled' && (
                    <button
                      type="button"
                      onClick={() => onUpdateItem(item.day, { status: 'published', published_at: new Date().toISOString() })}
                      className="text-xs font-medium text-green-600 hover:text-green-800 transition-colors"
                    >
                      Publish
                    </button>
                  )}
                  {state.status === 'published' && (
                    <button
                      type="button"
                      onClick={() => onUpdateItem(item.day, { status: 'ready', published_at: null })}
                      className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Undo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
