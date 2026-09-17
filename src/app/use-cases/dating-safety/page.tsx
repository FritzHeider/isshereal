'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  HeartCrack,
  ShieldCheck,
  AlertOctagon,
  Search,
  ArrowRight,
  Video,
  Coins,
  Camera,
  Globe,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckItem {
  id: string;
  label: string;
  points: number;
  icon: React.ReactNode;
}

const CHECKLIST_ITEMS: CheckItem[] = [
  {
    id: 'video',
    label: 'Refuses or constantly cancels video calls (broken camera, poor connection excuses)',
    points: 25,
    icon: <Video size={18} className="text-red-500" />,
  },
  {
    id: 'profession',
    label: 'Claims an overseas job (military deployment, oil rig engineer, roving NGO physician)',
    points: 20,
    icon: <Globe size={18} className="text-amber-500" />,
  },
  {
    id: 'crypto',
    label: 'Brings up cryptocurrency, forex signals, or "passive investment mentors"',
    points: 30,
    icon: <Coins size={18} className="text-red-600" />,
  },
  {
    id: 'photos',
    label: 'Photos look like high-fashion studio catalog shoots or AI-generated models',
    points: 15,
    icon: <Camera size={18} className="text-amber-500" />,
  },
  {
    id: 'moveoff',
    label: 'Demands moving off the dating app to WhatsApp or Telegram immediately',
    points: 15,
    icon: <Lock size={18} className="text-purple-500" />,
  },
];

export default function DatingSafetyPage() {
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const [selectedChecks, setSelectedChecks] = useState<string[]>(['video', 'moveoff']);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    const clean = handle.replace(/^@/, '').trim();
    router.push(`/analyze?handle=${encodeURIComponent(clean)}`);
  };

  const toggleCheck = (id: string) => {
    setSelectedChecks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalPoints = selectedChecks.reduce((acc, curr) => {
    const item = CHECKLIST_ITEMS.find((c) => c.id === curr);
    return acc + (item ? item.points : 0);
  }, 0);

  const getRiskLevel = (score: number) => {
    if (score >= 50) {
      return {
        level: 'Extreme Risk — Likely Romance Scam or Catfish',
        color: 'text-red-600 bg-red-50 border-red-200',
        barColor: 'bg-red-500',
        advice:
          'DO NOT send funds, crypto, or private photos. Insist on immediate live video verification or cease communication.',
      };
    }
    if (score >= 25) {
      return {
        level: 'Elevated Warning — Exercise Extreme Caution',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
        advice:
          'Several suspicious behavioral anomalies match classic social engineering scripts. Verify their social footprint before meeting.',
      };
    }
    return {
      level: 'Low Risk Indicators Detected',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      barColor: 'bg-emerald-500',
      advice:
        'Standard precautions still apply. Always meet in a public venue and let a trusted friend know your location.',
    };
  };

  const risk = getRiskLevel(totalPoints);

  return (
    <div className="pt-28 pb-20">
      {/* Hero Section */}
      <section className="container-x">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Use Cases</span>
          <span>/</span>
          <span className="text-slate-800">Dating Safety</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <HeartCrack size={14} className="text-rose-600" />
              Romance Scam & Catfish Shield
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Verify Tinder & Hinge matches <span className="text-emerald-600">before you fall</span>.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Romance and pig-butchering scams caused over $1.3B in verified losses last year. Before investing your heart or your finances, verify their Instagram, TikTok, or social footprint to confirm they are who they claim to be.
            </p>

            {/* Quick Audit Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg pt-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter match's @handle to verify"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-xs"
                />
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md">
                Verify Profile
                <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </form>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                100% confidential — match never notified
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                Instant AI forensics
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 aspect-square bg-slate-900 flex items-center justify-center">
              <Image
                src="/images/features/romance-shield.png"
                alt="Romance scam protection shield 3D render"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-lg text-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Protection Guarantee</span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Active Defense
                  </span>
                </div>
                <div className="mt-2 text-sm font-semibold">
                  Zero login or app sync needed. We audit open public telemetry without touching your personal account.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Catfish Diagnostic Widget */}
      <section className="container-x mt-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
              <AlertOctagon size={14} />
              Live Diagnostic
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Interactive Catfish & Scam Meter
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Select any behavior you have noticed during your conversations. Our risk engine calculates probability metrics in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Checklist */}
            <div className="lg:col-span-7 space-y-3">
              {CHECKLIST_ITEMS.map((item) => {
                const checked = selectedChecks.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      checked
                        ? 'bg-slate-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="w-5 h-5 accent-emerald-600 rounded-md cursor-pointer"
                    />
                    <div className="p-2 rounded-xl bg-slate-100">{item.icon}</div>
                    <span className="text-sm font-medium text-slate-800 flex-1">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Live Risk Meter Output */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Forensic Threat Assessment
                </span>
                <div className="mt-3">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-slate-300">Catfish Probability</span>
                    <span className="text-2xl font-black text-white">{Math.min(totalPoints, 100)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${risk.barColor}`}
                      style={{ width: `${Math.min(totalPoints, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-xs font-semibold ${risk.color}`}>
                {risk.level}
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="text-white font-bold block mb-1">Recommended Action:</span>
                {risk.advice}
              </div>

              <Link href="/analyze" className="block">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl">
                  Run Forensic Scan on Match
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Pig-Butchering Anatomy */}
      <section className="container-x mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Modern Romance Scams Work
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Syndicates deploy industrial scripts to build emotional dependency before initiating financial requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs relative">
            <span className="text-3xl font-black text-emerald-600">01</span>
            <h3 className="font-bold text-lg text-slate-900 mt-2 mb-3">The Hook & Isolation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              They shower you with round-the-clock texting, calling you affectionate nicknames immediately. They urgently urge you off dating apps onto unmoderated encrypted chat platforms like WhatsApp.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs relative">
            <span className="text-3xl font-black text-amber-500">02</span>
            <h3 className="font-bold text-lg text-slate-900 mt-2 mb-3">The Fake Wealth Trap</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Casually mentioning huge profits in gold trading, crypto, or forex. They offer to “teach you” by having you deposit small sums on a convincing mock trading website that shows artificial returns.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs relative">
            <span className="text-3xl font-black text-red-500">03</span>
            <h3 className="font-bold text-lg text-slate-900 mt-2 mb-3">The Freeze & Vanish</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Once a substantial deposit is transferred, the mock platform demands impossible &ldquo;liquidity release taxes&rdquo;. When refused, the profile vanishes, blocking all contact.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-x mt-20">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold">Have a gut feeling something isn&apos;t right?</h3>
            <p className="text-slate-400 text-sm max-w-lg">
              Trust your instincts. Run their social handles through our zero-login analyzer in seconds.
            </p>
          </div>
          <Link href="/analyze">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-full text-base shadow-lg">
              Run Free Safety Check
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
