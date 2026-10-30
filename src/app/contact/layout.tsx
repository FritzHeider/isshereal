import type { Metadata } from 'next';

const DESCRIPTION =
  'Write to the isshereal darkroom: questions about a report, removal requests, API limits, bugs, and security disclosures.';

export const metadata: Metadata = {
  title: 'Contact: an envelope for prints',
  description: DESCRIPTION,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact: an envelope for prints · isshereal.com',
    description: DESCRIPTION,
    url: 'https://isshereal.com/contact',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'A print envelope with labelled fields.' }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
