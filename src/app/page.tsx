import Link from 'next/link';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ExampleOutputsSection } from '@/components/landing/ExampleOutputsSection';
import { WhoItsForSection } from '@/components/landing/WhoItsForSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-body">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 glass border-b-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 shadow-glow-violet">
                <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-100 font-display tracking-wide">Campaign Operator</span>
            </div>

            {/* Nav (desktop) */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#how-it-works" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                How It Works
              </a>
              <a href="#features" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                Features
              </a>
              <a href="/pricing" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                Pricing
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-lg btn-shimmer px-4 text-sm font-semibold text-white shadow-glow-violet transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page sections */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ExampleOutputsSection />
      <WhoItsForSection />
      <FinalCTASection />
      <LandingFooter />
    </div>
  );
}
