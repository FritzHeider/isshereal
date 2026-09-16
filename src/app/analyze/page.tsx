'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ShieldCheck,
  Search,
  Loader2,
  Sparkles,
  BadgeCheck,
  HeartHandshake,
  Store,
  Briefcase,
  AlertCircle,
  Zap,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATEGORIES, PLATFORMS, SAMPLE_REPORTS } from '@/data/content';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  BadgeCheck: <BadgeCheck size={18} />,
  HeartHandshake: <HeartHandshake size={18} />,
  Store: <Store size={18} />,
  Briefcase: <Briefcase size={18} />,
};

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialHandle = searchParams.get('handle') || '';

  const [category, setCategory] = useState('social');
  const [platform, setPlatform] = useState('instagram');
  const [handle, setHandle] = useState(initialHandle);
  const [followers, setFollowers] = useState('48000');
  const [likes, setLikes] = useState('1200');
  const [comments, setComments] = useState('45');
  const [loading, setLoading] = useState(false);

  // Quick preset loader
  const loadPreset = (reportId: string) => {
    const rep = SAMPLE_REPORTS.find((r) => r.id === reportId);
    if (rep) {
      setHandle(rep.handle);
      if (rep.id === 'mrbeast') {
        setPlatform('youtube');
        setFollowers('342000000');
        setLikes('4500000');
        setComments('120000');
      } else if (rep.id === 'lucamodels') {
        setPlatform('instagram');
        setFollowers('480000');
        setLikes('1800');
        setComments('35');
      } else if (rep.id === 'maya') {
        setPlatform('tiktok');
        setFollowers('1200000');
        setLikes('85000');
        setComments('2400');
      }
    }
  };

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Determine appropriate sample or custom report
      const clean = handle.replace(/^@/, '').toLowerCase();
      const matched = SAMPLE_REPORTS.find((r) => r.handle.toLowerCase().includes(clean));
      const targetId = matched ? matched.id : 'lucamodels';
      router.push(`/report/${targetId}?handle=${encodeURIComponent(handle)}`);
    }, 1100);
  };

  // Real-time live engagement rate estimation
  const fNum = parseFloat(followers.replace(/,/g, '')) || 0;
  const lNum = parseFloat(likes.replace(/,/g, '')) || 0;
  const cNum = parseFloat(comments.replace(/,/g, '')) || 0;
  const liveER = fNum > 0 ? (((lNum + cNum) / fNum) * 100).toFixed(2) : '0.00';

  return (
    <div className="pt-28 pb-20 container-x max-w-4xl">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-200">
          <ShieldCheck size={14} />
          <span>Profile Authenticity Auditor</span>
        </div>
        <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Audit Any Profile
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Choose a platform and enter what you can see. Real math + AI verdict in seconds.
        </p>
      </div>

      {/* Quick Demo Fill Buttons */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-2 text-xs">
        <span className="text-slate-500 font-medium">Quick load sample data:</span>
        <div className="flex items-center gap-2">
          {SAMPLE_REPORTS.slice(0, 3).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => loadPreset(r.id)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <div className="relative w-4 h-4 rounded-full overflow-hidden">
                <Image src={r.avatarImage} alt={r.name} fill className="object-cover" />
              </div>
              <span>{r.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {CATEGORY_ICONS[cat.icon]}
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  {cat.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Platform Selection */}
        {category === 'social' && (
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Platform
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    platform === p.id
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Audit Form */}
        <form onSubmit={handleRunAudit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">
              Profile Handle or URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@username or profile link"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Followers / Audience
              </label>
              <input
                type="text"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                placeholder="48,000"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Avg. Likes / Reactions
              </label>
              <input
                type="text"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                placeholder="1,200"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Avg. Comments
              </label>
              <input
                type="text"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="45"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Live Engagement Rate calculation chip */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">
                Calculated Live Engagement Rate:
              </span>
            </div>
            <div className="font-extrabold text-sm sm:text-base text-slate-900">
              {liveER}%
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600" />
              <span>Free instant calculation · No login needed</span>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-7 py-2.5 text-sm font-semibold shadow-md shadow-emerald-600/20"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Auditing Profile...
                </>
              ) : (
                'Run Full Audit'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-slate-400">Loading auditor...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
