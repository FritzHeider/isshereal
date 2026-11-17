import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bulk fake follower check',
  description: 'Paste up to 36 handles. Each one is checked in turn and the mostly-fake profiles are flagged. Export the results as CSV.',
  openGraph: {
    title: 'Bulk fake follower check · isshereal.com',
    description: 'Paste up to 36 handles. Each one is checked in turn and the mostly-fake profiles are flagged. Export the results as CSV.',
    url: '/tools/bulk',
    type: 'website',
  },
  alternates: { canonical: '/tools/bulk' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
