'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Cpu,
  Eye,
  Lock,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
  Database,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Hero Section */}
      <section className="container-x">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Company</span>
          <span>/</span>
          <span className="text-slate-800">About Us</span>
        </div>

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <ShieldCheck size={15} className="text-emerald-600" />
            Authenticity Intelligence Engine
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Democratizing digital forensics for <span className="text-emerald-600">an internet full of noise</span>.
          </h1>

          <p className="text-slate-600 text-base sm:text-xl leading-relaxed">
            In an era where follower counts can be bought for pennies, AI can fake human faces, and engagement pods manipulate algorithms, isshereal.com gives everyday users, creators, and businesses the forensic clarity they need to know who is genuinely real.
          </p>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="container-x mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-black text-emerald-400">10.4M+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Profiles Analyzed</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-black text-emerald-400">99.2%</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Model Accuracy</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-black text-emerald-400">10</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Platforms & Networks</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-black text-emerald-400">0</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Credentials Requested</div>
          </div>
        </div>
      </section>

      {/* Forensic Architecture */}
      <section className="container-x mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Our Forensic Engine Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            We do not rely on self-reported vanity figures. Our multi-vector algorithms analyze public signal telemetry to expose inorganic manipulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Audience Topology Modeling</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Organic social followings follow natural power-law distributions. Bot clusters exhibit uniform follower-to-following ratios, suspicious zero-post profiles, and non-localized geographic clustering.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Engagement Velocity Decay</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Genuine humans engage with content in smooth, logarithmic decay curves over hours and days. Commercial click-farms inject instant spikes within minutes, followed by total flatlining.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Linguistic NLP Telemetry</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Engagement pods and automated bots reuse recurring templates (&ldquo;Check DM&rdquo;, &ldquo;Top post 🔥&rdquo;, identical praise). Our linguistic filters evaluate comment semantic diversity.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="container-x mt-24">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-14">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Our Uncompromising Ethics</h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              We operate under strict consumer-first privacy and integrity principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Lock size={18} className="text-emerald-600" />
                Never Request Passwords
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                We never ask you to connect your account, grant OAuth privileges, or enter passwords. Every scan is conducted purely through public web metadata.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Eye size={18} className="text-emerald-600" />
                No Paid Rating Whitewashing
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Influencers and agencies cannot pay to boost an authenticity score or hide negative audits. Our scoring is purely mathematical and algorithmic.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Globe size={18} className="text-emerald-600" />
                Radically Fast & Accessible
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Forensics should not be gated behind $5,000/mo enterprise enterprise contracts. We ensure fast, free access for everyday web citizens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="container-x mt-20">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to see the data for yourself?</h3>
            <p className="text-slate-400 text-sm max-w-lg">
              Test any public profile on Instagram, TikTok, YouTube, X, or Reddit right now.
            </p>
          </div>
          <Link href="/analyze">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-full text-base shadow-lg">
              Start Free Audit
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
