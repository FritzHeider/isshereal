import React from 'react';
import Link from 'next/link';
import { FileText, AlertCircle, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — isshereal.com',
  description: 'Terms and conditions governing the use of isshereal.com analytical forensics and audit tools.',
};

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="container-x max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Company</span>
          <span>/</span>
          <span className="text-slate-800">Terms of Service</span>
        </div>

        {/* Header */}
        <div className="space-y-4 pb-8 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <FileText size={13} className="text-slate-600" />
            Effective Date: September 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Please read these terms carefully before accessing or using the isshereal.com platform and related analytical services.
          </p>
        </div>

        {/* Disclaimer Warning Callout */}
        <div className="my-8 p-6 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4">
          <AlertCircle size={24} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 leading-relaxed">
            <strong className="block font-bold mb-1">Important Analytical Disclaimer:</strong>
            Scores and verdicts produced by isshereal.com are probabilistic statistical estimations derived from public web metadata. They are intended for research, risk assessment, and entertainment purposes, and do not constitute formal legal proof or financial guarantees.
          </div>
        </div>

        {/* Terms Sections */}
        <div className="prose prose-slate max-w-none space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or utilizing isshereal.com (&ldquo;Service&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any portion of these terms, you must discontinue use immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">2. Service Description & Methodology</h2>
            <p>
              isshereal.com provides algorithmic analysis of publicly available social media profiles, public creator metrics, and digital listings. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
              <li>Authenticity scores reflect algorithmic probability models and are subject to statistical margins of error.</li>
              <li>Public social media APIs, web scraping conditions, and platform changes may affect real-time data availability.</li>
              <li>You remain solely responsible for any decisions, contracts, purchases, or interactions undertaken with third parties audited through our tools.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">3. Acceptable Use Policy</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
              <li>Engage in harassment, defamation, cyberbullying, doxxing, or hate speech against any individual or creator.</li>
              <li>Deploy automated bots, spiders, or scrapers against our APIs in a manner that degrades system performance or violates rate limits.</li>
              <li>Resell, white-label, or redistribute audit reports without an explicit commercial enterprise agreement.</li>
              <li>Falsely represent our analytical score as an official government or law enforcement determination.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">4. Pro Subscriptions & Billing</h2>
            <p>
              Certain advanced tools (such as bulk audits and agency PDF export features) may require a paid subscription.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
              <li>Subscriptions renew automatically at the end of each billing cycle unless cancelled prior to renewal.</li>
              <li>You may cancel your subscription at any time with immediate effect for subsequent billing intervals.</li>
              <li>Refund requests submitted within 14 days of an initial subscription purchase are honored in full.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">5. Intellectual Property</h2>
            <p>
              All proprietary algorithms, user interface code, visual branding, graphics, and documentation are the exclusive intellectual property of isshereal.com. All rights reserved.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, isshereal.com and its affiliates shall not be liable for any direct, indirect, incidental, or consequential damages resulting from business decisions, sponsorship expenditures, or personal meetings arranged with audited individuals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">7. Changes to Terms</h2>
            <p>
              We reserve the right to revise or modify these Terms at any time. Continued use of the Service following the posting of revised terms constitutes your acceptance of such revisions.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
