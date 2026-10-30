import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact sheet printer',
  description: 'Paste up to 36 handles. Each becomes a frame on a contact sheet, is examined in turn, and the mostly-ghost frames are marked. Export the sheet as CSV.',
  openGraph: {
    title: 'Contact sheet printer · isshereal.com',
    description: 'Paste up to 36 handles. Each becomes a frame on a contact sheet, is examined in turn, and the mostly-ghost frames are marked. Export the sheet as CSV.',
    url: '/tools/bulk',
    type: 'website',
  },
  alternates: { canonical: '/tools/bulk' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
