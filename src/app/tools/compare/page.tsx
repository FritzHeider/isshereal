'use client';

import React, { useState } from 'react';
import { GitCompareArrows, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ProgressBar } from '@/components/ProgressBar';

export default function ComparePage() {
  const [profileA, setProfileA] = useState('@creator_one');
  const [profileB, setProfileB] = useState('@creator_two');
  const [compared, setCompared] = useState(false);

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    setCompared(true);
  };

  return (
    <div className="pt-28 pb-20 container-x max-w-4xl">
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
            <GitCompareArrows size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl sm:text-2xl text-slate-900">
              Profile Comparison
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Compare two profiles head-to-head to determine audience health
            </p>
          </div>
        </div>

        <form onSubmit={handleCompare} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Profile A
            </label>
            <input
              type="text"
              value={profileA}
              onChange={(e) => setProfileA(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Profile B
            </label>
            <input
              type="text"
              value={profileB}
              onChange={(e) => setProfileB(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2.5 text-sm font-semibold"
            >
              Compare Profiles
            </Button>
          </div>
        </form>

        {compared && (
          <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 animate-fade-up">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
              <div className="font-bold text-slate-900 mb-3">{profileA}</div>
              <div className="flex items-center gap-4 mb-4">
                <ScoreGauge score={84} size={76} strokeWidth={8} />
                <div>
                  <div className="text-xs font-semibold text-emerald-700">
                    Likely Authentic
                  </div>
                  <div className="text-xs text-slate-500">84/100 Health score</div>
                </div>
              </div>
              <ProgressBar label="Real Followers" pct={88} color="#059669" />
              <div className="mt-2">
                <ProgressBar label="Fake / Inactive" pct={12} color="#f43f5e" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
              <div className="font-bold text-slate-900 mb-3">{profileB}</div>
              <div className="flex items-center gap-4 mb-4">
                <ScoreGauge score={39} size={76} strokeWidth={8} />
                <div>
                  <div className="text-xs font-semibold text-rose-600">
                    High Risk
                  </div>
                  <div className="text-xs text-slate-500">39/100 Health score</div>
                </div>
              </div>
              <ProgressBar label="Real Followers" pct={42} color="#059669" />
              <div className="mt-2">
                <ProgressBar label="Fake / Inactive" pct={58} color="#f43f5e" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
