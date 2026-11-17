import type { Metadata } from 'next';

const DESCRIPTION =
  'Your past checks: every check you run on isshereal is filed here, in this browser only, with its date and real-follower share.';

export const metadata: Metadata = {
  title: 'Your past checks',
  description: DESCRIPTION,
  alternates: { canonical: '/history' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Your past checks · isshereal.com',
    description: DESCRIPTION,
    url: 'https://isshereal.com/history',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'A list of past profile checks.' }],
  },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
