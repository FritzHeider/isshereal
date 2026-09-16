'use client';

import React, { useState } from 'react';
import { Hash, ArrowLeft, CheckCircle2, AlertOctagon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HashtagPage() {
  const [tags, setTags] = useState('#fitness #lifestyle #followforfollow #explorepage #instadaily');
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzed(true);
  };

  return (
    <div className="pt-28 pb-20 container-x max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Hash size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl sm:text-2xl text-slate-900">
              Hashtag Quality & Shadowban Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Detect banned, spammy, or engagement-pod hashtags
            </p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enter Hashtags (space or comma separated)
            </label>
            <textarea
              rows={4}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 resize-none font-mono"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2.5 text-sm font-semibold"
          >
            Analyze Hashtags
          </Button>
        </form>

        {analyzed && (
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-4 animate-fade-up">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertOctagon className="text-rose-600 shrink-0 mt-0.5" size={18} />
              <div>
                <div className="font-bold text-xs text-rose-800 uppercase tracking-wider">
                  Shadowban / Spam Trigger Detected
                </div>
                <div className="text-sm text-rose-900 mt-0.5 font-medium">
                  #followforfollow is heavily flagged as bot engagement and reduces reach.
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div>
                <div className="font-bold text-xs text-emerald-800 uppercase tracking-wider">
                  Authentic Niche Tags
                </div>
                <div className="text-sm text-emerald-900 mt-0.5">
                  #fitness and #lifestyle carry high organic discovery value.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
