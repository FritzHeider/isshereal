import type { Metadata } from 'next';

const DESCRIPTION =
  'Contact isshereal: questions about a report, removal requests, API limits, bugs, and security disclosures.';

export const metadata: Metadata = {
  title: 'Contact',
  description: DESCRIPTION,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact · isshereal.com',
    description: DESCRIPTION,
    url: 'https://isshereal.com/contact',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'isshereal.com contact form.' }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
