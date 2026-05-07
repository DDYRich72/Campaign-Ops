'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard',       href: '/dashboard' },
  { label: 'Campaigns',       href: '/campaigns' },
  { label: 'Create Campaign', href: '/campaigns/create', highlight: true },
  { label: 'Assets',          href: '/assets' },
  { label: 'Profile',         href: '/profile' },
  { label: 'Billing',         href: '/billing' },
  { label: 'Settings',        href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const displayName = user?.fullName ?? user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? 'Account';
  const email = user?.emailAddresses[0]?.emailAddress ?? '';
  const initials = (user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress?.[0] ?? 'U').toUpperCase();

  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-paper-deep border-r border-rule h-screen sticky top-0 overflow-hidden">
      {/* Wordmark */}
      <Link href="/dashboard" className="flex items-baseline gap-2 px-7 h-20 border-b border-rule">
        <span className="font-display text-[22px] text-ink leading-none tracking-tight">
          Campaign
          <span className="display-italic text-ink-soft"> &amp; Co.</span>
        </span>
      </Link>

      {/* Section label */}
      <div className="px-7 pt-7 pb-3">
        <p className="editorial-eyebrow">Workspace</p>
      </div>

      {/* Nav — minimalist, no icons. Number prefixes for editorial feel. */}
      <nav className="flex-1 px-3 pb-4 overflow-y-auto">
        {navItems.map((item, i) => {
          const isActive =
            item.href === '/campaigns/create'
              ? pathname === item.href
              : pathname === item.href ||
                (item.href !== '/dashboard' &&
                  pathname.startsWith(item.href) &&
                  item.href !== '/campaigns/create');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-baseline gap-4 px-4 py-2.5 text-[14px] transition-colors',
                isActive
                  ? 'text-ink font-medium'
                  : 'text-ink-soft hover:text-ink',
              )}
            >
              <span
                className={cn(
                  'font-display text-[11px] tabular-nums tracking-tight',
                  isActive ? 'text-ink' : 'text-ink-faint',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={cn(item.highlight && !isActive && 'italic')}>
                {item.label}
              </span>
              {isActive && (
                <span className="ml-auto h-px w-4 bg-ink self-center" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User panel */}
      <div className="border-t border-rule px-5 py-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-paper border border-ink text-ink text-[12px] font-medium">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[13px] text-ink leading-tight">{displayName}</p>
            <p className="truncate text-[11px] text-ink-faint mt-0.5">{email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ redirectUrl: '/' })}
          className="text-[11px] text-ink-soft hover:text-ink transition-colors tracking-tight"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
