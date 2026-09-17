'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ShieldCheck,
  AlertTriangle,
  Search,
  ArrowRight,
  CreditCard,
  Tag,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MarketplaceBuyersPage() {
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const [marketValue, setMarketValue] = useState<number>(800);
  const [askingPrice, setAskingPrice] = useState<number>(290);
  const [paymentMethod, setPaymentMethod] = useState<string>('zelle');
  const [accountAge, setAccountAge] = useState<string>('fresh');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    const clean = handle.replace(/^@/, '').trim();
    router.push(`/analyze?handle=${encodeURIComponent(clean)}`);
  };

  const discount = Math.max(0, Math.round(((marketValue - askingPrice) / marketValue) * 100));

  // Risk calculation
  let riskScore = 0;
  if (discount > 50) riskScore += 35;
  else if (discount > 30) riskScore += 15;

  if (paymentMethod === 'crypto' || paymentMethod === 'wire') riskScore += 45;
  else if (paymentMethod === 'zelle') riskScore += 30;
  else if (paymentMethod === 'link') riskScore += 40;

  if (accountAge === 'fresh') riskScore += 30;
  else if (accountAge === 'months') riskScore += 10;

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
          <span className="text-slate-800">Marketplace Buyers</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <ShoppingBag size={14} className="text-blue-600" />
              Peer-to-Peer Commerce Protection
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Shop Facebook Marketplace & eBay <span className="text-emerald-600">with total confidence</span>.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Stolen listing photos, hijacked dormant accounts, and fake shipping courier slips cheat peer-to-peer buyers every day. Verify seller history, social credibility, and scam indicators in seconds before transferring a single dollar.
            </p>

            {/* Quick Audit Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg pt-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter seller's handle or shop name"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-xs"
                />
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md">
                Audit Seller
                <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </form>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                Inspect FB Marketplace, Depop, Grailed, eBay
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                Instant fraud heuristic scoring
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 aspect-square bg-slate-900 flex items-center justify-center">
              <Image
                src="/images/features/marketplace-trust.png"
                alt="Marketplace trust score 3D render"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-lg text-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Escrow Alert</span>
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Verified Protection
                  </span>
                </div>
                <div className="mt-2 text-sm font-semibold">
                  Never pay sellers via non-refundable peer wires (Zelle, Venmo Friends, Wire) before inspecting items in person.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Deal Authenticity Analyzer */}
      <section className="container-x mt-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Tag size={14} />
              Interactive Deal Risk Estimator
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Is This Marketplace Deal Legit?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Test price anomalies and requested payment terms against known fraud patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Input controls */}
            <div className="lg:col-span-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Market / Retail Value ($)
                  </label>
                  <input
                    type="number"
                    value={marketValue}
                    onChange={(e) => setMarketValue(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Seller Asking Price ($)
                  </label>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Payment Method Demanded by Seller
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'cash', label: 'Cash in Person', safe: true },
                    { id: 'paypal', label: 'PayPal Goods & Services', safe: true },
                    { id: 'zelle', label: 'Zelle / CashApp', safe: false },
                    { id: 'wire', label: 'Wire / Western Union', safe: false },
                    { id: 'crypto', label: 'Bitcoin / USDT', safe: false },
                    { id: 'link', label: 'External "Escrow" Link', safe: false },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id)}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                        paymentMethod === p.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  Seller Account Age
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'fresh', label: 'New (< 30 days)' },
                    { id: 'months', label: '1 - 12 months' },
                    { id: 'aged', label: 'Aged (2+ years)' },
                  ].map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAccountAge(a.id)}
                      className={`p-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                        accountAge === a.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results card */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Deal Fraud Index
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {riskScore > 60 ? (
                    <span className="text-red-400">High Fraud Probability ({riskScore}%)</span>
                  ) : riskScore > 30 ? (
                    <span className="text-amber-400">Suspicious Indicators ({riskScore}%)</span>
                  ) : (
                    <span className="text-emerald-400">Plausible Deal ({riskScore}%)</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span>Price Deviation:</span>
                  <span className={discount > 50 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                    {discount}% below market
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span>Payment Recourse:</span>
                  <span className={paymentMethod === 'paypal' || paymentMethod === 'cash' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {paymentMethod === 'paypal' || paymentMethod === 'cash' ? 'High / Protected' : 'Zero Buyer Protection'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 leading-relaxed">
                {riskScore > 60
                  ? '⚠️ Alert: Heavily discounted high-demand goods sold by fresh accounts demanding peer payments is the #1 scam vector on Facebook & Depop.'
                  : 'Look for in-person transactions at public police exchange stations whenever possible.'}
              </div>

              <Link href="/analyze" className="block">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl">
                  Audit Seller Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fraud Vectors */}
      <section className="container-x mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Top 4 Marketplace Fraud Tactics
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Recognize these playbook strategies before you exchange payment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-bold text-lg text-slate-900">Stolen Inventory Photos</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Scammers download legitimate photos from sold Japanese Mercari or eBay listings, cropping watermarks and listing at 60% of genuine resale value.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-bold text-lg text-slate-900">Hijacked Facebook Accounts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dormant accounts belonging to older adults are bought from data leaks. The profile appears 12 years old with real friends, but is now operated by overseas scam rings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-bold text-lg text-slate-900">Fake Tracking Courier Links</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              They send a phishing link impersonating FedEx or UPS tracking requiring a $50 &ldquo;insurance deposit&rdquo; to release your delivery.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              04
            </div>
            <h3 className="font-bold text-lg text-slate-900">Non-Refundable Wire Requests</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Refusing PayPal Goods & Services or platform checkout, insisting that their bank account &ldquo;only takes Zelle or Apple Cash&rdquo;.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer banner */}
      <section className="container-x mt-20">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold">Check a seller before sending funds.</h3>
            <p className="text-slate-400 text-sm max-w-lg">
              Audit social handles, public profiles, and digital footprints without sharing your identity.
            </p>
          </div>
          <Link href="/analyze">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-full text-base shadow-lg">
              Run Free Seller Audit
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
