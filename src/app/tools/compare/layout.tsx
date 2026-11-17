import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare profiles',
  description: 'Two profiles side by side, with real share, fake share, score and engagement read down the middle and the gap marked on each.',
  openGraph: {
    title: 'Compare profiles · isshereal.com',
    description: 'Two profiles side by side, with real share, fake share, score and engagement read down the middle and the gap marked on each.',
    url: '/tools/compare',
    type: 'website',
  },
  alternates: { canonical: '/tools/compare' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
