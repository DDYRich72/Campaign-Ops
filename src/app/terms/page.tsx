import Link from 'next/link';

export const metadata = { title: 'Terms of Service — Campaign Operator' };

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: April 9, 2026</p>

        <div className="prose prose-slate max-w-none space-y-10 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using Campaign Operator (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. These terms apply to all users, including free and paid subscribers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Description of Service</h2>
            <p>
              Campaign Operator is an AI-powered marketing platform that helps small businesses create 30-day marketing campaigns, including strategy, content calendars, landing page copy, and email sequences. The Service is provided on a subscription basis with a free tier available.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Account Registration</h2>
            <p>
              You must create an account to use the Service. You agree to provide accurate information and keep your credentials secure. You are responsible for all activity that occurs under your account. Notify us immediately at support@campaignoperator.com if you suspect unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Subscriptions and Billing</h2>
            <p className="mb-3">
              Paid plans are billed monthly. By subscribing, you authorize us to charge your payment method on a recurring basis. All fees are in USD and are non-refundable except as required by law.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You may cancel your subscription at any time from your billing settings</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>We reserve the right to change pricing with 30 days&apos; notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
              <li>Generate content that is fraudulent, defamatory, or harmful</li>
              <li>Attempt to reverse-engineer, scrape, or exploit the platform</li>
              <li>Share account access with others outside your organization</li>
              <li>Use the Service to compete with Campaign Operator by building a similar product</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Intellectual Property</h2>
            <p className="mb-3">
              Campaign Operator and its underlying technology, branding, and design are owned by us and protected by intellectual property law.
            </p>
            <p>
              Content you generate using the Service belongs to you. You grant us a limited, non-exclusive license to process and store that content solely to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">7. AI-Generated Content</h2>
            <p>
              The Service uses AI to generate marketing content. You acknowledge that AI-generated content may not always be accurate, complete, or suitable for your specific use case. You are solely responsible for reviewing, editing, and approving any content before publishing or distributing it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">8. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or that any generated content will achieve specific business results.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Campaign Operator shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">10. Termination</h2>
            <p>
              We may suspend or terminate your account if you violate these Terms. You may delete your account at any time from your account settings. Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">11. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes by email or in-app notice. Continued use of the Service after changes take effect constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the United States. Any disputes shall be resolved through binding arbitration, except where prohibited by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">13. Contact</h2>
            <p>
              For questions about these Terms, contact us at{' '}
              <a href="mailto:legal@campaignoperator.com" className="text-violet-600 hover:underline">
                legal@campaignoperator.com
              </a>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-slate-200 mt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} Campaign Operator. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-slate-700 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
