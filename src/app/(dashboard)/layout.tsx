'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-body">
      <Sidebar />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar onMenuOpen={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto relative">
          {/* Subtle dot grid on content area */}
          <div className="absolute inset-0 bg-dot-grid-faint pointer-events-none" />
          <div className="relative p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
