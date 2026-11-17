import React from 'react';
import Link from 'next/link';

/**
 * Header and footer for the search-first homepage.
 * The global darkroom header/footer are hidden on pages that render these
 * (see `body:has(.dh)` in src/styles/pages/direct.css).
 */

const NAV = [
  { label: 'How it works', href: '/#how' },
  { label: 'Free tools', href: '/#tools' },
  { label: 'Use cases', href: '/#cases' },
  { label: 'FAQ', href: '/#faq' },
];

export function DirectHeader() {
  return (
    <header className="dh-header">
      <div className="dh-wrap dh-header__bar">
        <Link href="/" className="dh-logo" aria-label="isshereal.com, home">
          isshereal
        </Link>
        <nav aria-label="Primary" className="dh-nav">
          <ul role="list">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/#check" className="dh-btn dh-btn--dark dh-header__cta">
          Check a profile
        </Link>
        <details className="dh-menu">
          <summary aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <nav aria-label="Primary, mobile" className="dh-menu__sheet">
            <ul role="list">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/analyze">Advanced check</Link>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}

const FOOTER_LINKS = [
  {
    title: 'Check',
    links: [
      { label: 'Fake follower check', href: '/analyze' },
      { label: 'Bulk check', href: '/tools/bulk' },
      { label: 'Compare profiles', href: '/tools/compare' },
      { label: 'Engagement rate', href: '/tools/engagement-rate' },
      { label: 'Hashtag analysis', href: '/tools/hashtags' },
    ],
  },
  {
    title: 'Use cases',
    links: [
      { label: 'Dating safety', href: '/use-cases/dating-safety' },
      { label: 'Marketplace buyers', href: '/use-cases/marketplace-buyers' },
      { label: 'Hiring freelancers', href: '/use-cases/hiring-freelancers' },
      { label: 'Influencer vetting', href: '/use-cases/influencer-vetting' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Example reports', href: '/top-creators' },
      { label: 'Your past checks', href: '/history' },
      { label: 'Resources', href: '/resources' },
      { label: 'API', href: '/api-docs' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export function DirectFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="dh-footer">
      <div className="dh-wrap dh-footer__grid">
        <div className="dh-footer__lead">
          <Link href="/" className="dh-logo">isshereal</Link>
          <p>Free fake follower and fake profile checker. No account, no card, nothing locked.</p>
        </div>
        {FOOTER_LINKS.map((g) => (
          <nav key={g.title} aria-label={g.title} className="dh-footer__col">
            <h2>{g.title}</h2>
            <ul role="list">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="dh-wrap dh-footer__legal">
        <span>A score is evidence about an audience, not a verdict on a person.</span>
        <span>© {year} isshereal.com</span>
      </div>
    </footer>
  );
}
