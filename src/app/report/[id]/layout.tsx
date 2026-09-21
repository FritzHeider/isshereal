import type { Metadata } from 'next';
import { getVerifiedCreator } from '@/data/verified-creators';
import { SAMPLE_REPORTS } from '@/data/content';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cleanHandle = id.replace(/^(ig_|instagram_|youtube_|tiktok_)/i, '').toLowerCase();
  
  const verified = getVerifiedCreator(cleanHandle);
  const sample = SAMPLE_REPORTS.find(r => r.id.toLowerCase() === cleanHandle);
  const profile = verified || sample;
  
  const title = profile 
    ? `Is @${cleanHandle} Real? Score: ${profile.score}/100 — isshereal.com`
    : `@${cleanHandle} Authenticity Audit — isshereal.com`;
  const description = profile
    ? `${profile.name} scored ${profile.score}/100 on our authenticity audit. ${profile.verdict}. Fake follower rate: ${profile.fakePct}%.`
    : `Full authenticity audit for @${cleanHandle}. Check for fake followers, bots, and scams.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://isshereal.com/report/${id}`,
      siteName: 'isshereal.com',
      images: [{ url: `/api/og?handle=${cleanHandle}&score=${profile?.score || 50}`, width: 1200, height: 630 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?handle=${cleanHandle}&score=${profile?.score || 50}`],
    },
  };
}

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
