'use client';

import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';

interface TopBarProps {
  onMenuOpen: () => void;
}

export function TopBar({ onMenuOpen }: TopBarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const initials = (
    user?.firstName?.[0] ??
    user?.emailAddresses[0]?.emailAddress?.[0] ??
    'U'
  ).toUpperCase();

  return (
    <header className="relative h-16 bg-paper border-b border-rule flex items-center justify-between px-5 sm:px-8 flex-shrink-0 z-10">
      {/* Left: mobile menu + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 -ml-2 text-ink-soft hover:text-ink transition-colors"
          aria-label="Open menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="square" />
          </svg>
        </button>

        {/* Mobile wordmark */}
        <Link href="/dashboard" className="lg:hidden font-display text-[18px] text-ink tracking-tight">
          Campaign<span className="display-italic text-ink-soft"> &amp; Co.</span>
        </Link>
      </div>

      {/* Right: help + avatar */}
      <div className="flex items-center gap-5">
        <Link
          href="/help"
          className="text-[12px] text-ink-soft hover:text-ink transition-colors tracking-tight hidden sm:inline"
        >
          Help
        </Link>

        <button
          onClick={() => signOut({ redirectUrl: '/' })}
          title="Sign out"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-paper border border-ink text-ink text-[11px] font-medium hover:bg-rule-soft transition-colors"
        >
          {initials}
        </button>
      </div>
    </header>
  );
}
