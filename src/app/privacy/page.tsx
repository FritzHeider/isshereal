import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, CheckCircle2, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — isshereal.com',
  description: 'Our privacy commitment: zero credentials requested, public-only metadata, and complete transparency.',
};

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="container-x max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Company</span>
          <span>/</span>
          <span className="text-slate-800">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="space-y-4 pb-8 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <Lock size={13} className="text-emerald-600" />
            Last Updated: September 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Privacy Policy & Data Principles
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            isshereal.com was architected with a fundamental privacy-first principle: we never want or request access to your private social credentials.
          </p>
        </div>

        {/* 3 Core Guarantees Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <EyeOff size={22} className="text-emerald-600" />
            <div className="font-bold text-slate-900 text-sm">No Passwords Ever</div>
            <div className="text-xs text-slate-600">
              We never ask you to connect social accounts, grant OAuth permissions, or type credentials.
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <ShieldCheck size={22} className="text-emerald-600" />
            <div className="font-bold text-slate-900 text-sm">Public Data Only</div>
            <div className="text-xs text-slate-600">
              Our forensic engine only inspects public web signals accessible to any regular web browser.
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <Lock size={22} className="text-emerald-600" />
            <div className="font-bold text-slate-900 text-sm">Zero Data Selling</div>
            <div className="text-xs text-slate-600">
              Your audit history is saved strictly on your own browser device and is never sold to advertisers.
            </div>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="prose prose-slate max-w-none space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">1. Information We Process</h2>
            <p>
              isshereal.com provides analytical insights by evaluating public information published across open platforms (including Instagram, TikTok, YouTube, X, Reddit, and public commerce marketplaces). This public information includes:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
              <li>Public account handles, display names, and public profile descriptions.</li>
              <li>Public follower, following, and post count metrics.</li>
              <li>Public engagement statistics (likes, comments, video view counters) on public posts.</li>
              <li>Public timestamp distributions of posts and comment activity.</li>
            </ul>
            <p>
              We do <strong>not</strong> access, collect, or store private direct messages (DMs), stories restricted to close friends, private payment cards, or password credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">2. How We Use Public Data</h2>
            <p>
              The public data collected during an audit is processed through our algorithmic models to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
              <li>Compute probability-based authenticity scores, bot risk ratings, and engagement distributions.</li>
              <li>Detect automated engagement pod patterns and follower purchase spikes.</li>
              <li>Generate structured audit reports rendered for user viewing.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">3. Edge Caching & Client-Side Storage</h2>
            <p>
              To maintain fast performance and protect social platforms from repetitive queries, our Cloudflare edge network may temporarily cache public score outputs. Additionally:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
              <li>
                <strong>Local History:</strong> Your search history displayed on the &ldquo;History&rdquo; page is stored locally on your own computer or mobile device using browser <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded">localStorage</code>.
              </li>
              <li>
                You can clear your local audit history at any time with a single click on the History page.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">4. Third-Party Sharing</h2>
            <p>
              We do not sell, rent, or monetize your search queries, IP addresses, or audited profile handles to data brokers, advertising exchanges, or credit agencies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">5. Data Removal & Cache Purge Requests</h2>
            <p>
              If you are a creator or profile owner and wish to request an immediate purge of cached algorithmic audit summaries associated with your handle, you may submit a request through our <Link href="/contact" className="text-emerald-600 font-semibold underline">Contact Form</Link>. Requests are processed within 48 business hours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">6. Contacting Privacy Officers</h2>
            <p>
              For legal inquiries, GDPR inquiries, or CCPA rights requests, please contact:
              <br />
              <strong className="text-slate-900">Email:</strong> privacy@isshereal.com
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
