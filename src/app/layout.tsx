import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'AI Campaign Operator — 30-Day Marketing Campaigns in Minutes',
  description:
    'Turn one offer into a complete 30-day marketing campaign. AI Campaign Operator generates strategy, content calendars, emails, social posts, ad copy, and more for small businesses.',
};

const clerkAppearance = {
  variables: {
    colorBackground: '#0f1420',
    colorText: '#e2e8f0',
    colorTextSecondary: '#94a3b8',
    colorInputBackground: '#151c2c',
    colorInputText: '#e2e8f0',
    colorPrimary: '#a855f7',
    colorDanger: '#f87171',
    colorSuccess: '#34d399',
    colorNeutral: '#1a2035',
    borderRadius: '0.625rem',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
        <body className="bg-surface-body text-slate-200 antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
