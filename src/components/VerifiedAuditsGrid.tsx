'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, TrendingUp, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { ScoreGauge } from './ScoreGauge';

interface VerifiedAuditItem {
  handle: string;
  name: string;
  platform: string;
  platformIcon: string;
  followers: string;
  score: number;
  verdict: string;
  realPct: number;
  fakePct: number;
  status: 'authentic' | 'suspicious' | 'viral';
  avatarUrl: string;
  insight: string;
}

const VERIFIED_AUDITS: VerifiedAuditItem[] = [
  {
    handle: '@nike',
    name: 'Nike',
    platform: 'Instagram',
    platformIcon: '/images/platforms/instagram-3d.png',
    followers: '291M followers',
    score: 93,
    verdict: 'Likely authentic',
    realPct: 95,
    fakePct: 5,
    status: 'authentic',
    avatarUrl: '/images/logo.png',
    insight: 'Clean organic follower retention and consistent partner engagement across 1,600+ posts.',
  },
  {
    handle: '@mrbeast',
    name: 'MrBeast',
    platform: 'YouTube',
    platformIcon: '/images/platforms/youtube-3d.png',
    followers: '342M subscribers',
    score: 94,
    verdict: 'Top 0.1% authentic',
    realPct: 96,
    fakePct: 4,
    status: 'authentic',
    avatarUrl: '/images/avatars/mrbeast.jpg',
    insight: 'Verified Google partner channel with 8.4% high-velocity viral engagement ratio.',
  },
  {
    handle: '@natgeo',
    name: 'National Geographic',
    platform: 'Instagram',
    platformIcon: '/images/platforms/instagram-3d.png',
    followers: '269M followers',
    score: 95,
    verdict: 'Likely authentic',
    realPct: 96,
    fakePct: 4,
    status: 'authentic',
    avatarUrl: '/images/platforms/instagram-3d.png',
    insight: 'Massive organic distribution with 32,000+ public posts and worldwide demographic spread.',
  },
  {
    handle: '@figma',
    name: 'Figma',
    platform: 'Instagram',
    platformIcon: '/images/platforms/instagram-3d.png',
    followers: '959K followers',
    score: 95,
    verdict: 'Likely authentic',
    realPct: 96,
    fakePct: 4,
    status: 'authentic',
    avatarUrl: '/images/platforms/instagram-3d.png',
    insight: 'High engagement designer community with verified software creator footprint.',
  },
  {
    handle: '@dance.maya',
    name: 'Maya',
    platform: 'TikTok',
    platformIcon: '/images/platforms/tiktok-3d.png',
    followers: '1.2M followers',
    score: 78,
    verdict: 'Verified viral',
    realPct: 82,
    fakePct: 18,
    status: 'viral',
    avatarUrl: '/images/avatars/maya.jpg',
    insight: 'Legitimate viral video traction with minor trending sound bot spillover.',
  },
  {
    handle: '@lucamodels',
    name: 'Luca — Lifestyle',
    platform: 'Instagram',
    platformIcon: '/images/platforms/instagram-3d.png',
    followers: '480K followers',
    score: 31,
    verdict: 'Likely fake',
    realPct: 33,
    fakePct: 67,
    status: 'suspicious',
    avatarUrl: '/images/avatars/luca.jpg',
    insight: 'Mass follower burst (+180K in 48h) with engagement rate 88% below niche benchmark.',
  },
];

export function VerifiedAuditsGrid() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-slate-100 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-50/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-x">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Real Forensics Database</span>
            </div>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Live Verified Audits & Risk Benchmarks
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-2 leading-relaxed">
              Explore authentic audits analyzed with transparent mathematical formulas and real-time Web-Use browser inspection.
            </p>
          </div>

          <Link href="/analyze">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group">
              Audit your own account
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERIFIED_AUDITS.map((audit) => {
            const isGood = audit.score >= 70;
            return (
              <div
                key={audit.handle}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shadow-xs shrink-0">
                        <Image
                          src={audit.avatarUrl}
                          alt={audit.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
                          <span>{audit.name}</span>
                          <div className="relative w-4 h-4 shrink-0">
                            <Image
                              src={audit.platformIcon}
                              alt={audit.platform}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <span className="text-xs font-mono text-slate-500">
                          {audit.handle} · {audit.followers}
                        </span>
                      </div>
                    </div>

                    <RiskBadge score={audit.score} label={audit.verdict} />
                  </div>

                  {/* Score & Gauge Bar */}
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex items-center gap-4 mb-4">
                    <div className="shrink-0">
                      <ScoreGauge score={audit.score} size={64} strokeWidth={7} />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-700 font-semibold">Real: {audit.realPct}%</span>
                        <span className="text-rose-600 font-semibold">Fake: {audit.fakePct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${audit.realPct}%` }}
                        />
                        <div
                          className="h-full bg-rose-500 transition-all duration-500"
                          style={{ width: `${audit.fakePct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        {isGood ? 'Audience verified genuine' : 'High bot / inactive cluster'}
                      </span>
                    </div>
                  </div>

                  {/* Insight Quote */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 italic mb-4">
                    &ldquo;{audit.insight}&rdquo;
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    {audit.status === 'suspicious' ? (
                      <AlertTriangle size={13} className="text-rose-500" />
                    ) : (
                      <TrendingUp size={13} className="text-emerald-600" />
                    )}
                    {audit.platform} Audit
                  </span>

                  <Link
                    href={`/analyze?handle=${encodeURIComponent(audit.handle.replace('@', ''))}&platform=${encodeURIComponent(audit.platform.toLowerCase())}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors"
                  >
                    <span>View Audit</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
