'use client';

import React from 'react';
import Link from 'next/link';
import { History as HistoryIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { SAMPLE_REPORTS } from '@/data/content';
import { ScoreGauge } from '@/components/ScoreGauge';
import { RiskBadge } from '@/components/RiskBadge';

export default function HistoryPage() {
  return (
    <div className="pt-28 pb-20 container-x max-w-4xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HistoryIcon size={18} />
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Audit History
            </h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Recently analyzed profiles and cached authenticity reports
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl divide-y divide-slate-100 overflow-hidden">
        {SAMPLE_REPORTS.map((report) => (
          <div
            key={report.id}
            className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl ${report.avatarColor} text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0`}
              >
                {report.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">
                    {report.name}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {report.platform}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {report.handle} · {report.followers}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 justify-between sm:justify-end">
              <div className="flex items-center gap-3">
                <ScoreGauge score={report.score} size={48} strokeWidth={6} />
                <div className="text-right">
                  <RiskBadge score={report.score} label={report.verdict} />
                  <div className="text-[11px] text-slate-500 mt-1">
                    {report.fakePct}% fake / inactive
                  </div>
                </div>
              </div>

              <Link
                href={`/report/${report.id}`}
                className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
