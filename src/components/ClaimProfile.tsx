import Link from 'next/link';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface ClaimProfileProps {
  handle: string;
  platform: string;
}

export function ClaimProfile({ handle, platform }: ClaimProfileProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-slate-700">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <ShieldCheck className="w-40 h-40 transform translate-x-1/4 -translate-y-1/4" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg">Own this account?</h3>
        </div>
        
        <p className="text-slate-300 mb-6 max-w-md text-sm md:text-base leading-relaxed">
          Claim this profile to unlock deeper insights, manage your public stats, and get a Verified Owner badge.
        </p>
        
        <Link href={`/contact?claim=${encodeURIComponent(handle)}&platform=${platform}`}>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2">
            Claim @{handle}
            <ExternalLink className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
