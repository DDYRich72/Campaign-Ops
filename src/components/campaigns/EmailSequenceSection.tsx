'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import type { EmailItem } from '@/lib/supabase/types';

function formatEmail(email: EmailItem): string {
  return [
    `Subject: ${email.subject}`,
    `Preview: ${email.preview_text}`,
    '',
    email.body,
    '',
    `CTA: ${email.cta}`,
  ].join('\n');
}

function formatAllEmails(emails: EmailItem[]): string {
  return emails
    .map(
      (e) =>
        `EMAIL ${e.sequence}\n${'─'.repeat(40)}\n${formatEmail(e)}`
    )
    .join('\n\n');
}

const EMAIL_LABELS: Record<number, string> = {
  1: 'Welcome',
  2: 'Problem Agitation',
  3: 'Solution Reveal',
  4: 'Objection Handling',
  5: 'Urgency Close',
};

function EmailCard({ email, isFree = false }: { email: EmailItem; isFree?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const label = EMAIL_LABELS[email.sequence] ?? `Email ${email.sequence}`;

  return (
    <div className="border border-border-subtle rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-start gap-3 px-4 py-3.5 bg-surface-card hover:bg-surface-raised transition-colors text-left"
      >
        {/* Sequence badge */}
        <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 text-xs font-semibold mt-0.5">
          {email.sequence}
        </span>

        {/* Label + subject */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">
              {label}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-200 truncate">
            {email.subject}
          </p>
          {!isOpen && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {email.preview_text}
            </p>
          )}
        </div>

        {/* Chevron */}
        <svg
          className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 mt-1 ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="border-t border-border-subtle px-5 py-5 bg-surface-card space-y-5">
          {/* Subject + Preview — always shown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Subject
                </p>
                <CopyButton text={email.subject} label="Copy" variant="ghost" />
              </div>
              <p className="text-sm font-medium text-slate-200">{email.subject}</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Preview Text
                </p>
                <CopyButton text={email.preview_text} label="Copy" variant="ghost" />
              </div>
              <p className="text-sm text-slate-400 italic">{email.preview_text}</p>
            </div>
          </div>

          {isFree ? (
            /* Locked gate for free users */
            <div className="rounded-xl border border-violet-500/25 bg-violet-500/5 px-5 py-6 text-center">
              <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15">
                <svg className="h-4 w-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-200">Email body is locked</p>
              <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                Upgrade to unlock the full email body, CTA, and copy tools for all 5 emails.
              </p>
              <a
                href="/pricing"
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                Unlock Full Campaign →
              </a>
            </div>
          ) : (
            <>
              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Body
                  </p>
                  <CopyButton text={email.body} label="Copy Body" variant="ghost" />
                </div>
                <div className="rounded-md bg-surface-raised px-4 py-4">
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {email.body}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    CTA
                  </p>
                  <CopyButton text={email.cta} label="Copy" variant="ghost" />
                </div>
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {email.cta}
                </p>
              </div>

              {/* Copy full email */}
              <div className="pt-1 border-t border-border-subtle flex justify-end">
                <CopyButton text={formatEmail(email)} label="Copy Full Email" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function EmailSequenceSection({ emails, isFree = false }: { emails: EmailItem[]; isFree?: boolean }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
            Email Sequence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {emails.length}-email follow-up sequence
          </p>
        </div>
        {!isFree && (
          <CopyButton
            text={formatAllEmails(emails)}
            label="Copy All Emails"
          />
        )}
      </div>

      <div className="space-y-2">
        {emails.map((email) => (
          <EmailCard key={email.sequence} email={email} isFree={isFree} />
        ))}
      </div>
    </Card>
  );
}
