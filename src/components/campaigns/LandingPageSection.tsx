import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import type { LandingPageCopy } from '@/lib/supabase/types';

function formatLandingPageCopy(lp: LandingPageCopy): string {
  return [
    `HEADLINE\n${lp.headline}`,
    `SUBHEADLINE\n${lp.subheadline}`,
    `HERO SUPPORTING TEXT\n${lp.hero_supporting_text}`,
    `PRIMARY CTA\n${lp.primary_cta}`,
    `BENEFIT BULLETS\n${lp.benefit_bullets.map((b) => `• ${b}`).join('\n')}`,
    `PROBLEM SECTION\n${lp.problem_section}`,
    `SOLUTION SECTION\n${lp.solution_section}`,
    `OFFER SECTION\n${lp.offer_section}`,
    `OBJECTION HANDLING\n${lp.objection_handling}`,
    `CLOSING CTA\n${lp.closing_cta}`,
  ].join('\n\n---\n\n');
}

interface SectionBlockProps {
  label: string;
  children: React.ReactNode;
  copyText?: string;
  copyLabel?: string;
}

function SectionBlock({ label, children, copyText, copyLabel }: SectionBlockProps) {
  return (
    <div className="py-4 border-b border-border-subtle last:border-0">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          {label}
        </p>
        {copyText && copyLabel && (
          <CopyButton text={copyText} label={copyLabel} variant="ghost" />
        )}
      </div>
      {children}
    </div>
  );
}

function LockedLandingPageSections() {
  return (
    <div className="rounded-xl border border-violet-500/25 bg-violet-500/5 px-6 py-8 text-center mt-2">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15">
        <svg className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-200">Full landing page copy is locked</p>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
        Upgrade to unlock benefit bullets, problem/solution sections, offer copy, objection handling, and the closing CTA.
      </p>
      <a
        href="/pricing"
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
      >
        Unlock Full Campaign →
      </a>
    </div>
  );
}

function buildBoltUrl(lp: LandingPageCopy): string {
  const prompt =
    `Build a high-converting landing page using this copy:\n\n` +
    formatLandingPageCopy(lp);
  return `https://bolt.new/?prompt=${encodeURIComponent(prompt)}`;
}

function BoltLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
    </svg>
  );
}

export function LandingPageSection({ lp, isFree = false }: { lp: LandingPageCopy; isFree?: boolean }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
          Landing Page Copy
        </h2>
        {!isFree && (
          <div className="flex items-center gap-2">
            <a
              href={buildBoltUrl(lp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1a1a2e] border border-[#6c3ce1] px-3 py-1.5 text-xs font-semibold text-[#a78bfa] hover:bg-[#6c3ce1] hover:text-white transition-colors"
            >
              <BoltLogo />
              Build in Bolt.new
            </a>
            <CopyButton
              text={formatLandingPageCopy(lp)}
              label="Copy All"
            />
          </div>
        )}
      </div>

      {/* Hero — always visible */}
      <SectionBlock
        label="Headline"
        copyText={isFree ? undefined : lp.headline}
        copyLabel="Copy"
      >
        <p className="text-base font-semibold text-slate-100 leading-snug">
          {lp.headline}
        </p>
      </SectionBlock>

      <SectionBlock
        label="Subheadline"
        copyText={isFree ? undefined : lp.subheadline}
        copyLabel="Copy"
      >
        <p className="text-sm text-slate-300 leading-relaxed">{lp.subheadline}</p>
      </SectionBlock>

      <SectionBlock
        label="Hero Supporting Text"
        copyText={isFree ? undefined : lp.hero_supporting_text}
        copyLabel="Copy"
      >
        <p className="text-sm text-slate-300 leading-relaxed">
          {lp.hero_supporting_text}
        </p>
      </SectionBlock>

      <SectionBlock
        label="Primary CTA"
        copyText={isFree ? undefined : lp.primary_cta}
        copyLabel="Copy"
      >
        <span className="inline-flex items-center rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white">
          {lp.primary_cta}
        </span>
      </SectionBlock>

      {/* Locked gate for free users */}
      {isFree ? (
        <LockedLandingPageSections />
      ) : (
        <>
          {/* Benefits */}
          <SectionBlock
            label="Benefit Bullets"
            copyText={lp.benefit_bullets.map((b) => `• ${b}`).join('\n')}
            copyLabel="Copy All"
          >
            <ul className="space-y-2">
              {lp.benefit_bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-slate-300">{bullet}</span>
                </li>
              ))}
            </ul>
          </SectionBlock>

          {/* Body sections */}
          <SectionBlock
            label="Problem Section"
            copyText={lp.problem_section}
            copyLabel="Copy"
          >
            <p className="text-sm text-slate-300 leading-relaxed">{lp.problem_section}</p>
          </SectionBlock>

          <SectionBlock
            label="Solution Section"
            copyText={lp.solution_section}
            copyLabel="Copy"
          >
            <p className="text-sm text-slate-300 leading-relaxed">
              {lp.solution_section}
            </p>
          </SectionBlock>

          <SectionBlock
            label="Offer Section"
            copyText={lp.offer_section}
            copyLabel="Copy"
          >
            <p className="text-sm text-slate-300 leading-relaxed">{lp.offer_section}</p>
          </SectionBlock>

          <SectionBlock
            label="Objection Handling"
            copyText={lp.objection_handling}
            copyLabel="Copy"
          >
            <p className="text-sm text-slate-300 leading-relaxed">
              {lp.objection_handling}
            </p>
          </SectionBlock>

          <SectionBlock
            label="Closing CTA"
            copyText={lp.closing_cta}
            copyLabel="Copy"
          >
            <p className="text-sm text-slate-300 leading-relaxed">{lp.closing_cta}</p>
          </SectionBlock>
        </>
      )}
    </Card>
  );
}
