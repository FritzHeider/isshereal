'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  ArrowRight,
  Loader2,
  TrendingUp,
  Instagram,
  Music2,
  Youtube,
  AlertCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from './ui/button';
import { ScoreGauge } from './ScoreGauge';
import { ProgressBar } from './ProgressBar';
import { RiskBadge } from './RiskBadge';

const HERO_PROFILES = {
  instagram: {
    handle: '@lifestyle.luca',
    name: 'Luca — Lifestyle',
    platform: 'Instagram',
    avatar: '/images/avatars/luca.jpg',
    score: 31,
    realPct: 33,
    fakePct: 67,
    verdict: 'Likely fake',
    spikeText: 'Suspicious spike detected · 4 months old',
    icon: Instagram,
    color: '#E1306C',
    pillScore: 23,
    pillVerdict: 'Likely fake',
  },
  tiktok: {
    handle: '@dance.maya',
    name: 'Maya',
    platform: 'TikTok',
    avatar: '/images/avatars/maya.jpg',
    score: 78,
    realPct: 82,
    fakePct: 18,
    verdict: 'Mostly genuine, minor flags',
    spikeText: 'Organic viral velocity spike · 2 months old',
    icon: Music2,
    color: '#111827',
    pillScore: 78,
    pillVerdict: 'Verified viral',
  },
  youtube: {
    handle: '@mrbeast',
    name: 'MrBeast',
    platform: 'YouTube',
    avatar: '/images/avatars/mrbeast.jpg',
    score: 94,
    realPct: 96,
    fakePct: 4,
    verdict: 'Likely authentic',
    spikeText: 'Sustained exponential authentic growth',
    icon: Youtube,
    color: '#FF0000',
    pillScore: 94,
    pillVerdict: 'Top 0.1% authentic',
  },
};

