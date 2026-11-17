import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check a profile',
  description:
    'Paste any Instagram, TikTok, YouTube, dating, marketplace or freelance profile. We pull the public numbers and estimate how much of the audience is real: genuine followers count, bought ones stay as ghosts.',
  openGraph: {
    title: 'Check a profile · isshereal.com',
    description: 'Paste a profile and see how much of its audience is real.',
    url: 'https://isshereal.com/analyze',
  },
};

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
