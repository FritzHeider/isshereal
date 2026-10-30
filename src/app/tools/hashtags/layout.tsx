import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Negative sleeve for hashtags',
  description: 'File a caption’s hashtags as strips in a sleeve. Engagement-bait tags come up as ghosts; broad and broken tags are marked. Reads text only.',
  openGraph: {
    title: 'Negative sleeve for hashtags · isshereal.com',
    description: 'File a caption’s hashtags as strips in a sleeve. Engagement-bait tags come up as ghosts; broad and broken tags are marked. Reads text only.',
    url: '/tools/hashtags',
    type: 'website',
  },
  alternates: { canonical: '/tools/hashtags' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
