import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Light box',
  description: 'Two profiles side by side on one light box, with developed share, ghost share, score and engagement read down the middle and the gap marked on each.',
  openGraph: {
    title: 'Light box · isshereal.com',
    description: 'Two profiles side by side on one light box, with developed share, ghost share, score and engagement read down the middle and the gap marked on each.',
    url: '/tools/compare',
    type: 'website',
  },
  alternates: { canonical: '/tools/compare' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
