import type { Metadata } from 'next';
import Link from 'next/link';
import { Glyph } from '@/components/darkroom/Glyph';
import { LegalSheet, type Clause } from '@/components/library/LegalSheet';

const DESCRIPTION =
  'Terms of service for isshereal.com: what the scores are, what they are not, acceptable use, and the limits of our liability.';

export const metadata: Metadata = {
  title: 'Terms of service',
  description: DESCRIPTION,
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of service · isshereal.com',
    description: DESCRIPTION,
    url: 'https://isshereal.com/terms',
    type: 'article',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'The isshereal terms of service data sheet.' }],
  },
};

const CLAUSES: Clause[] = [
  {
    id: 'tm-01',
    code: 'TM-01',
    title: 'Acceptance of terms',
    body: (
      <p>
        By visiting, browsing or using isshereal.com (the “Service”, “we”, “us”), you confirm that you have read,
        understood and agree to these Terms of Service and our <Link href="/privacy">Privacy Policy</Link>. If you
        disagree with any part of these terms, you must stop using the Service.
      </p>
    ),
  },
  {
    id: 'tm-02',
    code: 'TM-02',
    title: 'What the Service does, and its method',
    body: (
      <>
        <p>
          isshereal.com analyses publicly available social media profiles, public creator figures and online
          listings by computer. You acknowledge that:
        </p>
        <ul>
          <li>
            Authenticity scores come from statistical estimates over public numbers and are subject to error. The
            full method is published on the <Link href="/about#what-a-score-shows">About</Link> page.
          </li>
          <li>
            Platform changes, platform access rules and the conditions for reading public pages can affect whether
            current data is available.
          </li>
          <li>
            You alone are responsible for any decision, contract, purchase or meeting you enter into with anyone you
            examine using the Service.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'tm-03',
    code: 'TM-03',
    title: 'Acceptable use',
    body: (
      <>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Harass, defame, bully, dox or direct hate speech at any person or creator.</li>
          <li>
            Run bots, spiders or scrapers against our API in a way that degrades the Service or breaks its rate
            limits.
          </li>
          <li>Resell, white-label or redistribute reports without a written commercial agreement with us.</li>
          <li>Present a score as an official finding of any government or law enforcement body.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'tm-04',
    code: 'TM-04',
    title: 'A free public tool, and its availability',
    body: (
      <>
        <p>
          isshereal.com is currently provided free of charge. No payment, card or subscription is needed to use the
          core examination.
        </p>
        <ul>
          <li>We may change, adjust or improve features and rate limits at our discretion.</li>
          <li>Fair use rules apply, to prevent abusive automated traffic, scraping attacks or deliberate damage to the Service.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'tm-05',
    code: 'TM-05',
    title: 'Intellectual property',
    body: (
      <p>
        All algorithms, interface code, visual identity, graphics and documentation are the exclusive intellectual
        property of isshereal.com. All rights reserved.
      </p>
    ),
  },
  {
    id: 'tm-06',
    code: 'TM-06',
    title: 'Limitation of liability',
    body: (
      <p>
        To the fullest extent the law allows, isshereal.com and its affiliates are not liable for any direct,
        indirect, incidental or consequential damages arising from business decisions, sponsorship spending, or
        personal meetings arranged with people you examined.
      </p>
    ),
  },
  {
    id: 'tm-07',
    code: 'TM-07',
    title: 'Changes to these terms',
    body: (
      <p>
        We may revise these terms at any time. If you keep using the Service after revised terms are posted, you
        accept the revised terms.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalSheet
      frame="TM"
      publication="TM-1 Terms"
      crumb="Terms"
      titleId="terms-title"
      title="Terms of service"
      lede="Please read these terms before using isshereal.com and its examination tools."
      effective="September 2026"
      revision="October 2026, wording clarified. No obligation changed."
      notice={
        <div className="legal-caution" role="note" aria-labelledby="terms-caution-title">
          <Glyph name="warning" size={22} />
          <div>
            <p id="terms-caution-title" className="legal-caution__title">
              Read this first
            </p>
            <p>
              Scores and verdicts from isshereal.com are statistical estimates made from public web data. They are
              meant for research, risk assessment and entertainment. They are not legal proof and not a financial
              guarantee. A score is evidence about an audience, not a verdict on a person.
            </p>
          </div>
        </div>
      }
      clauses={CLAUSES}
    />
  );
}
