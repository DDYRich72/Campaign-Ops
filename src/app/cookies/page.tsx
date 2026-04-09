import Link from 'next/link';

export const metadata = { title: 'Cookie Policy — Campaign Operator' };

export default function CookiesPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: April 9, 2026</p>

        <div className="prose prose-slate max-w-none space-y-10 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">1. What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site. Campaign Operator uses cookies to deliver a secure, functional, and improved experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Types of Cookies We Use</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">Strictly Necessary Cookies</h3>
                <p>
                  These cookies are essential for the platform to function. They enable core features like authentication, session management, and security. You cannot opt out of these cookies as they are required for the Service to operate.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mt-2">
                  <li>Authentication tokens (managed by Clerk)</li>
                  <li>Session identifiers</li>
                  <li>CSRF protection tokens</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">Functional Cookies</h3>
                <p>
                  These cookies remember your preferences and settings to personalize your experience, such as keeping you logged in between visits.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">Analytics Cookies</h3>
                <p>
                  We may use analytics tools to understand how users interact with Campaign Operator — which pages are visited most, where users drop off, and how features are used. This data is aggregated and anonymous and helps us improve the product.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Third-Party Cookies</h2>
            <p className="mb-3">Some third-party services we use may set their own cookies:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Clerk</strong> — sets cookies for authentication and session management</li>
              <li><strong>Stripe</strong> — sets cookies related to payment processing and fraud prevention</li>
              <li><strong>Vercel</strong> — may set cookies for performance and infrastructure purposes</li>
            </ul>
            <p className="mt-3">
              These third parties have their own cookie and privacy policies which govern their use of cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">4. How Long Cookies Last</h2>
            <p className="mb-3">Cookies are either session-based or persistent:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Session cookies</strong> — deleted automatically when you close your browser</li>
              <li><strong>Persistent cookies</strong> — remain on your device until they expire or you delete them. Authentication cookies typically expire after 30 days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Managing Cookies</h2>
            <p className="mb-3">
              You can control and delete cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>View what cookies are stored and delete them individually</li>
              <li>Block cookies from specific websites</li>
              <li>Block all third-party cookies</li>
              <li>Clear all cookies when you close your browser</li>
            </ul>
            <p className="mt-3">
              Please note that disabling necessary cookies will prevent you from logging in and using Campaign Operator. Refer to your browser&apos;s help documentation for instructions on managing cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy as our use of cookies evolves. Any material changes will be communicated via email or an in-app notice. Continued use of the Service after changes constitutes your acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">7. Contact</h2>
            <p>
              If you have questions about our use of cookies, contact us at{' '}
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
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
