'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface SocialAccount {
  id: string;
  platform: string;
  account_name: string;
  account_handle: string;
}

interface Post {
  id: string;
  content_text: string;
  scheduled_at: string;
  status: 'pending' | 'posted' | 'failed';
  social_accounts: {
    platform: string;
    account_name: string;
  };
}

interface Schedule {
  frequency: string;
  posts_per_day: number;
  timezone: string;
  platforms_enabled: string[];
}

export function SocialScheduleSection({ campaignId, hasContent }: { campaignId: string; hasContent: boolean }) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);

  // Form state
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'immediate' | 'daily' | 'weekly' | 'smart'>('daily');
  const [postsPerDay, setPostsPerDay] = useState(2);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch connected accounts
      const accountsRes = await fetch('/api/social/accounts');
      if (accountsRes.ok) {
        const accountsData = await accountsRes.json();
        setAccounts(accountsData.accounts || []);
      }

      // Fetch existing schedule
      const scheduleRes = await fetch(`/api/campaigns/${campaignId}/schedule`);
      if (scheduleRes.ok) {
        const scheduleData = await scheduleRes.json();
        setSchedule(scheduleData.schedule);
        setPosts(scheduleData.posts || []);
        if (scheduleData.schedule) {
          setSelectedAccounts(scheduleData.schedule.platforms_enabled || []);
          setFrequency(scheduleData.schedule.frequency);
          setPostsPerDay(scheduleData.schedule.posts_per_day);
        }
      }
    } catch (err) {
      console.error('Failed to fetch schedule data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSchedule() {
    if (!selectedAccounts.length) {
      alert('Select at least one social account');
      return;
    }

    setScheduling(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frequency,
          postsPerDay,
          bestTimes: [
            { hour: 9, minute: 0 },
            { hour: 12, minute: 0 },
            { hour: 15, minute: 0 },
            { hour: 18, minute: 0 },
          ].slice(0, postsPerDay),
          timezone: 'America/New_York',
          platformAccountIds: selectedAccounts,
        }),
      });

      if (!res.ok) throw new Error('Failed to schedule');
      
      const data = await res.json();
      alert(`Scheduled ${data.postsScheduled} posts!`);
      fetchData(); // Refresh
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to schedule posts');
    } finally {
      setScheduling(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Social Media Posting
        </h2>
        <div className="text-sm text-slate-500">Loading...</div>
      </Card>
    );
  }

  if (!accounts.length) {
    return (
      <Card>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Social Media Posting
        </h2>
        <p className="text-sm text-slate-400 mb-3">
          Connect your social media accounts to auto-post this campaign.
        </p>
        <a
          href="/settings"
          className="inline-flex items-center gap-2 rounded-lg border border-violet-500/50 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/20 transition-colors"
        >
          Go to Settings →
        </a>
      </Card>
    );
  }

  if (!hasContent) {
    return (
      <Card>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Social Media Posting
        </h2>
        <p className="text-sm text-slate-400">
          Generate full content first to enable social posting.
        </p>
      </Card>
    );
  }

  const PLATFORM_NAMES: Record<string, string> = {
    twitter: 'Twitter/X',
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
  };

  return (
    <Card>
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Social Media Posting
      </h2>

      {schedule ? (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400 font-medium">
            ✓ {posts.length} posts scheduled ({frequency})
          </p>
          <p className="text-xs text-green-400/70 mt-1">
            {posts.filter(p => p.status === 'posted').length} posted,{' '}
            {posts.filter(p => p.status === 'pending').length} pending
          </p>
        </div>
      ) : (
        <>
          {/* Account Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Post to:
            </label>
            <div className="space-y-2">
              {accounts.map((account) => (
                <label
                  key={account.id}
                  className="flex items-center gap-3 p-2 rounded-lg border border-border-subtle hover:bg-surface-raised cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccounts([...selectedAccounts, account.id]);
                      } else {
                        setSelectedAccounts(selectedAccounts.filter(id => id !== account.id));
                      }
                    }}
                    className="rounded border-slate-600 bg-slate-700 text-violet-500"
                  />
                  <span className="text-lg">
                    {account.platform === 'twitter' && '🐦'}
                    {account.platform === 'linkedin' && '💼'}
                    {account.platform === 'facebook' && '📘'}
                    {account.platform === 'instagram' && '📷'}
                    {account.platform === 'tiktok' && '🎵'}
                  </span>
                  <div>
                    <p className="text-sm text-slate-200">
                      {PLATFORM_NAMES[account.platform] || account.platform}
                    </p>
                    <p className="text-xs text-slate-500">@{account.account_handle}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Posting Frequency:
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-200"
            >
              <option value="immediate">Post immediately</option>
              <option value="daily">Daily ({postsPerDay} posts/day)</option>
              <option value="weekly">Weekly spread</option>
              <option value="smart">Smart (AI-optimized times)</option>
            </select>
          </div>

          {/* Posts per day (if daily/weekly) */}
          {frequency !== 'immediate' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Posts per day: {postsPerDay}
              </label>
              <input
                type="range"
                min={1}
                max={4}
                value={postsPerDay}
                onChange={(e) => setPostsPerDay(parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>
          )}

          {/* Schedule Button */}
          <Button
            onClick={handleSchedule}
            disabled={scheduling || !selectedAccounts.length}
            isLoading={scheduling}
          >
            {scheduling ? 'Scheduling...' : 'Schedule Posts'}
          </Button>
        </>
      )}

      {/* Recent Posts */}
      {posts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <h3 className="text-xs font-medium text-slate-500 uppercase mb-2">Upcoming Posts</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="p-2 rounded bg-surface-raised text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    {new Date(post.scheduled_at).toLocaleDateString()} @{' '}
                    {new Date(post.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className={`text-xs ${
                    post.status === 'posted' ? 'text-green-400' :
                    post.status === 'failed' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-slate-500 mt-1 truncate">{post.content_text.slice(0, 60)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
