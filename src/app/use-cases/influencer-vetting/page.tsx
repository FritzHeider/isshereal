'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  DollarSign,
  Users,
  Search,
  ArrowRight,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InfluencerVettingPage() {
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const [followers, setFollowers] = useState<number>(150000);
  const [campaignBudget, setCampaignBudget] = useState<number>(3000);
  const [estimatedFakeRate, setEstimatedFakeRate] = useState<number>(34);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    const clean = handle.replace(/^@/, '').trim();
    router.push(`/analyze?handle=${encodeURIComponent(clean)}`);
  };

  // Calculations
  const wastedBudget = Math.round(campaignBudget * (estimatedFakeRate / 100));
  const realAudience = Math.round(followers * (1 - estimatedFakeRate / 100));
  const claimedCPM = ((campaignBudget / followers) * 1000).toFixed(2);
  const trueCPM = ((campaignBudget / Math.max(realAudience, 1)) * 1000).toFixed(2);

  return (
    <div className="pt-28 pb-20">
      {/* Hero Section */}
      <section className="container-x">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Use Cases</span>
          <span>/</span>
          <span className="text-slate-800">Influencer Vetting</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <ShieldAlert size={14} className="text-emerald-600" />
              Influencer Marketing Risk Intelligence
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Stop burning marketing budget on <span className="text-emerald-600">bot-boosted creators</span>.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Up to 48% of influencer sponsored post fees are pocketed for impressions delivered to ghost followers, comment pods, and click-farms. Run an instant forensic audit on any creator before sending an offer.
            </p>

            {/* Quick Audit Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg pt-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter creator @handle (Instagram, TikTok, YouTube)"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-xs"
                />
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md">
                Audit Creator
                <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </form>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                No login or API token needed
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                Audited 10.4M+ profiles
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 aspect-square bg-slate-900 flex items-center justify-center">
              <Image
                src="/images/features/fake-detector.png"
                alt="Influencer fake follower scanner 3D visualization"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-lg text-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Industry Benchmark</span>
                  <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                    High Risk Alert
                  </span>
                </div>
                <div className="mt-2 text-sm font-semibold">
                  34.2% of mid-tier influencer audiences fail forensic authenticity checks.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI & Waste Calculator */}
      <section className="container-x mt-24">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <DollarSign size={14} />
              Interactive Tool
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Sponsor Budget Waste Calculator
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Estimate how much of your creator fee goes directly into the void of fake followers and bot engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-300">Creator Follower Count</span>
                  <span className="text-emerald-400 font-bold">{followers.toLocaleString()} followers</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="2000000"
                  step="10000"
                  value={followers}
                  onChange={(e) => setFollowers(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-300">Proposed Sponsorship Fee</span>
                  <span className="text-emerald-400 font-bold">${campaignBudget.toLocaleString()} USD</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="25000"
                  step="100"
                  value={campaignBudget}
                  onChange={(e) => setCampaignBudget(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-300">Estimated Bot / Inactive Audience Rate</span>
                  <span className="text-red-400 font-bold">{estimatedFakeRate}% fake</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  step="1"
                  value={estimatedFakeRate}
                  onChange={(e) => setEstimatedFakeRate(Number(e.target.value))}
                  className="w-full accent-red-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-5">
              <div className="border-b border-slate-700/80 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Estimated Wasted Spend</span>
                <div className="text-3xl sm:text-4xl font-black text-red-400 mt-1 flex items-baseline gap-2">
                  ${wastedBudget.toLocaleString()}
                  <span className="text-xs font-medium text-slate-400">dollars wasted on bots</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Effective Real Reach</span>
                  <span className="text-base font-bold text-emerald-400">{realAudience.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                  <span className="text-slate-400 block mb-1">True CPM vs Stated</span>
                  <span className="text-base font-bold text-amber-400">${trueCPM} <span className="text-[10px] text-slate-500 font-normal">(${claimedCPM})</span></span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed">
                <strong>Negotiation Tip:</strong> With a {estimatedFakeRate}% fake follower score, offer <span className="font-bold underline">${(campaignBudget - wastedBudget).toLocaleString()}</span> instead of the asking rate to protect your ROAS.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Red Flags */}
      <section className="container-x mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The 4 Critical Warning Signs We Audit
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Our algorithmic forensic models inspect signals that typical vanity follower numbers completely disguise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <TrendingDown size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Overnight Follower Spikes</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Organic growth happens smoothly. Sudden vertical jumps of 10k-50k followers in 24 hours indicate bulk follower purchases from reselling panels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Engagement Pod Activity</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Influencers join Telegram or WhatsApp pods where members exchange automated 2-word comments (&ldquo;Love this!&rdquo;, &ldquo;Stunning 🔥&rdquo;) within minutes of posting.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900">View-to-Follower Anomaly</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              A profile claiming 500,000 followers whose Reels or TikToks consistently struggle to break 2,000 views is a massive indicator of dead ghost accounts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Mass-Follower Ratio</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Audience members who follow more than 1,500 profiles rarely see any given post in their feed due to feed saturation. We calculate active net visibility.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer banner */}
      <section className="container-x mt-20">
        <div className="rounded-3xl bg-linear-to-r from-emerald-600 to-teal-700 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to audit your roster of creators?</h3>
            <p className="text-emerald-100 text-sm max-w-lg">
              Start with free instant audits on Instagram, TikTok, YouTube, X, and Reddit.
            </p>
          </div>
          <Link href="/analyze">
            <Button className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-8 py-3.5 rounded-full text-base shadow-lg">
              Analyze a Profile Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
