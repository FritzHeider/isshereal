import type { Metadata } from 'next';

const DESCRIPTION =
  'The negative archive: every examination you run on isshereal is filed here, in this browser only, with its date, frame number and developed share.';

export const metadata: Metadata = {
  title: 'History: the negative archive',
  description: DESCRIPTION,
  alternates: { canonical: '/history' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'History: the negative archive · isshereal.com',
    description: DESCRIPTION,
    url: 'https://isshereal.com/history',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Negative sleeves in an archive binder.' }],
  },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
