import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalSheet, type Clause } from '@/components/library/LegalSheet';

const DESCRIPTION =
  'Privacy policy for isshereal.com: no credentials requested, public information only, history kept in your browser, and nothing sold to data brokers or advertisers.';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: DESCRIPTION,
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy policy · isshereal.com',
    description: DESCRIPTION,
    url: 'https://isshereal.com/privacy',
    type: 'article',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'The isshereal privacy data sheet.' }],
  },
};

const CLAUSES: Clause[] = [
  {
    id: 'pr-01',
    code: 'PR-01',
    title: 'Information we process',
    body: (
      <>
        <p>
          isshereal.com examines information that is already public on open platforms, including Instagram, TikTok,
          YouTube, X, Reddit and public marketplaces. That public information is:
        </p>
        <ul>
          <li>Public account handles, display names and profile descriptions.</li>
          <li>Public follower, following and post counts.</li>
          <li>Public engagement figures on public posts, such as likes, comments and view counts.</li>
          <li>Public timestamps of posts and comment activity.</li>
        </ul>
        <p>
          We do <strong>not</strong> access, collect or store private direct messages, stories restricted to close
          friends, payment card details, or passwords.
        </p>
      </>
    ),
  },
  {
    id: 'pr-02',
    code: 'PR-02',
    title: 'How we use public data',
    body: (
      <>
        <p>Public data read during an examination is processed only to:</p>
        <ul>
          <li>Compute authenticity scores, developed and ghost shares, and engagement figures.</li>
          <li>Look for patterns associated with automated engagement and bought followers.</li>
          <li>Produce the report you see on screen.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'pr-03',
    code: 'PR-03',
    title: 'Caching and storage in your browser',
    body: (
      <>
        <p>
          To keep the site fast and to avoid asking the platforms the same question again and again, finished reports
          for a handle are kept for a short time: in our server’s memory (the most recent 500 reports at most) and in
          Cloudflare’s shared cache for up to 24 hours. These copies hold only the public numbers and the result. In
          addition:
        </p>
        <ul>
          <li>
            <strong>Local history.</strong> The list on the <Link href="/history">History</Link> page is stored on
            your own computer or phone, in your browser’s <code>localStorage</code>. It is not stored on our
            servers.
          </li>
          <li>You can clear your local history at any time from the History page.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'pr-04',
    code: 'PR-04',
    title: 'Sharing with third parties',
    body: (
      <p>
        We do not sell, rent or otherwise make money from your searches, your IP address, or the handles you
        examine. None of it goes to data brokers, advertising exchanges or credit agencies.
      </p>
    ),
  },
  {
    id: 'pr-05',
    code: 'PR-05',
    title: 'Removal and cache purge requests',
    body: (
      <p>
        If you own a profile and want cached report summaries for your handle purged straight away, send a request
        through our <Link href="/contact">Contact page</Link>. Requests are processed within 48 business hours.
      </p>
    ),
  },
  {
    id: 'pr-06',
    code: 'PR-06',
    title: 'Contacting us about privacy',
    body: (
      <p>
        For legal questions, GDPR questions or CCPA rights requests, write to{' '}
        <a href="mailto:privacy@isshereal.com">privacy@isshereal.com</a>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalSheet
      frame="PR"
      publication="PR-1 Privacy"
      crumb="Privacy"
      titleId="privacy-title"
      title="Privacy policy"
      lede="isshereal.com was built on one rule: we never want, and never ask for, access to your private accounts or credentials."
      effective="September 2026"
      revision="October 2026, wording clarified. No commitment changed."
      notice={
        <dl className="legal-commitments">
          <div>
            <dt>No passwords, ever</dt>
            <dd>We never ask you to connect a social account, grant access, or type credentials.</dd>
          </div>
          <div>
            <dt>Public data only</dt>
            <dd>We only read what any ordinary web browser can already see.</dd>
          </div>
          <div>
            <dt>Nothing sold</dt>
            <dd>Your history stays in your own browser and is never sold to advertisers.</dd>
          </div>
        </dl>
      }
      clauses={CLAUSES}
    />
  );
}
