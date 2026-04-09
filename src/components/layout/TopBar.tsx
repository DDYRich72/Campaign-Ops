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
    <header className="relative h-14 glass border-b-gradient flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10">
      {/* Left: mobile menu + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-surface-raised hover:text-slate-300 transition-colors"
          aria-label="Open menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Mobile logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-700">
            <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-100 font-display tracking-wide">Campaign Operator</span>
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="flex items-center gap-1">
        {/* System status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 mr-3 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-glow-pulse" />
          <span className="text-[10px] font-medium text-emerald-400 tracking-widest uppercase">Systems Online</span>
        </div>

        {/* Help */}
        <Link
          href="/help"
          title="Help & FAQ"
          className="p-2 rounded-lg text-slate-600 hover:bg-surface-raised hover:text-slate-300 transition-colors"
        >
          <svg className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.06 3 3 0 014.24 4.24.75.75 0 01-1.06-1.06 1.5 1.5 0 00-2.12-2.12zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </Link>

        {/* User avatar */}
        <button
          onClick={() => signOut({ redirectUrl: '/' })}
          title="Sign out"
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-xs font-bold border border-violet-500/25 hover:border-violet-400/50 hover:bg-violet-500/20 transition-all"
        >
          {initials}
        </button>
      </div>
    </header>
  );
}
