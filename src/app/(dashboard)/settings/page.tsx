import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { Card } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';

export const metadata = { title: 'Settings — Campaign Operator' };

export default async function SettingsPage() {
  const user = await currentUser();

  const fullName = user?.fullName ?? user?.firstName ?? '—';
  const email = user?.emailAddresses[0]?.emailAddress ?? '—';
  const initials = (user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress?.[0] ?? 'U').toUpperCase();

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account and workspace.</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-violet-500/15 border border-violet-500/25 px-2.5 py-0.5 text-xs font-semibold text-violet-400">
          V1
        </span>
      </div>

      {/* Account */}
      <Card>
        <h2 className="text-base font-semibold text-slate-200 mb-1">Account</h2>
        <p className="text-sm text-slate-500 mb-4">Your Clerk account details.</p>
        <Separator />
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-lg font-bold border border-violet-500/25">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{fullName}</p>
            <p className="text-sm text-slate-500 truncate">{email}</p>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-500">
          To update your name, email, or password, visit your{' '}
          <a
            href="https://accounts.clerk.dev/user"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            Clerk account settings ↗
          </a>
        </div>
      </Card>

      {/* Business Profile */}
      <Card>
        <h2 className="text-base font-semibold text-slate-200 mb-1">Business Profile</h2>
        <p className="text-sm text-slate-500 mb-4">
          Pre-fills your campaigns so you don&apos;t re-enter the same details every time.
        </p>
        <Separator />
        <div className="mt-4">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-raised px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-border-subtle hover:border-border transition-colors"
          >
            <svg className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Edit Business Profile
          </Link>
        </div>
      </Card>

      {/* Quick Links */}
      <Card>
        <h2 className="text-base font-semibold text-slate-200 mb-1">Quick Links</h2>
        <p className="text-sm text-slate-500 mb-4">Jump to key areas of the app.</p>
        <Separator />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Campaigns', href: '/campaigns', description: 'View and manage all campaigns' },
            { label: 'Create Campaign', href: '/campaigns/create', description: 'Start a new AI campaign' },
            { label: 'Dashboard', href: '/dashboard', description: 'See your campaign overview' },
            { label: 'Business Profile', href: '/profile', description: 'Update your business details' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col rounded-lg border border-border-subtle p-3 hover:border-violet-500/40 hover:bg-violet-500/5 transition-colors group"
            >
              <span className="text-sm font-medium text-slate-300 group-hover:text-violet-300 transition-colors">
                {link.label}
              </span>
              <span className="text-xs text-slate-500 mt-0.5">{link.description}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* App info */}
      <Card>
        <h2 className="text-base font-semibold text-slate-200 mb-1">About</h2>
        <Separator />
        <dl className="mt-4 divide-y divide-border-subtle">
          <div className="py-2.5 flex items-center justify-between">
            <dt className="text-sm text-slate-500">Version</dt>
            <dd className="text-sm font-medium text-slate-300">V1</dd>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <dt className="text-sm text-slate-500">Stack</dt>
            <dd className="text-sm text-slate-500">Next.js · Clerk · Supabase · OpenAI</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
