'use client';

import { useState, useTransition } from 'react';
import { Card } from '@/components/ui/Card';
import { saveContentPublishStateAction } from '@/app/actions/publish';
import type { FullContentItem } from '@/lib/supabase/types';
import type { ContentPublishState, ContentPublishStateMap } from '@/lib/supabase/types';

// Platform open URLs — Twitter supports pre-filled text via intent/tweet
const PLATFORM_URLS: Record<string, (text: string) => string> = {
  twitter:   (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text.slice(0, 280))}`,
  'twitter/x': (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text.slice(0, 280))}`,
  linkedin:  () => 'https://www.linkedin.com/feed/',
  facebook:  () => 'https://www.facebook.com/',
  instagram: () => 'https://www.instagram.com/',
  tiktok:    () => 'https://www.tiktok.com/upload',
};

const PLATFORM_ICONS: Record<string, string> = {
  twitter: '🐦', 'twitter/x': '🐦', linkedin: '💼', facebook: '📘',
  instagram: '📷', tiktok: '🎵', email: '✉️', sms: '💬',
};

const DEFAULT_STATE: ContentPublishState = {
  status: 'draft',
  scheduled_for: null,
  published_at: null,
  notes: null,
};

type Filter = 'all' | 'pending' | 'posted';

export function SocialScheduleSection({
  campaignId,
  fullContent,
  initialPublishState,
  isFree = false,
}: {
  campaignId: string;
  fullContent: FullContentItem[];
  initialPublishState: ContentPublishStateMap;
  isFree?: boolean;
}) {
  const [publishState, setPublishState] = useState<ContentPublishStateMap>(initialPublishState);
  const [filter, setFilter] = useState<Filter>('pending');
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  if (isFree) {
    return (
      <Card>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Publishing Queue
        </h2>
        <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-4">
          <p className="text-sm font-semibold text-slate-200 mb-1">Unlock the Publishing Queue</p>
          <p className="text-xs text-slate-400 mb-3">
            Get a structured queue of all 30 posts with one-click copy, platform links, and progress tracking.
          </p>
          <a
            href="/pricing"
            className="inline-flex items-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Upgrade to Enable →
          </a>
        </div>
      </Card>
    );
  }

  if (!fullContent?.length) {
    return (
      <Card>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Publishing Queue
        </h2>
        <p className="text-sm text-slate-400">
          Generate full content first to build your publishing queue.
        </p>
      </Card>
    );
  }

  function markPosted(day: number) {
    const current = publishState[String(day)] ?? DEFAULT_STATE;
    const updated: ContentPublishState = {
      ...current,
      status: 'published',
      published_at: new Date().toISOString(),
    };
    const newState = { ...publishState, [String(day)]: updated };
    setPublishState(newState);
    startTransition(async () => {
      await saveContentPublishStateAction(campaignId, newState);
    });
  }

  function markUnposted(day: number) {
    const current = publishState[String(day)] ?? DEFAULT_STATE;
    const updated: ContentPublishState = { ...current, status: 'draft', published_at: null };
    const newState = { ...publishState, [String(day)]: updated };
    setPublishState(newState);
    startTransition(async () => {
      await saveContentPublishStateAction(campaignId, newState);
    });
  }

  async function copyCaption(item: FullContentItem, day: number) {
    const hashtags = item.hashtags?.map((h: string) => `#${h}`).join(' ') ?? '';
    const text = `${item.caption}\n\n${hashtags}`.trim();
    await navigator.clipboard.writeText(text);
    setCopiedDay(day);
    setTimeout(() => setCopiedDay(null), 2000);
  }

  function openPlatform(item: FullContentItem) {
    const key = item.platform.toLowerCase();
    const hashtags = item.hashtags?.map((h: string) => `#${h}`).join(' ') ?? '';
    const text = `${item.caption}\n\n${hashtags}`.trim();
    const urlFn = PLATFORM_URLS[key] ?? (() => `https://www.google.com/search?q=${encodeURIComponent(key + ' post')}`);
    window.open(urlFn(text), '_blank', 'noopener,noreferrer');
  }

  const posted = fullContent.filter(i => (publishState[String(i.day)] ?? DEFAULT_STATE).status === 'published').length;
  const total = fullContent.length;

  const filtered = fullContent.filter(item => {
    const status = (publishState[String(item.day)] ?? DEFAULT_STATE).status;
    if (filter === 'pending') return status !== 'published';
    if (filter === 'posted') return status === 'published';
    return true;
  });

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Publishing Queue
        </h2>
        <span className="text-xs text-slate-500">
          <span className="text-emerald-400 font-semibold">{posted}</span> / {total} posted
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-700 mb-4">
        <div
          className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${total > 0 ? (posted / total) * 100 : 0}%` }}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {(['pending', 'all', 'posted'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Queue list */}
      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">
          {filter === 'posted' ? 'Nothing posted yet.' : 'All done! 🎉'}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => {
            const status = (publishState[String(item.day)] ?? DEFAULT_STATE).status;
            const isPosted = status === 'published';
            const platformKey = item.platform.toLowerCase();

            return (
              <div
                key={item.day}
                className={`rounded-lg border p-3 transition-colors ${
                  isPosted
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-border-subtle bg-surface-raised'
                }`}
              >
                {/* Row: icon + day + platform + status */}
                <div className="flex items-start gap-2.5">
                  <span className="text-base mt-0.5 flex-shrink-0">
                    {PLATFORM_ICONS[platformKey] ?? '📣'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-300">Day {item.day}</span>
                      <span className="text-xs text-slate-500">{item.platform}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500 capitalize">{item.content_type}</span>
                      {isPosted && (
                        <span className="text-xs text-emerald-400 font-medium">✓ Posted</span>
                      )}
                    </div>
                    {/* Caption preview */}
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                    {/* Image thumbnail */}
                    {(item as { image_url?: string }).image_url && (
                      <img
                        src={(item as { image_url?: string }).image_url}
                        alt=""
                        className="mt-2 h-16 w-24 rounded object-cover border border-border-subtle"
                      />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => copyCaption(item, item.day)}
                    className="inline-flex items-center gap-1 rounded border border-slate-600 bg-surface-card px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
                  >
                    {copiedDay === item.day ? (
                      <><svg className="h-3 w-3 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Copied!</>
                    ) : (
                      <><svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/></svg> Copy Caption</>
                    )}
                  </button>

                  <button
                    onClick={() => openPlatform(item)}
                    className="inline-flex items-center gap-1 rounded border border-slate-600 bg-surface-card px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                    </svg>
                    Open {item.platform}
                  </button>

                  {isPosted ? (
                    <button
                      onClick={() => markUnposted(item.day)}
                      className="inline-flex items-center gap-1 rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      Undo
                    </button>
                  ) : (
                    <button
                      onClick={() => markPosted(item.day)}
                      className="inline-flex items-center gap-1 rounded border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Mark as Posted
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
