import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — Campaign Operator' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-900">Campaign Operator</span>
            </Link>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: April 9, 2026</p>

        <div className="prose prose-slate max-w-none space-y-10 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Introduction</h2>
            <p>
              Campaign Operator (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data when you use our platform at campaignoperator.com.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly, including:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Account information (name, email address) when you sign up via Clerk</li>
              <li>Business profile details you enter (business name, industry, brand voice, etc.)</li>
              <li>Campaign content and inputs you provide to generate marketing assets</li>
              <li>Billing information processed by Stripe (we do not store card numbers)</li>
            </ul>
            <p className="mt-3">We also automatically collect:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Usage data (pages visited, features used, actions taken)</li>
              <li>Device and browser information</li>
              <li>IP address and general location data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide, operate, and improve the Campaign Operator platform</li>
              <li>Generate AI-powered marketing campaigns using your business inputs</li>
              <li>Process payments and manage your subscription</li>
              <li>Send transactional emails (account confirmations, receipts)</li>
              <li>Respond to support requests</li>
              <li>Monitor for security and prevent fraud</li>
            </ul>
            <p className="mt-3">We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use trusted third-party services to operate our platform:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Clerk</strong> — authentication and user management</li>
              <li><strong>Supabase</strong> — database and data storage</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>OpenAI</strong> — AI content generation</li>
              <li><strong>Vercel</strong> — hosting and infrastructure</li>
            </ul>
            <p className="mt-3">Each service has its own privacy policy governing how they handle data.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Data Retention</h2>
            <p>
              We retain your account and campaign data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or financial compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict certain processing</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at privacy@campaignoperator.com.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">7. Security</h2>
            <p>
              We implement industry-standard security measures including encrypted data transmission (TLS), secure authentication, and access controls. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on the platform. Continued use of Campaign Operator after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">9. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@campaignoperator.com" className="text-violet-600 hover:underline">
                privacy@campaignoperator.com
              </a>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-slate-200 mt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} Campaign Operator. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-slate-700 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
