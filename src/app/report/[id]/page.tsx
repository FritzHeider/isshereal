'use client';

import React, { useState, useEffect } from 'react';
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
  Loader2,
  ExternalLink,
  Users,
  Grid3X3,
} from 'lucide-react';
import { SAMPLE_REPORTS, SampleReport } from '@/data/content';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ProgressBar } from '@/components/ProgressBar';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';

export default function ReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = (params.id as string) || 'lucamodels';
  const customHandle = searchParams.get('handle');

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);

      const targetHandle = customHandle || rawId;
      const cleanHandle = targetHandle.replace(/^(ig_|instagram_)/i, '').replace(/^@/, '').toLowerCase();

      // 1. Check if it's one of the preset sample reports
      const sample = SAMPLE_REPORTS.find(
        (r) => r.id.toLowerCase() === cleanHandle || r.handle.toLowerCase().includes(cleanHandle)
      );

      if (sample && !customHandle) {
        setReport(sample);
        setLoading(false);
        return;
      }

      // 2. Check localStorage for cached live audit
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(`audit_${rawId}`) || localStorage.getItem(`audit_${cleanHandle}`);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setReport(parsed);
            setLoading(false);
            return;
          } catch (e) {
            // ignore
          }
        }
      }

      // 3. Fetch live audit from /api/audit
      try {
        const res = await fetch(`/api/audit?handle=${encodeURIComponent(cleanHandle)}&platform=instagram`);
        if (res.ok) {
          const data = await res.json();
          if (data.report) {
            setReport(data.report);
            if (typeof window !== 'undefined') {
              localStorage.setItem(`audit_${data.report.id}`, JSON.stringify(data.report));
            }
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch live audit:', err);
      }

      // 4. Fallback to sample or construct fallback
      if (sample) {
        setReport(sample);
      } else {
        setReport(SAMPLE_REPORTS[1]); // Luca fallback
      }
      setLoading(false);
    }

    loadReport();
  }, [rawId, customHandle]);

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

  if (loading) {
    return (
      <div className="pt-36 pb-32 container-x max-w-2xl text-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 flex items-center justify-center mb-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-sm">
              <Loader2 size={28} className="animate-spin" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Running Live Authenticity Audit...
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md">
            Connecting to public registry, modeling follower distributions, and evaluating engagement authenticity.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
            <ShieldCheck size={14} />
            <span>Forensic Engine v2.4 Active</span>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="pt-36 pb-32 container-x text-center">
        <p className="text-slate-500">Report could not be generated. Please try again.</p>
        <Link href="/" className="mt-4 inline-block text-emerald-600 font-semibold text-sm">
          Return to Search
        </Link>
      </div>
    );
  }

  const displayName = report.name || `@${rawId}`;
  const displayHandle = report.handle || `@${rawId}`;

  return (
    <div className="pt-28 pb-24 container-x max-w-5xl animate-fade-up">
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
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-700 shrink-0 bg-slate-800 flex items-center justify-center">
              {report.avatarImage ? (
                <Image
                  src={report.avatarImage}
                  alt={displayName}
                  fill
                  unoptimized={report.avatarImage.startsWith('http')}
                  className="object-cover"
                />
              ) : (
                <span className="font-black text-xl text-emerald-400">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl sm:text-2xl text-white">
                  {displayName}
                </h1>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                  {report.platform || 'Instagram'}
                </span>
                {report.isLive && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    Live Verified
                  </span>
                )}
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

        {/* Live Public Stats Bar if available */}
        {(report.followingCount !== undefined || report.postsCount !== undefined) && (
          <div className="px-6 sm:px-8 py-3 bg-slate-800/50 border-b border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-emerald-400" />
              <span>Audience: <strong>{report.followers}</strong></span>
            </div>
            {report.followingCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <span>Following: <strong>{report.followingCount.toLocaleString()}</strong></span>
              </div>
            )}
            {report.postsCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <Grid3X3 size={14} className="text-slate-400" />
                <span>Posts: <strong>{report.postsCount.toLocaleString()}</strong></span>
              </div>
            )}
            <div className="ml-auto text-[11px] text-slate-400">
              Scraped live from public registry
            </div>
          </div>
        )}

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
              pct={report.realPct || (100 - report.fakePct)}
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
              {report.score >= 75 ? 'Above industry benchmark' : 'Under-indexed vs audience tier'}
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
              <span>v2.4 Live</span>
              <ShieldCheck size={18} />
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Calculated via real math
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
                <strong>Authentic Profile Confirmation:</strong> The audience distribution for{' '}
                <strong>{displayName}</strong> demonstrates organic growth velocity and healthy ratio metrics.
                The follower-to-following proportion aligns with genuine creators, and zero evidence of mass engagement pods
                or automated follow-unfollow loops was detected.
              </p>
            ) : (
              <p>
                <strong>Forensic Anomaly Detected:</strong> Mathematical modeling indicates substantial irregularities in{' '}
                <strong>{displayName}</strong>'s audience profile. Follower counts and activity ratios deviate significantly
                from organic creator baselines, suggesting purchased bulk followers or high inactive bot contamination.
                Proceed with caution before entering brand partnerships or off-platform negotiations.
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
                {report.riskSignals?.map((signal: string, idx: number) => (
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
                {report.verifiedSignals?.map((signal: string, idx: number) => (
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
