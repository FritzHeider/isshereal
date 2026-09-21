import { Metadata } from 'next';
import Link from 'next/link';
import { VERIFIED_CREATORS } from '@/data/verified-creators';
import { cn } from '@/lib/utils';
import { ShieldCheck, Instagram, Youtube, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Top Verified Authentic Creators 2026 — isshereal.com',
  description: 'A curated list of the top ranked verified authentic creators across social media platforms.',
};

export default function TopCreatorsPage() {
  const creators = Object.entries(VERIFIED_CREATORS)
    .map(([handle, data]) => ({ ...data, handle }))
    .sort((a, b) => b.score - a.score);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="w-16 h-16 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            Top Verified Authentic Creators
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover creators who have passed our rigorous authenticity audits with the highest scores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator, index) => {
            const getScoreColor = (score: number) => {
              if (score >= 80) return 'text-emerald-500';
              if (score >= 60) return 'text-amber-500';
              return 'text-rose-500';
            };
            const scoreColorClass = getScoreColor(creator.score);

            return (
              <Link
                href={`/report/instagram_${creator.handle}`}
                key={creator.handle}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all block"
              >
                <div className="absolute top-4 right-4 text-4xl font-black text-slate-100 dark:text-slate-800 group-hover:text-emerald-50 dark:group-hover:text-emerald-900/20 transition-colors z-0">
                  #{index + 1}
                </div>
                
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                      {creator.name}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Instagram className="w-4 h-4" />
                      <span className="truncate">@{creator.handle}</span>
                    </div>
                    
                    <div className="mt-4 flex items-end gap-2">
                      <span className={cn("text-3xl font-black leading-none", scoreColorClass)}>
                        {creator.score}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium pb-1">
                        /100
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {creator.verdict}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