export function Hero() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Auditing profile...');
  const [error, setError] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<'instagram' | 'tiktok' | 'youtube'>('instagram');
  const router = useRouter();

  const currentProfile = HERO_PROFILES[activePlatform];

  // Smart auto-detect platform from query
  const getQueryPlatform = () => {
    const q = query.toLowerCase();
    if (q.includes('youtube.com') || q.includes('youtu.be')) return 'youtube';
    if (q.includes('tiktok.com')) return 'tiktok';
    if (q.includes('tinder') || q.includes('hinge') || q.includes('bumble')) return 'dating';
    return 'instagram';
  };

  const detectedPlatform = getQueryPlatform();

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setError('Please enter an Instagram handle, YouTube channel, or profile link');
      return;
    }

    setError(null);
    setLoading(true);
    setLoadingStep(`Connecting to ${detectedPlatform === 'instagram' ? 'Instagram' : detectedPlatform}...`);

    try {
      const cleanHandle = query.replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com\/@?)/i, '').replace(/^@/, '').split('/')[0].trim();

      const stepTimer = setTimeout(() => {
        setLoadingStep(`Analyzing ${cleanHandle}'s audience metrics...`);
      }, 500);

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: detectedPlatform,
          handle: cleanHandle,
        }),
      });

      clearTimeout(stepTimer);

      if (!res.ok) {
        throw new Error('Failed to audit profile');
      }

      const data = await res.json();
      if (data.report && data.report.followersCount > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(`audit_${data.report.id}`, JSON.stringify(data.report));
          localStorage.setItem('isshereal_last_report', JSON.stringify(data.report));
        }
        router.push(`/report/${data.report.id}`);
      } else {
        router.push(`/analyze?handle=${encodeURIComponent(cleanHandle)}`);
      }
    } catch (err: any) {
      console.error('Audit failed:', err);
      // Fallback to analyze page with handle pre-populated
      const cleanHandle = query.replace(/^@/, '').trim();
      router.push(`/analyze?handle=${encodeURIComponent(cleanHandle)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative pt-32 sm:pt-36 pb-24 overflow-hidden">
      {/* Subtle Technical Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-75 pointer-events-none" />

      {/* Subtle Hero Radial Glow */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (Copy & Search) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left animate-fade-up">
            {/* Trust Badges Row with Web-Use Engine */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <ShieldCheck size={15} className="text-emerald-600 stroke-[2.5]" />
                <span>Real live metrics · no login or password needed</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-white text-xs font-semibold shadow-xs">
                <span className="text-emerald-400">⚡</span>
                <span>Web-Use Real Browser Forensics</span>
              </div>
            </div>

            {/* H1 Headline */}
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.06]">
              Is <span className="text-emerald-600 font-black tracking-tighter">(s)he</span> real?
            </h1>

            {/* Value Proposition Subheadline */}
            <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
              Analyze any Instagram, TikTok, YouTube, dating, marketplace or
              freelance profile for fake followers, bots, catfish and scams — with a
              real authenticity score and AI verdict.
            </p>

            {/* Wide Search Bar Form */}
            <form
              onSubmit={handleAudit}
              className="mt-8 w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/15"
            >
              <div className="flex items-center flex-1 px-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-2.5 shrink-0">
                  {detectedPlatform === 'instagram' ? (
                    <Instagram size={18} className="text-[#E1306C]" />
                  ) : detectedPlatform === 'youtube' ? (
                    <Youtube size={18} className="text-red-600" />
                  ) : detectedPlatform === 'tiktok' ? (
                    <Music2 size={18} className="text-slate-900" />
                  ) : (
                    <Search size={18} />
                  )}
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Paste an Instagram @handle, YouTube, or link..."
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
                  disabled={loading}
                />
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md shrink-0">
                  {detectedPlatform}
                </span>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-7 h-12 text-sm sm:text-base font-semibold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    <span>{loadingStep}</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} className="mr-2 fill-current" />
                    Analyze
                  </>
                )}
              </Button>
            </form>

            {/* Validation Error Message */}
            {error && (
              <div className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Quick Suggestions Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs w-full max-w-xl">
              <span className="text-slate-400 font-medium">Quick audit:</span>
              {[
                { handle: 'nike', label: '@nike', tag: '291M' },
                { handle: 'natgeo', label: '@natgeo', tag: '269M' },
                { handle: 'mrbeast', label: '@mrbeast', tag: '342M' },
                { handle: 'figma', label: '@figma', tag: '959K' },
                { handle: 'cristiano', label: '@cristiano', tag: '642M' },
              ].map((creator) => (
                <button
                  key={creator.handle}
                  type="button"
                  onClick={() => {
                    setQuery(creator.label);
                    router.push(`/analyze?handle=${creator.handle}&platform=instagram`);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 shadow-2xs transition-all cursor-pointer font-mono font-medium"
                >
                  <span>{creator.label}</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-100/70 px-1 py-0.2 rounded font-sans font-bold">
                    {creator.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Subtext link below search input */}
            <button
              onClick={() => router.push('/analyze')}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 group transition-colors cursor-pointer"
            >
              <span>or audit an Instagram, TikTok, dating or seller profile</span>
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            {/* Social Proof Stats Row */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 mt-12 pt-8 border-t border-slate-200/80 w-full max-w-xl">
              <div>
                <div className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  10.4M+
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  profiles analyzed
                </div>
              </div>
              <div>
                <div className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  99.2%
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  model accuracy
                </div>
              </div>
              <div>
                <div className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  10
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  platforms & apps
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Interactive Authenticity Report Card) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Top Floating Pill Badge */}
            <div className="absolute -top-6 -right-2 z-20 animate-float hidden sm:block">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-3 flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${
                    currentProfile.score >= 75
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {currentProfile.pillScore}
                </span>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                    Quality score
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      currentProfile.score >= 75
                        ? 'text-emerald-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {currentProfile.pillVerdict}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Mock Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-200/80 overflow-hidden relative transition-all duration-300">
              {/* Card Header (Dark Slate with Profile Avatar) */}
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-700 shadow-sm shrink-0">
                    <Image
                      src={currentProfile.avatar}
                      alt={currentProfile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-white">
                        {currentProfile.name}
                      </span>
                      <ShieldCheck className="text-emerald-400" size={15} />
                    </div>
                    <span className="text-slate-400 text-xs font-mono">
                      {currentProfile.handle}
                    </span>
                  </div>
                </div>
                <RiskBadge score={currentProfile.score} label={currentProfile.verdict} />
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 space-y-6">
                {/* Score & Metrics Comparison Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Circular Donut Gauge */}
                  <div className="shrink-0 flex flex-col items-center">
                    <ScoreGauge score={currentProfile.score} size={116} strokeWidth={12} />
                  </div>

                  {/* Followers Breakdown Comparison */}
                  <div className="flex-1 w-full space-y-3.5">
                    <ProgressBar
                      label="Real followers"
                      pct={currentProfile.realPct}
                      color="#059669"
                      height="h-2.5"
                    />
                    <ProgressBar
                      label="Fake / inactive"
                      pct={currentProfile.fakePct}
                      color="#f43f5e"
                      height="h-2.5"
                    />

                    {/* Suspicious spike alert snippet */}
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200/60 rounded-lg p-2.5 mt-2">
                      <TrendingUp
                        size={15}
                        className={currentProfile.score >= 75 ? 'text-emerald-600 shrink-0' : 'text-rose-500 shrink-0'}
                      />
                      <span>{currentProfile.spikeText}</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Platform Tabs */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Interactive Live Preview
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Sparkles size={11} /> Click to test signals
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActivePlatform('instagram')}
                      className={`rounded-xl border p-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        activePlatform === 'instagram'
                          ? 'border-emerald-500 bg-emerald-50/60 text-slate-900 shadow-xs ring-1 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="relative w-5 h-5 shrink-0">
                        <Image
                          src="/images/platforms/instagram-3d.png"
                          alt="Instagram 3D"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs font-semibold">Instagram</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePlatform('tiktok')}
                      className={`rounded-xl border p-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        activePlatform === 'tiktok'
                          ? 'border-emerald-500 bg-emerald-50/60 text-slate-900 shadow-xs ring-1 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="relative w-5 h-5 shrink-0">
                        <Image
                          src="/images/platforms/tiktok-3d.png"
                          alt="TikTok 3D"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs font-semibold">TikTok</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePlatform('youtube')}
                      className={`rounded-xl border p-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        activePlatform === 'youtube'
                          ? 'border-emerald-500 bg-emerald-50/60 text-slate-900 shadow-xs ring-1 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="relative w-5 h-5 shrink-0">
                        <Image
                          src="/images/platforms/youtube-3d.png"
                          alt="YouTube 3D"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs font-semibold">YouTube</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
