import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-[24px] text-ink tracking-tight">
            Campaign<span className="display-italic text-ink-soft"> &amp; Co.</span>
          </Link>
          <p className="mt-4 editorial-eyebrow">Begin your subscription</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
