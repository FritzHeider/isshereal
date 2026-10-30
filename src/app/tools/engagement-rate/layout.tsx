import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engagement rate test strip',
  description: 'Work out an engagement rate from followers, likes and comments, and see where it lands on a strip stepped for that audience size.',
  openGraph: {
    title: 'Engagement rate test strip · isshereal.com',
    description: 'Work out an engagement rate from followers, likes and comments, and see where it lands on a strip stepped for that audience size.',
    url: '/tools/engagement-rate',
    type: 'website',
  },
  alternates: { canonical: '/tools/engagement-rate' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
