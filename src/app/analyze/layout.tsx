import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Develop a profile',
  description:
    'Paste any Instagram, TikTok, YouTube, dating, marketplace or freelance profile. We pull the public numbers and develop the audience: genuine followers come through, bought ones stay as ghosts.',
  openGraph: {
    title: 'Develop a profile · isshereal.com',
    description: 'Paste a profile and see what comes through.',
    url: 'https://isshereal.com/analyze',
  },
};

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
