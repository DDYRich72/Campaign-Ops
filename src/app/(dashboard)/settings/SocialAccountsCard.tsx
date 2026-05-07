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
    } catch {
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
    } catch {
      setError('Failed to disconnect account');
    }
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
        Track which platforms you post to. Your Publishing Queue links directly to each platform.
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

      <div className="mt-4 rounded-lg bg-surface-raised border border-border-subtle p-3 text-xs text-slate-500 leading-relaxed">
        Social accounts are managed directly on each platform. Use the Publishing Queue on your campaign page to copy content and open each platform with one click.
      </div>
    </Card>
  );
}
