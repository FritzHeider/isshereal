'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Share2,
  Download,
  Copy,
  Check,
  Activity,
  UserX,
  Clock,
} from 'lucide-react';
import { SAMPLE_REPORTS } from '@/data/content';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ProgressBar } from '@/components/ProgressBar';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';

export default function ReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const reportId = (params.id as string) || 'lucamodels';
  const customHandle = searchParams.get('handle');

  const [copied, setCopied] = useState(false);

  const report =
    SAMPLE_REPORTS.find((r) => r.id === reportId) ||
    SAMPLE_REPORTS.find((r) => r.id === 'lucamodels')!;

  const displayName = customHandle ? `@${customHandle}` : report.name;
  const displayHandle = customHandle ? `@${customHandle}` : report.handle;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="pt-28 pb-24 container-x max-w-5xl">
      {/* Top Breadcrumb & Share Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Overview
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="rounded-full text-xs gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="rounded-full text-xs gap-1.5 cursor-pointer"
          >
            <Download size={13} />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Dark Header Strip with Photo Avatar */}
        <div className="bg-slate-900 px-6 sm:px-8 py-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-700 shrink-0">
              <Image
                src={report.avatarImage}
                alt={displayName}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl sm:text-2xl text-white">
                  {displayName}
                </h1>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                  {report.platform}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
                {displayHandle} · {report.followers}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <RiskBadge score={report.score} label={report.verdict} />
          </div>
        </div>

        {/* Score & Visualizer Core */}
        <div className="p-6 sm:p-8 grid md:grid-cols-12 gap-8 items-center border-b border-slate-100">
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Overall Authenticity Score
            </span>
            <ScoreGauge score={report.score} size={148} strokeWidth={15} />
            <div className="mt-4">
              <RiskBadge score={report.score} label={report.verdict} />
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Audience Modeling & Retention Plausibility
            </h3>
            <ProgressBar
              label="Genuine, Active Followers"
              pct={100 - report.fakePct}
              color="#059669"
              height="h-3"
            />
            <ProgressBar
              label="Fake, Mass Followers & Inactive Bots"
              pct={report.fakePct}
              color="#f43f5e"
              height="h-3"
            />

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3 text-xs text-slate-700 font-medium mt-3">
              <TrendingUp
                size={16}
                className={report.score >= 75 ? 'text-emerald-600 shrink-0' : 'text-rose-500 shrink-0'}
              />
              <span>{report.suspiciousSpike}</span>
            </div>
          </div>
        </div>

        {/* Forensic Signal Matrix */}
        <div className="p-6 sm:p-8 grid sm:grid-cols-3 gap-4 border-b border-slate-100 bg-slate-50/40">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Engagement Rate
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {report.engagementRate}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {report.score >= 75 ? 'Above industry benchmark' : 'Severely under-indexed'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Bot Risk Index
            </div>
            <div
              className={`text-xl font-extrabold ${
                report.fakePct > 50 ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {report.fakePct}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Estimated synthetic audience
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Audit Engine
            </div>
            <div className="text-xl font-extrabold text-emerald-600 flex items-center gap-1">
              <span>v2.4 Pro</span>
              <ShieldCheck size={18} />
            </div>
            <div className="text-xs text-slate-500 mt-1">
              High confidence verdict
            </div>
          </div>
        </div>

        {/* AI Verdict & Red Flags */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
            <Sparkles size={20} className="text-emerald-600" />
            <span>AI Forensic Audit Verdict</span>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100 text-slate-700 text-sm leading-relaxed">
            {report.score >= 75 ? (
              <p>
                This profile demonstrates authentic engagement velocity and natural follower acquisition patterns.
                Comment distribution shows genuine linguistic variety and active context relevance. Zero evidence of
                mass engagement pods or syndicated follower purchases.
              </p>
            ) : (
              <p>
                Forensic modeling flagged substantial irregularities across multiple metrics. Audience acquisition velocity
                features abrupt spikes characteristic of purchased packages, while comments and likes deviate markedly
                from organic benchmarks. Exercise caution before committing marketing spend or off-platform transactions.
              </p>
            )}
          </div>

          {/* Red flags vs Green flags */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-3">
                <AlertTriangle size={16} />
                <span>Identified Risk Vectors</span>
              </div>
              <ul className="text-xs text-rose-950 space-y-2">
                {report.riskSignals.map((signal, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
                <CheckCircle2 size={16} />
                <span>Verified Trust Vectors</span>
              </div>
              <ul className="text-xs text-emerald-950 space-y-2">
                {report.verifiedSignals.map((signal, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
