import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hashtag checker',
  description: 'Paste a caption’s hashtags. Engagement-bait tags are flagged; broad and broken tags are marked. Reads text only.',
  openGraph: {
    title: 'Hashtag checker · isshereal.com',
    description: 'Paste a caption’s hashtags. Engagement-bait tags are flagged; broad and broken tags are marked. Reads text only.',
    url: '/tools/hashtags',
    type: 'website',
  },
  alternates: { canonical: '/tools/hashtags' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
