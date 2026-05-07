import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Features',         href: '#features' },
    { label: 'How it works',     href: '#how-it-works' },
    { label: 'Specimens',        href: '#examples' },
    { label: 'Pricing',          href: '/pricing' },
  ],
  Company: [
    { label: 'About',   href: '#' },
    { label: 'Journal', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy',  href: '/privacy' },
    { label: 'Terms',    href: '/terms' },
    { label: 'Cookies',  href: '/cookies' },
  ],
};

export function LandingFooter() {
  return (
    <footer className="bg-paper border-t border-rule">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-14 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="font-display text-[20px] text-ink tracking-tight">
              Campaign<span className="display-italic text-ink-soft"> &amp; Co.</span>
            </Link>
            <p className="mt-5 text-[13px] text-ink-soft leading-relaxed max-w-[260px]">
              A field guide to thirty-day marketing campaigns. For small
              businesses that mean business.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="editorial-eyebrow mb-5">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-ink-soft hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-rule flex flex-col sm:flex-row items-baseline justify-between gap-3">
          <p className="text-[11px] text-ink-faint tracking-tight">
            &copy; {new Date().getFullYear()} Campaign &amp; Co. All rights reserved.
          </p>
          <p className="text-[11px] text-ink-faint italic">
            Set in Fraunces &amp; Inter Tight.
          </p>
          <a
            href="https://www.rls-solutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-ink-faint hover:text-ink transition-colors"
          >
            By RLS Solutions
          </a>
        </div>
      </div>
    </footer>
  );
}
