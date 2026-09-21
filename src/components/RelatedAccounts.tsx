import Link from 'next/link';
import { SAMPLE_REPORTS } from '@/data/content';
import { VERIFIED_CREATORS } from '@/data/verified-creators';
import { User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RelatedAccountsProps {
  currentHandle: string;
  currentPlatform: string;
}

export function RelatedAccounts({ currentHandle, currentPlatform }: RelatedAccountsProps) {
  // Combine all profiles to find related ones
  const allProfiles = [
    ...SAMPLE_REPORTS.map(r => ({ ...r, handle: r.id })),
    ...Object.entries(VERIFIED_CREATORS).map(([handle, data]) => ({ ...data, handle }))
  ];
  
  // Clean handle for comparison
  const cleanCurrentHandle = currentHandle.replace(/^(ig_|instagram_|youtube_|tiktok_)/i, '').toLowerCase();

  const related = allProfiles
    .filter(p => p.handle.toLowerCase() !== cleanCurrentHandle)
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Related Accounts You May Want to Check
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map(profile => {
          const scoreColor = profile.score >= 75 ? 'text-emerald-500' : profile.score >= 50 ? 'text-amber-500' : 'text-rose-500';
          
          return (
            <Link 
              key={profile.handle} 
              href={`/report/${profile.handle}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition-shadow group flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {profile.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    @{profile.handle}
                  </div>
                </div>
              </div>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-2xl font-black", scoreColor)}>
                    {profile.score}
                  </span>
                  <span className="text-xs text-slate-500">/100</span>
                </div>
                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Audit <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
