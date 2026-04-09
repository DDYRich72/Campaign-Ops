'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  label: string;
  /** 'default' = outlined pill, 'ghost' = text-only link style */
  variant?: 'default' | 'ghost';
  className?: string;
}

export function CopyButton({
  text,
  label,
  variant = 'default',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silent fail
    }
  }

  if (variant === 'ghost') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          'text-xs font-medium transition-colors',
          copied
            ? 'text-emerald-600'
            : 'text-slate-400 hover:text-violet-600',
          className
        )}
      >
        {copied ? '✓ Copied' : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
        copied
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700',
        className
      )}
    >
      {copied ? (
        <>
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
