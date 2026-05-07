'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
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

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const displayName = user?.fullName ?? user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? 'Account';
  const email = user?.emailAddresses[0]?.emailAddress ?? '';
  const initials = (user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress?.[0] ?? 'U').toUpperCase();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop — paper-toned, no blur */}
      <div
        className="fixed inset-0 bg-ink/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 bg-paper-deep border-r border-rule flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 h-20 border-b border-rule">
          <span className="font-display text-[20px] text-ink tracking-tight">
            Campaign<span className="display-italic text-ink-soft"> &amp; Co.</span>
          </span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-ink-soft hover:text-ink transition-colors"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        <div className="px-7 pt-7 pb-3">
          <p className="editorial-eyebrow">Workspace</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-4">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-baseline gap-4 px-4 py-3 text-[15px] transition-colors',
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
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-rule px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper border border-ink text-ink text-[12px] font-medium">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] text-ink leading-tight">{displayName}</p>
              <p className="truncate text-[11px] text-ink-faint mt-0.5">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
