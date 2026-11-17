import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { HomePageJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { SearchHero } from '@/components/direct/SearchHero';
import { FAQS, SAMPLE_REPORTS } from '@/data/content';

const TITLE = 'Free Fake Follower Checker — Check if any profile is real';
const DESCRIPTION =
  'Free fake follower and fake profile checker for Instagram, TikTok, YouTube, X, dating apps, marketplaces and freelancers. No sign-up, nothing locked. Results in about four seconds.';

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | isshereal.com` },
  description: DESCRIPTION,
  alternates: { canonical: 'https://isshereal.com' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://isshereal.com',
    siteName: 'isshereal.com',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'isshereal.com fake follower check: 33% real, 67% fake.' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/api/og'] },
};

const SIGNALS = [
  { title: 'Profile signals', text: 'No photo, no posts, random-letter usernames and brand-new accounts.' },
  { title: 'Behaviour signals', text: 'Following thousands of accounts, never posting, never engaging.' },
  { title: 'Growth signals', text: 'Followers that arrived in sudden bursts instead of steady growth.' },
];

const TOOLS = [
  { title: 'Bulk check', text: 'Paste a list of handles and check them all at once. Export as CSV.', href: '/tools/bulk' },
  { title: 'Compare profiles', text: 'Put two accounts side by side and see the difference.', href: '/tools/compare' },
  { title: 'Engagement rate', text: 'Compare an engagement rate to normal for that platform and size.', href: '/tools/engagement-rate' },
  { title: 'Hashtag analysis', text: 'See which hashtags are saturated or full of spam.', href: '/tools/hashtags' },
];

const CASES = [
  { title: 'Dating safety', text: 'Check a Tinder, Bumble or Hinge match for fake-profile patterns before you meet.', href: '/use-cases/dating-safety' },
  { title: 'Marketplace buyers', text: 'Make sure a seller’s following is real before you pay.', href: '/use-cases/marketplace-buyers' },
  { title: 'Hiring freelancers', text: 'Vet the social proof behind Fiverr and Upwork profiles.', href: '/use-cases/hiring-freelancers' },
  { title: 'Influencer vetting', text: 'Know an influencer’s real reach before you sponsor.', href: '/use-cases/influencer-vetting' },
];

const SAMPLE = SAMPLE_REPORTS.find((r) => r.id === 'lucamodels')!;
const EXAMPLES = ['maya', 'fittitan', 'alex']
  .map((id) => SAMPLE_REPORTS.find((r) => r.id === id))
  .filter((r): r is (typeof SAMPLE_REPORTS)[number] => Boolean(r));

function risk(fakePct: number) {
  if (fakePct >= 50) return { label: 'High fake-follower risk', tone: 'high' as const };
  if (fakePct >= 25) return { label: 'Some fake followers', tone: 'mid' as const };
  return { label: 'Looks real', tone: 'low' as const };
}

export default function Home() {
  const sampleRisk = risk(SAMPLE.fakePct);
  const realPct = 100 - SAMPLE.fakePct;

  return (
    <div className="dh">
      <HomePageJsonLd />
      <FaqJsonLd items={FAQS} />

      <div id="check">
        <SearchHero />
      </div>

      {/* Sample result */}
      <section className="dh-section" aria-labelledby="dh-sample-title">
        <div className="dh-wrap">
          <h2 id="dh-sample-title" className="dh-eyebrow">What you get — example report</h2>
          <article className="dh-report">
            <header className="dh-report__head">
              <div className="dh-report__who">
                <Image src={SAMPLE.avatarImage} alt="" width={48} height={48} className="dh-avatar" />
                <div>
                  <p className="dh-report__handle">{SAMPLE.handle}</p>
                  <p className="dh-report__meta">{SAMPLE.platform} · {SAMPLE.followers} · fictional example</p>
                </div>
              </div>
              <span className="dh-badge" data-tone={sampleRisk.tone}>{sampleRisk.label}</span>
            </header>

            <dl className="dh-metrics">
              <div className="dh-metric">
                <dt>Real followers</dt>
                <dd className="dh-metric__value" data-tone="low">{realPct}%</dd>
              </div>
              <div className="dh-metric">
                <dt>Fake followers</dt>
                <dd className="dh-metric__value" data-tone="high">{SAMPLE.fakePct}%</dd>
              </div>
              <div className="dh-metric">
                <dt>Engagement rate</dt>
                <dd className="dh-metric__value">{SAMPLE.engagementRate}</dd>
              </div>
              <div className="dh-metric">
                <dt>Audience score</dt>
                <dd className="dh-metric__value">{SAMPLE.score}<span className="dh-metric__unit">/100</span></dd>
              </div>
            </dl>

            <div className="dh-split" role="img" aria-label={`${realPct}% real followers, ${SAMPLE.fakePct}% fake followers`}>
              <span className="dh-split__real" style={{ width: `${realPct}%` }} />
              <span className="dh-split__fake" style={{ width: `${SAMPLE.fakePct}%` }} />
            </div>

            <div className="dh-report__lists">
              <div>
                <h3>Why it was flagged</h3>
                <ul role="list" className="dh-flags">
                  {SAMPLE.riskSignals.map((s) => (
                    <li key={s} data-tone="high">{s}</li>
                  ))}
                  <li data-tone="high">{SAMPLE.suspiciousSpike}</li>
                </ul>
              </div>
              <div>
                <h3>What looks normal</h3>
                <ul role="list" className="dh-flags">
                  {SAMPLE.verifiedSignals.map((s) => (
                    <li key={s} data-tone="low">{s}</li>
                  ))}
                </ul>
              </div>
            </div>
            <footer className="dh-report__foot">
              <Link href={`/report/${SAMPLE.id}`} className="dh-link">Open the full example report →</Link>
            </footer>
          </article>

          <ul role="list" className="dh-examples" aria-label="More example reports">
            {EXAMPLES.map((r) => {
              const rk = risk(r.fakePct);
              return (
                <li key={r.id}>
                  <Link href={`/report/${r.id}`} className="dh-example">
                    <Image src={r.avatarImage} alt="" width={40} height={40} className="dh-avatar" loading="lazy" />
                    <span className="dh-example__text">
                      <span className="dh-example__handle">{r.handle}</span>
                      <span className="dh-example__meta">{r.platform} · {r.followers}</span>
                    </span>
                    <span className="dh-badge dh-badge--sm" data-tone={rk.tone}>{r.fakePct}% fake</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="dh-section dh-section--tint" aria-labelledby="dh-how-title">
        <div className="dh-wrap">
          <h2 id="dh-how-title" className="dh-h2">What we look for</h2>
          <p className="dh-sub">
            We read what the profile shows anyone — followers, following, posts and engagement — and compare it to normal for an
            account that size.
          </p>
          <div className="dh-grid dh-grid--3">
            {SIGNALS.map((s) => (
              <div key={s.title} className="dh-card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <ol className="dh-steps" role="list">
            <li><b>1</b> Paste a handle or link</li>
            <li><b>2</b> We read public numbers</li>
            <li><b>3</b> Compare to accounts that size</li>
            <li><b>4</b> You get the score and reasons</li>
          </ol>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="dh-section" aria-labelledby="dh-tools-title">
        <div className="dh-wrap">
          <h2 id="dh-tools-title" className="dh-h2">More free tools</h2>
          <div className="dh-grid dh-grid--4">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="dh-card dh-card--link">
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <span className="dh-link">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="cases" className="dh-section dh-section--tint" aria-labelledby="dh-cases-title">
        <div className="dh-wrap">
          <h2 id="dh-cases-title" className="dh-h2">Check before you</h2>
          <div className="dh-grid dh-grid--4">
            {CASES.map((c) => (
              <Link key={c.href} href={c.href} className="dh-card dh-card--link">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <span className="dh-link">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="dh-section" aria-labelledby="dh-faq-title">
        <div className="dh-wrap dh-wrap--narrow">
          <h2 id="dh-faq-title" className="dh-h2">Questions</h2>
          <div className="dh-faq">
            {FAQS.map((f) => (
              <details key={f.q} className="dh-faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="dh-cta" aria-labelledby="dh-cta-title">
        <div className="dh-wrap dh-cta__inner">
          <h2 id="dh-cta-title">Check a profile now. Every result, free.</h2>
          <Link href="/#check" className="dh-btn dh-btn--light">Check a profile</Link>
        </div>
      </section>

    </div>
  );
}
