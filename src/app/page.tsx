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
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-[2px] border-b border-rule">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-14">
          <div className="flex h-16 items-center justify-between">
            {/* Wordmark */}
            <Link href="/" className="font-display text-[20px] text-ink leading-none tracking-tight">
              Campaign<span className="display-italic text-ink-soft"> &amp; Co.</span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-9">
              <a href="#how-it-works" className="text-[13px] text-ink-soft hover:text-ink transition-colors">
                How it works
              </a>
              <a href="#features" className="text-[13px] text-ink-soft hover:text-ink transition-colors">
                Features
              </a>
              <a href="#examples" className="text-[13px] text-ink-soft hover:text-ink transition-colors">
                Examples
              </a>
              <Link href="/pricing" className="text-[13px] text-ink-soft hover:text-ink transition-colors">
                Pricing
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex text-[13px] text-ink-soft hover:text-ink transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-9 items-center justify-center bg-ink px-5 text-[13px] text-paper hover:bg-black transition-colors rounded-[3px]"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ExampleOutputsSection />
      <WhoItsForSection />
      <FinalCTASection />
      <LandingFooter />
    </div>
  );
}
