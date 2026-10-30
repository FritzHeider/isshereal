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
    ? `Is @${cleanHandle} real? Developed ${100 - profile.fakePct}%, ghost ${profile.fakePct}%`
    : `Is @${cleanHandle} real?`;
  const description = profile
    ? `${profile.name}: ${100 - profile.fakePct}% of the audience is estimated as genuine and ${profile.fakePct}% stayed as ghosts. Score ${profile.score}/100. A score is evidence about an audience, not a verdict on a person.`
    : `Develop @${cleanHandle}’s audience from public numbers: see how much comes through as genuine and how much stays a ghost.`;
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
      images: [{ url: og, width: 1200, height: 630, alt: `A developed print of @${cleanHandle}` }],
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
