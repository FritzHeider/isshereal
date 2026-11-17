import type { Metadata } from 'next';
import { getVerifiedCreator } from '@/data/verified-creators';
import { SAMPLE_REPORTS } from '@/data/content';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cleanHandle = id.replace(/^(ig_|instagram_|youtube_|tiktok_)/i, '').replace(/[^a-zA-Z0-9_.]/g, '').toLowerCase();

  const verified = getVerifiedCreator(cleanHandle);
  const sample = SAMPLE_REPORTS.find((r) => r.id.toLowerCase() === cleanHandle);
  const profile = verified || sample;

  const title = profile
    ? `Is @${cleanHandle} real? Real ${100 - profile.fakePct}%, fake ${profile.fakePct}%`
    : `Is @${cleanHandle} real?`;
  const description = profile
    ? `${profile.name}: ${100 - profile.fakePct}% of the audience is estimated as genuine and ${profile.fakePct}% look fake. Score ${profile.score}/100. A score is evidence about an audience, not a verdict on a person.`
    : `Check @${cleanHandle}’s audience from public numbers: see how much is genuine and how much looks fake.`;
  const og = profile
    ? `/api/og?handle=${cleanHandle}&score=${profile.score}&ghost=${profile.fakePct}`
    : `/api/og?handle=${cleanHandle}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://isshereal.com/report/${id}`,
      siteName: 'isshereal.com',
      images: [{ url: og, width: 1200, height: 630, alt: `Fake follower report for @${cleanHandle}` }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [og],
    },
  };
}

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
