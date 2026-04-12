'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';

interface SocialAccount {
  id: string;
  platform: string;
  account_name: string;
  account_handle: string;
  avatar_url: string;
}

const PLATFORM_ICONS: Record<string, string> = {
  twitter: '🐦',
  linkedin: '💼',
  facebook: '📘',
  instagram: '📷',
  tiktok: '🎵',
  pinterest: '📌',
  google: '🔍',
  mastodon: '🐘',
  startpage: '📄',
};

const PLATFORM_NAMES: Record<string, string> = {
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
  google: 'Google Business',
  mastodon: 'Mastodon',
  startpage: 'Start Page',
};

export function SocialAccountsCard() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const res = await fetch('/api/social/accounts');
      if (!res.ok) throw new Error('Failed to fetch accounts');
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      setError('Failed to load connected accounts');
    } finally {
      setLoading(false);
    }
  }

  async function disconnectAccount(id: string) {
    try {
      const res = await fetch(`/api/social/accounts?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to disconnect');
      
      // Remove from list
      setAccounts(accounts.filter(a => a.id !== id));
    } catch (err) {
      setError('Failed to disconnect account');
    }
  }

  function connectBuffer() {
    window.location.href = '/api/social/buffer/connect';
  }

  if (loading) {
    return (
      <Card>
        <h2 className="text-base font-semibold text-slate-200 mb-1">Social Media Accounts</h2>
        <p className="text-sm text-slate-500 mb-4">Connect accounts to auto-post your campaigns.</p>
        <Separator />
        <div className="mt-4 text-sm text-slate-500">Loading accounts...</div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-200 mb-1">Social Media Accounts</h2>
      <p className="text-sm text-slate-500 mb-4">
        Connect your social media accounts to automatically post campaign content.
      </p>
      <Separator />
      
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Connected Accounts */}
      {accounts.length > 0 && (
        <div className="mt-4 space-y-3">
          <h3 className="text-sm font-medium text-slate-400">Connected Accounts</h3>
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border-subtle bg-surface-raised"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{PLATFORM_ICONS[account.platform] || '🔗'}</span>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {PLATFORM_NAMES[account.platform] || account.platform}
                  </p>
                  <p className="text-xs text-slate-500">@{account.account_handle}</p>
                </div>
              </div>
              <button
                onClick={() => disconnectAccount(account.id)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Connect Button */}
      <div className="mt-4">
        <button
          onClick={connectBuffer}
          className="inline-flex items-center gap-2 rounded-lg border border-violet-500/50 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-300 hover:bg-violet-500/20 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Connect Social Accounts
        </button>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Powered by Buffer. Connect once to post to Twitter/X, LinkedIn, Facebook, Instagram, and more.
      </div>
    </Card>
  );
}
