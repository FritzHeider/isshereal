import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SAMPLE_REPORTS } from '@/data/content';
import { Glyph, platformCode } from './darkroom/Glyph';
import { Wordmark } from './Navbar';

const INDEX = [
  {
    code: 'DR',
    title: 'Darkroom',
    links: [
      { label: 'Develop a profile', href: '/analyze' },
      { label: 'Contact sheet (bulk)', href: '/tools/bulk' },
      { label: 'Light box (compare)', href: '/tools/compare' },
      { label: 'Test strip (engagement)', href: '/tools/engagement-rate' },
      { label: 'Negative sleeve (hashtags)', href: '/tools/hashtags' },
    ],
  },
  {
    code: 'CS',
    title: 'Cases',
    links: [
      { label: 'Dating safety', href: '/use-cases/dating-safety' },
      { label: 'Marketplace buyers', href: '/use-cases/marketplace-buyers' },
      { label: 'Hiring freelancers', href: '/use-cases/hiring-freelancers' },
      { label: 'Influencer vetting', href: '/use-cases/influencer-vetting' },
    ],
  },
  {
    code: 'AR',
    title: 'Archive',
    links: [
      { label: 'Proof wall', href: '/top-creators' },
      { label: 'Your negatives', href: '/history' },
      { label: 'Darkroom shelf', href: '/resources' },
      { label: 'Technical publication (API)', href: '/api-docs' },
    ],
  },
  {
    code: 'LB',
    title: 'The lab',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export function Footer() {
  const strip = SAMPLE_REPORTS.slice(0, 8);
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" data-room="dark">
      <div className="site-footer__strip" aria-label="Recent example examinations">
        <ol role="list" className="filmstrip">
          {strip.map((r, i) => (
            <li key={r.id} className="filmstrip__frame">
              <Link href={`/report/${r.id}`} className="filmstrip__link">
                <span className="filmstrip__img">
                  <Image src={r.avatarImage} alt="" width={160} height={160} sizes="9rem" loading="lazy" />
                </span>
                <span className="filmstrip__code label">
                  {String(21 + i).padStart(2, '0')} ▸ {platformCode(r.platform)} ▸ <span className={r.fakePct > 50 ? 'text-cyan' : 'text-amber'}>{r.fakePct}% ghost</span>
                </span>
                <span className="sr-only">{r.handle}, {100 - r.fakePct}% developed, {r.fakePct}% ghost</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <div className="site-footer__body">
        <div className="site-footer__lead">
          <Link href="/" className="site-footer__mark" aria-label="isshereal.com, home">
            <Wordmark />
          </Link>
          <p className="site-footer__line">What’s real comes through. Everything else stays a ghost.</p>
          <Link href="/analyze" className="btn btn--safe">
            Develop a profile <Glyph name="arrow-right" size={18} />
          </Link>
        </div>

        <nav className="site-footer__index" aria-label="Site index">
          {INDEX.map((group) => (
            <div key={group.code} className="index-group">
              <h2 className="index-group__title">
                <span className="label text-safe">{group.code}</span>
                {group.title}
              </h2>
              <ul role="list">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="site-footer__legal">
        <p className="label">© {year} isshereal.com ▸ Emulsion 5063 ▸ Free, no login</p>
        <p className="site-footer__caveat">A score is evidence about an audience, not a verdict on a person. We only read public numbers.</p>
      </div>
    </footer>
  );
}
