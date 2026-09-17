'use client';

import React from 'react';
import Image from 'next/image';
import {
  Activity,
  Globe2,
  TrendingUp,
  ScanSearch,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { FEATURES, SPOTLIGHT_FEATURES } from '@/data/content';

const SECONDARY_ICONS: Record<string, React.ReactNode> = {
  Activity: <Activity className="text-emerald-600" size={22} />,
  Globe2: <Globe2 className="text-emerald-600" size={22} />,
  TrendingUp: <TrendingUp className="text-emerald-600" size={22} />,
  ScanSearch: <ScanSearch className="text-emerald-600" size={22} />,
  Layers: <Layers className="text-emerald-600" size={22} />,
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-white border-t border-slate-100">
      <div className="container-x">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Why isshereal</span>
          </div>
          <h2 className="font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-[1.1]">
            Everything you need to verify anyone
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Detect fake followers, expose automated bots and catfish, and make
            data-driven decisions — whether vetting creator brand deals or dating
            matches.
          </p>
        </div>

        {/* Top Tier: 6 Spotlight Cards with 3D FAL.AI Visuals */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SPOTLIGHT_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-linear-to-b from-white to-slate-50/50 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group overflow-hidden relative"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {feature.badge}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </div>

                <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed max-w-md">
                  {feature.text}
                </p>
              </div>

              {/* 3D Rendered Graphic Asset */}
              {feature.image && (
                <div className="relative mt-8 h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Secondary Capabilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl border border-slate-200/70 bg-slate-50/40 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {SECONDARY_ICONS[feature.icon]}
              </div>
              <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                {feature.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
