'use client';

import React, { useState } from 'react';
import { GitCompareArrows, ArrowLeft, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ProgressBar } from '@/components/ProgressBar';
import { getVerifiedCreator } from '@/data/verified-creators';

export default function ComparePage() {
  const [profileA, setProfileA] = useState('@nike');
  const [profileB, setProfileB] = useState('@natgeo');
  const [compared, setCompared] = useState(true);

  const getScoreData = (handleStr: string, fallbackScore: number) => {
    const clean = handleStr.replace(/^@/, '').toLowerCase().trim();
    const v = getVerifiedCreator(clean);
    if (v) {
      const isGood = (v.verified || v.followers > 100000);
      const score = clean === 'lucamodels' ? 31 : (clean === 'alex_travels' ? 22 : 94);
      const real = score > 80 ? 95 : 35;
      return {
        name: v.name,
        handle: v.handle,
        followers: v.followers.toLocaleString(),
        score,
        realPct: real,
        fakePct: 100 - real,
        verdict: score >= 75 ? 'Likely Authentic' : 'High Risk',
        isGood: score >= 75,
      };
    }
    return {
      name: handleStr,
      handle: handleStr,
      followers: 'Audited Profile',
      score: fallbackScore,
      realPct: fallbackScore > 60 ? 85 : 40,
      fakePct: fallbackScore > 60 ? 15 : 60,
      verdict: fallbackScore >= 75 ? 'Likely Authentic' : 'High Risk',
      isGood: fallbackScore >= 75,
    };
  };

  const dataA = getScoreData(profileA, 88);
  const dataB = getScoreData(profileB, 92);

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
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-3">
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

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold">
            <span className="text-emerald-400">⚡</span>
            <span>Live Web-Use Telemetry</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Comparison Presets:</span>
          {[
            { label: 'Nike vs NatGeo', a: '@nike', b: '@natgeo' },
            { label: 'MrBeast vs Luca', a: '@mrbeast', b: '@lucamodels' },
            { label: 'Figma vs Nike', a: '@figma', b: '@nike' },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setProfileA(p.a);
                setProfileB(p.b);
                setCompared(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2.5 text-sm font-semibold shadow-md shadow-emerald-600/20"
            >
              Compare Profiles
            </Button>
          </div>
        </form>

        {compared && (
          <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 animate-fade-up">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-slate-900 text-base">{dataA.name}</div>
                  <span className="text-xs font-mono text-slate-500">{dataA.handle}</span>
                </div>
                <div className="text-xs text-slate-500 mb-4">{dataA.followers}</div>
                <div className="flex items-center gap-4 mb-4">
                  <ScoreGauge score={dataA.score} size={76} strokeWidth={8} />
                  <div>
                    <div className={`text-xs font-bold ${dataA.isGood ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {dataA.verdict}
                    </div>
                    <div className="text-xs text-slate-500">{dataA.score}/100 Health score</div>
                  </div>
                </div>
                <ProgressBar label="Real Followers" pct={dataA.realPct} color="#059669" />
                <div className="mt-2">
                  <ProgressBar label="Fake / Inactive" pct={dataA.fakePct} color="#f43f5e" />
                </div>
              </div>

              <Link
                href={`/analyze?handle=${encodeURIComponent(dataA.handle.replace('@', ''))}`}
                className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
              >
                <span>Full Audit Report</span>
                <ExternalLink size={12} />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-slate-900 text-base">{dataB.name}</div>
                  <span className="text-xs font-mono text-slate-500">{dataB.handle}</span>
                </div>
                <div className="text-xs text-slate-500 mb-4">{dataB.followers}</div>
                <div className="flex items-center gap-4 mb-4">
                  <ScoreGauge score={dataB.score} size={76} strokeWidth={8} />
                  <div>
                    <div className={`text-xs font-bold ${dataB.isGood ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {dataB.verdict}
                    </div>
                    <div className="text-xs text-slate-500">{dataB.score}/100 Health score</div>
                  </div>
                </div>
                <ProgressBar label="Real Followers" pct={dataB.realPct} color="#059669" />
                <div className="mt-2">
                  <ProgressBar label="Fake / Inactive" pct={dataB.fakePct} color="#f43f5e" />
                </div>
              </div>

              <Link
                href={`/analyze?handle=${encodeURIComponent(dataB.handle.replace('@', ''))}`}
                className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
              >
                <span>Full Audit Report</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
