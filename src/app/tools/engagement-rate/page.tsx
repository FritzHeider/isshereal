'use client';

import React, { useState } from 'react';
import { Percent, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EngagementRatePage() {
  const [followers, setFollowers] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [rate, setRate] = useState<number | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const f = parseFloat(followers) || 1;
    const l = parseFloat(likes) || 0;
    const c = parseFloat(comments) || 0;
    const res = ((l + c) / f) * 100;
    setRate(parseFloat(res.toFixed(2)));
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
            <Percent size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl sm:text-2xl text-slate-900">
              Engagement Rate Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Benchmark real engagement against industry standards
            </p>
          </div>
        </div>

        <form onSubmit={calculate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Total Followers
            </label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              placeholder="e.g. 50000"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Average Likes
              </label>
              <input
                type="number"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                placeholder="e.g. 1200"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Average Comments
              </label>
              <input
                type="number"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="e.g. 45"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2.5 text-sm font-semibold mt-2"
          >
            Calculate Engagement Rate
          </Button>
        </form>

        {rate !== null && (
          <div className="mt-8 pt-6 border-t border-slate-100 animate-fade-up">
            <div className="bg-slate-50 rounded-2xl p-5 text-center">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Calculated Engagement Rate
              </div>
              <div className="font-extrabold text-4xl text-slate-900 mt-2">
                {rate}%
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium">
                {rate >= 1.5 ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={15} /> Healthy engagement for this audience size
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1">
                    <AlertTriangle size={15} /> Below industry average (likely bot/inactive audience)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
