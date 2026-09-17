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
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATEGORIES, PLATFORMS, SAMPLE_REPORTS } from '@/data/content';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  BadgeCheck: <BadgeCheck size={18} />,
  HeartHandshake: <HeartHandshake size={18} />,
  Store: <Store size={18} />,
  Briefcase: <Briefcase size={18} />,
};

import { getVerifiedCreator } from '@/data/verified-creators';

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialHandle = searchParams.get('handle') || '';

  const [category, setCategory] = useState('social');
  const [platform, setPlatform] = useState('instagram');
  const [handle, setHandle] = useState(initialHandle);
  const [followers, setFollowers] = useState('25000');
  const [following, setFollowing] = useState('450');
  const [posts, setPosts] = useState('85');
  const [likes, setLikes] = useState('650');
  const [comments, setComments] = useState('28');
  const [loading, setLoading] = useState(false);
  const [fetchingLive, setFetchingLive] = useState(false);
  const [liveSuccessMsg, setLiveSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialHandle) {
      const clean = initialHandle.replace(/^@/, '').toLowerCase().trim();
      const v = getVerifiedCreator(clean);
      if (v) {
        setHandle(v.handle);
        setPlatform(v.platform.toLowerCase());
        setFollowers(v.followers.toString());
        setFollowing(v.following.toString());
        setPosts(v.posts.toString());
        setLiveSuccessMsg(`Loaded verified public metrics for ${v.name}: ${v.followers.toLocaleString()} followers`);
      } else {
        handleAutoFetch();
      }
    }
  }, [initialHandle]);

  // Auto-fetch live numbers from Instagram/platform
  const handleAutoFetch = async () => {
    if (!handle.trim()) return;
    setFetchingLive(true);
    setLiveSuccessMsg(null);

    const clean = handle.replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com\/@?)/i, '').replace(/^@/, '').split('/')[0].trim().toLowerCase();

    // Check verified dataset first
    const v = getVerifiedCreator(clean);
    if (v) {
      setFollowers(v.followers.toString());
      setFollowing(v.following.toString());
      setPosts(v.posts.toString());
      setLiveSuccessMsg(`Verified public telemetry for ${v.name}: ${v.followers.toLocaleString()} followers`);
      setFetchingLive(false);
      return;
    }

    try {
      const res = await fetch(`/api/audit?handle=${encodeURIComponent(clean)}&platform=${platform}`);
      if (res.ok) {
        const data = await res.json();
        if (data.report && data.report.followersCount > 0) {
          setFollowers(data.report.followersCount.toString());
          if (data.report.followingCount) setFollowing(data.report.followingCount.toString());
          if (data.report.postsCount) setPosts(data.report.postsCount.toString());
          setLiveSuccessMsg(`Pulled live data for ${data.report.name}: ${data.report.followers}`);
        } else {
          setLiveSuccessMsg(`Enter public follower count for @${clean} to compute authenticity score`);
        }
      }
    } catch (e) {
      console.error('Auto-fetch failed:', e);
    } finally {
      setFetchingLive(false);
    }
  };

  // Quick preset loader
  const loadPreset = (presetKey: string) => {
    const v = getVerifiedCreator(presetKey);
    if (v) {
      setHandle(v.handle);
      setPlatform(v.platform.toLowerCase());
      setFollowers(v.followers.toString());
      setFollowing(v.following.toString());
      setPosts(v.posts.toString());
      setLiveSuccessMsg(`Loaded verified profile: ${v.name} (${v.followers.toLocaleString()} followers)`);
      return;
    }

    const rep = SAMPLE_REPORTS.find((r) => r.id === presetKey);
    if (rep) {
      setHandle(rep.handle);
      if (rep.id === 'mrbeast') {
        setPlatform('youtube');
        setFollowers('342000000');
        setFollowing('240');
        setPosts('820');
      } else if (rep.id === 'lucamodels') {
        setPlatform('instagram');
        setFollowers('480000');
        setFollowing('3400');
        setPosts('65');
      } else if (rep.id === 'maya') {
        setPlatform('tiktok');
        setFollowers('1200000');
        setFollowing('410');
        setPosts('340');
      }
    }
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);
    const cleanHandle = handle.replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com\/@?)/i, '').replace(/^@/, '').split('/')[0].trim();

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          handle: cleanHandle,
          followers: parseFloat(followers.replace(/,/g, '')) || 0,
          following: parseFloat(following.replace(/,/g, '')) || 0,
          posts: parseFloat(posts.replace(/,/g, '')) || 0,
          likes: parseFloat(likes.replace(/,/g, '')) || 0,
          comments: parseFloat(comments.replace(/,/g, '')) || 0,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(`audit_${data.report.id}`, JSON.stringify(data.report));
            localStorage.setItem('isshereal_last_report', JSON.stringify(data.report));
          }
          router.push(`/report/${data.report.id}`);
          return;
        }
      }
    } catch (err) {
      console.error('Audit submit error:', err);
    } finally {
      setLoading(false);
    }

    // Fallback navigation
    router.push(`/report/ig_${cleanHandle}`);
  };

  // Real-time live engagement rate estimation
  const fNum = parseFloat(followers.replace(/,/g, '')) || 0;
  const lNum = parseFloat(likes.replace(/,/g, '')) || 0;
  const cNum = parseFloat(comments.replace(/,/g, '')) || 0;
  const liveER = fNum > 0 ? (((lNum + cNum) / fNum) * 100).toFixed(2) : '0.00';

  return (
    <div className="pt-28 pb-20 container-x max-w-4xl">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <ShieldCheck size={14} />
            <span>Profile Authenticity Auditor</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xs">
            <span className="text-emerald-400">⚡</span>
            <span>Web-Use Browser Forensics Active</span>
          </div>
        </div>
        <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Audit Any Profile
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Choose a platform and enter an @handle or URL. Live math + AI forensic verdict in seconds.
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-900">
                Profile Handle or URL
              </label>
              <button
                type="button"
                onClick={handleAutoFetch}
                disabled={fetchingLive || !handle.trim()}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {fetchingLive ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Scraping public data...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={12} />
                    <span>Auto-Fetch Public Numbers</span>
                  </>
                )}
              </button>
            </div>
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
            {liveSuccessMsg && (
              <div className="mt-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>{liveSuccessMsg}</span>
              </div>
            )}

            {/* Quick Presets */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Try verified:</span>
              {[
                { label: '@nike', handle: 'nike', plat: 'instagram' },
                { label: '@natgeo', handle: 'natgeo', plat: 'instagram' },
                { label: '@mrbeast', handle: 'mrbeast', plat: 'youtube' },
                { label: '@figma', handle: 'figma', plat: 'instagram' },
                { label: '@cristiano', handle: 'cristiano', plat: 'instagram' },
              ].map((c) => (
                <button
                  key={c.handle}
                  type="button"
                  onClick={() => {
                    setHandle(c.label);
                    setPlatform(c.plat);
                    const v = getVerifiedCreator(c.handle);
                    if (v) {
                      setFollowers(v.followers.toString());
                      setFollowing(v.following.toString());
                      setPosts(v.posts.toString());
                      setLiveSuccessMsg(`Loaded verified metrics for ${v.name}: ${v.followers.toLocaleString()} followers`);
                    }
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 transition-colors font-mono cursor-pointer"
                >
                  {c.label}
                </button>
              ))}
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Following Count
              </label>
              <input
                type="text"
                value={following}
                onChange={(e) => setFollowing(e.target.value)}
                placeholder="820"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Posts / Videos
              </label>
              <input
                type="text"
                value={posts}
                onChange={(e) => setPosts(e.target.value)}
                placeholder="140"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Avg. Likes / Reactions per post
              </label>
              <input
                type="text"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                placeholder="1,200"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Avg. Comments per post
              </label>
              <input
                type="text"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="45"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Live Engagement Rate calculation chip */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">
                Live Computed Engagement Rate:
              </span>
            </div>
            <div className="font-extrabold text-sm sm:text-base text-slate-900">
              {liveER}%
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600" />
              <span>Live forensic calculation · Zero logins or passwords</span>
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
                'Run Full Live Audit'
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
