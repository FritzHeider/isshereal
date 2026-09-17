'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  MessageSquare,
  Building,
  ShieldCheck,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [category, setCategory] = useState('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="pt-28 pb-20">
      <section className="container-x max-w-5xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Company</span>
          <span>/</span>
          <span className="text-slate-800">Contact</span>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <Clock size={13} />
            Average Response Time: Under 2 Hours
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Have questions about a forensic report, need high-volume enterprise API access, or want to submit feedback? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Thank you for reaching out, <strong className="text-slate-900">{name}</strong>. A member of our forensic operations team has received your ticket and will respond to <strong className="text-slate-900">{email}</strong> shortly.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Inquiry Category
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'general', label: 'General Inquiry' },
                      { id: 'api', label: 'Enterprise / API' },
                      { id: 'takedown', label: 'Cache Purge / Unlist' },
                      { id: 'support', label: 'Bug / Technical' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`p-3 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                          category === c.id
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Relevant Profile Handle / URL <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="@username or https://instagram.com/..."
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    How can we help?
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide as much detail as possible..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending message...' : 'Send Message'}
                  {!loading && <Send size={16} />}
                </Button>
              </form>
            )}
          </div>

          {/* Direct channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 space-y-6">
              <h3 className="text-xl font-bold">Direct Channels</h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">General Support</div>
                    <div className="text-slate-400 text-xs mt-0.5">support@isshereal.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Enterprise & API Partnerships</div>
                    <div className="text-slate-400 text-xs mt-0.5">enterprise@isshereal.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Security & Privacy Disclosures</div>
                    <div className="text-slate-400 text-xs mt-0.5">security@isshereal.com</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" />
                Hosted globally on Cloudflare Edge Infrastructure
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-600 space-y-2 leading-relaxed">
              <strong className="block text-slate-900 font-bold">Need instant answers?</strong>
              <p>
                Try running an automated audit first. Profiles are scanned dynamically in real-time through our free auditor.
              </p>
              <Link href="/analyze" className="inline-flex items-center text-emerald-600 font-bold hover:underline pt-1">
                Go to Auditor &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
