import type { Metadata } from 'next';
import { Fraunces, Inter_Tight } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
  style: ['normal', 'italic'],
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Campaign Operator — 30-Day Marketing Campaigns for Small Businesses',
  description:
    'Turn one offer into a complete 30-day marketing campaign — strategy, content, captions, and copy — drafted in minutes. For small businesses who want to look serious without the agency price tag.',
};

const clerkAppearance = {
  variables: {
    colorBackground: '#FBF8F1',
    colorText: '#1A1A1A',
    colorTextSecondary: '#5A5A5A',
    colorInputBackground: '#F4F0E6',
    colorInputText: '#1A1A1A',
    colorPrimary: '#1A1A1A',
    colorDanger: '#8B2A2A',
    colorSuccess: '#3A5731',
    colorNeutral: '#E5E0D5',
    borderRadius: '4px',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className={`${fraunces.variable} ${interTight.variable}`}>
        <body className="bg-paper text-ink antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
