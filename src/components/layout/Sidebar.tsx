'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-4a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 100-2h-2V7a1 1 0 00-1-1z" />
      </svg>
    ),
  },
  {
    label: 'Campaigns',
    href: '/campaigns',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
      </svg>
    ),
  },
  {
    label: 'Create Campaign',
    href: '/campaigns/create',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    ),
    highlight: true,
  },
  {
    label: 'Assets',
    href: '/assets',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Billing',
    href: '/billing',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const displayName = user?.fullName ?? user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? 'Account';
  const email = user?.emailAddresses[0]?.emailAddress ?? '';
  const initials = (user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress?.[0] ?? 'U').toUpperCase();

  return (
    <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col bg-surface-sidebar border-r border-border-subtle h-screen sticky top-0 overflow-hidden">
      {/* Ambient top glow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="relative flex items-center gap-3 px-5 h-16 border-b border-border-subtle">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 shadow-glow-violet">
          <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-100 leading-tight font-display tracking-wide">Campaign</p>
          <p className="text-[10px] text-slate-500 leading-tight tracking-widest uppercase">Operator</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
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
              style={{ animationDelay: `${i * 40}ms` }}
              className={cn(
                'animate-in flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'nav-active text-violet-300'
                  : item.highlight
                  ? 'text-violet-400 hover:bg-violet-500/10 hover:text-violet-300'
                  : 'text-slate-500 hover:bg-surface-raised hover:text-slate-300'
              )}
            >
              <span className={cn(
                isActive ? 'text-violet-400' : item.highlight ? 'text-violet-500' : 'text-slate-600'
              )}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 animate-glow-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent mx-2" />

      {/* User area */}
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-sm font-bold border border-violet-500/25">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold text-slate-300">{displayName}</p>
            <p className="truncate text-[10px] text-slate-600">{email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ redirectUrl: '/' })}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-surface-raised hover:text-slate-400 transition-colors"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}
