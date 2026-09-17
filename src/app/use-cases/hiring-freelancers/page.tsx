'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  ShieldCheck,
  Code2,
  GitBranch,
  Video,
  Search,
  ArrowRight,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HiringFreelancersPage() {
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const [videoPolicy, setVideoPolicy] = useState<'live' | 'excuses' | 'loop'>('live');
  const [githubHistory, setGithubHistory] = useState<'organic' | 'spurt' | 'none'>('organic');
  const [timezoneMatch, setTimezoneMatch] = useState<boolean>(true);
  const [liveCoding, setLiveCoding] = useState<'fluent' | 'copypaste'>('fluent');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    const clean = handle.replace(/^@/, '').trim();
    router.push(`/analyze?handle=${encodeURIComponent(clean)}`);
  };

  // Score
  let riskScore = 15;
  if (videoPolicy === 'excuses') riskScore += 35;
  if (videoPolicy === 'loop') riskScore += 50;
  if (githubHistory === 'spurt') riskScore += 25;
  if (githubHistory === 'none') riskScore += 20;
  if (!timezoneMatch) riskScore += 30;
  if (liveCoding === 'copypaste') riskScore += 30;

  riskScore = Math.min(riskScore, 100);

  return (
    <div className="pt-28 pb-20">
      {/* Hero Section */}
      <section className="container-x">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Use Cases</span>
          <span>/</span>
          <span className="text-slate-800">Hiring Freelancers</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <Briefcase size={14} className="text-emerald-600" />
              Talent & Remote Contractor Auditing
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Verify freelance developers <span className="text-emerald-600">before sharing production keys</span>.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Bait-and-switch agencies, fake GitHub activity scripts, and stolen portfolio screenshots plague modern remote hiring. Audit candidate public footprints, developer identity, and authenticity signals before onboarding.
            </p>

            {/* Quick Audit Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg pt-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter candidate's GitHub, X, or social handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-xs"
                />
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md">
                Audit Candidate
                <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </form>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                Audits GitHub, X, LinkedIn, YouTube
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                Protects intellectual property & codebase
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 aspect-square bg-slate-900 flex items-center justify-center">
              <Image
                src="/images/features/ai-forensics.png"
                alt="AI forensics code and developer profile analysis"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-lg text-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Subcontractor Alert</span>
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    Bait-and-Switch Ring
                  </span>
                </div>
                <div className="mt-2 text-sm font-semibold">
                  Over 28% of remote contractor profiles act as broker fronts for unvetted third parties.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Candidate Diagnostic */}
      <section className="container-x mt-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Terminal size={14} />
              Forensic Candidate Checklist
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Bait-and-Switch & Outsourcing Diagnostic
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Select what occurred during your initial screening call to evaluate subcontractor risk.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Technical Interview Video Verification
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'live', label: 'Clear Live Video with Audio Sync' },
                    { id: 'excuses', label: 'Excuses (Broken webcam / Bad wifi)' },
                    { id: 'loop', label: 'Lip-sync delay / Static avatar loop' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVideoPolicy(v.id as any)}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                        videoPolicy === v.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  GitHub / Code History Consistency
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'organic', label: 'Multi-year organic commits' },
                    { id: 'spurt', label: 'Sudden burst of 500 commits in 1 week' },
                    { id: 'none', label: 'Empty or private-only history' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGithubHistory(g.id as any)}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                        githubHistory === g.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Timezone & IP Geographical Alignment
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { match: true, label: 'Matches Stated Resume Location' },
                    { match: false, label: 'Inconsistent (Timezone difference > 5h)' },
                  ].map((t) => (
                    <button
                      key={String(t.match)}
                      type="button"
                      onClick={() => setTimezoneMatch(t.match)}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                        timezoneMatch === t.match
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Live Coding Assessment
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'fluent', label: 'Walks through logic, types live' },
                    { id: 'copypaste', label: 'Long pauses, pasting blocks from hidden screen' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setLiveCoding(c.id as any)}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                        liveCoding === c.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results card */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Candidate Risk Score
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {riskScore > 65 ? (
                    <span className="text-red-400">High Risk ({riskScore}%) — Probable Proxy</span>
                  ) : riskScore > 35 ? (
                    <span className="text-amber-400">Moderate Concerns ({riskScore}%)</span>
                  ) : (
                    <span className="text-emerald-400">Verified Signals ({riskScore}%)</span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 leading-relaxed">
                {riskScore > 65 ? (
                  <span className="text-red-300">
                    <strong>Critical Warning:</strong> Candidate demonstrates standard traits of a proxy front. A senior engineer performs the screening, while unvetted third parties work on your repository.
                  </span>
                ) : (
                  <span>
                    Signals appear aligned. Always implement least-privilege repository permissions and protect production environment secrets.
                  </span>
                )}
              </div>

              <Link href="/analyze" className="block">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl">
                  Run Public Handle Scan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Risks */}
      <section className="container-x mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Key Contractor Fraud Vectors
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Ensure the talent you interviewed is the actual developer writing code in your repository.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Video size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Proxy Interviewers</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fluent native speakers are hired to pass the verbal and technical screenings, then quietly hand off all project tasks to junior overseas teams.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <GitBranch size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Fabricated Git History</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Scripts like git-faker generate thousands of fake historical commits to turn contribution squares green overnight without contributing genuine code.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Code2 size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Synthetic UI Portfolios</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designers claim authorship of complex SaaS dashboards generated in seconds using Midjourney or cloned from popular Dribbble designers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Secrets Exfiltration</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unverified contractors frequently test repositories for embedded AWS tokens, Stripe test keys, or customer database backups.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer banner */}
      <section className="container-x mt-20">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold">Audit developer accounts in seconds.</h3>
            <p className="text-slate-400 text-sm max-w-lg">
              Check public footprints across GitHub, X, Reddit, and portfolio links.
            </p>
          </div>
          <Link href="/analyze">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-full text-base shadow-lg">
              Run Free Talent Audit
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
