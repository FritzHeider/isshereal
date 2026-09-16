'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SAMPLE_REPORTS, SampleReport } from '@/data/content';
import { ScoreGauge } from './ScoreGauge';
import { RiskBadge } from './RiskBadge';
import { ProgressBar } from './ProgressBar';
import { Button } from './ui/button';
import {
  ArrowRight,
  Sparkles,
  Eye,
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

const FILTER_TABS = ['All', 'Instagram', 'TikTok', 'YouTube', 'Hinge', 'Marketplace', 'Freelance'];

export function SampleReports() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeModalReport, setActiveModalReport] = useState<SampleReport | null>(null);

  const filteredReports =
    selectedFilter === 'All'
      ? SAMPLE_REPORTS
      : SAMPLE_REPORTS.filter((r) =>
          r.platform.toLowerCase().includes(selectedFilter.toLowerCase())
        );

  return (
    <section id="samples" className="py-24 bg-slate-50/60 border-t border-slate-100">
      <div className="container-x">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Sample reports
            </span>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2 tracking-tight">
              See what an audit looks like
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Real, mixed results — from clean top creators to obvious bot farms and romance scams.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  selectedFilter === tab
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group relative"
            >
              <div>
                {/* Header with Photo Avatar & Platform Badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-xs border border-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                      <Image
                        src={report.avatarImage}
                        alt={report.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {report.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">
                        {report.handle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {report.platform}
                  </span>
                </div>

                {/* Score and Gauge Box */}
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 my-4">
                  <ScoreGauge score={report.score} size={64} strokeWidth={8} />
                  <div className="text-right">
                    <RiskBadge score={report.score} label={report.verdict} />
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {report.followers}
                    </p>
                  </div>
                </div>

                {/* Fake/Inactive percentage */}
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Audience Risk:</span>
                  <span
                    className={`font-bold ${
                      report.fakePct > 50 ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {report.fakePct}% fake / inactive
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalReport(report)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <Eye size={13} />
                  <span>Quick view</span>
                </button>

                <Link
                  href={`/report/${report.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <span>Full report</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Quick View Modal */}
        {activeModalReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-up">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative">
              {/* Modal Header */}
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-700">
                    <Image
                      src={activeModalReport.avatarImage}
                      alt={activeModalReport.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {activeModalReport.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {activeModalReport.handle} · {activeModalReport.platform}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalReport(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <ScoreGauge score={activeModalReport.score} size={72} strokeWidth={8} />
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase">
                        Quality Verdict
                      </div>
                      <div className="font-bold text-base text-slate-900 mt-0.5">
                        {activeModalReport.verdict}
                      </div>
                    </div>
                  </div>
                  <RiskBadge score={activeModalReport.score} label={activeModalReport.verdict} />
                </div>

                <div className="space-y-3">
                  <ProgressBar
                    label="Real Followers"
                    pct={100 - activeModalReport.fakePct}
                    color="#059669"
                  />
                  <ProgressBar
                    label="Fake / Inactive"
                    pct={activeModalReport.fakePct}
                    color="#f43f5e"
                  />
                </div>

                {/* Signals */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Audience Anomaly Signals
                  </div>
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-950 space-y-1">
                    {activeModalReport.riskSignals.map((sig, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <AlertTriangle size={13} className="text-rose-600 shrink-0 mt-0.5" />
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Calculated via isshereal forensic v2.4
                  </span>
                  <Link href={`/report/${activeModalReport.id}`}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs">
                      Open Dedicated Audit Page
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
