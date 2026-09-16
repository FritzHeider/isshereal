'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-12 border-t border-slate-800">
      <div className="container-x">
        {/* Pre-footer Call to Action Banner */}
        <div className="rounded-3xl bg-linear-to-r from-emerald-900/50 to-slate-800 border border-emerald-500/20 p-8 sm:p-12 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <h3 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Stop guessing. Know who's real.
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mt-2.5">
              Run your first authenticity audit in seconds — free, no login, no password ever.
            </p>
          </div>
          <Link href="/analyze">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-7 py-3 rounded-full text-base shadow-lg shadow-emerald-500/20">
              <span>Analyze a profile</span>
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-16 border-b border-slate-800">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <ShieldCheck size={18} />
              </span>
              <span className="font-extrabold text-lg text-white">
                isshereal<span className="text-emerald-400">.com</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Know who is real. Detect fake followers, bots, catfish and scam profiles across every platform.
            </p>
          </div>

          {/* Product Col */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/analyze" className="hover:text-emerald-400 transition-colors">
                  Full audit
                </Link>
              </li>
              <li>
                <Link href="/tools/engagement-rate" className="hover:text-emerald-400 transition-colors">
                  Engagement calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/compare" className="hover:text-emerald-400 transition-colors">
                  Profile comparison
                </Link>
              </li>
              <li>
                <Link href="/tools/hashtags" className="hover:text-emerald-400 transition-colors">
                  Hashtag analyzer
                </Link>
              </li>
            </ul>
          </div>

          {/* Use Cases Col */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-4">
              Use cases
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-default">
                  Influencer vetting
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-default">
                  Dating safety
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-default">
                  Marketplace buyers
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-default">
                  Hiring freelancers
                </span>
              </li>
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-default">
                  About
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-default">
                  Privacy
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-default">
                  Terms
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-default">
                  Contact
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright and Privacy Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 isshereal.com — authenticity analytics for everyone.
          </div>
          <div className="text-slate-400 flex items-center gap-1.5 font-medium">
            <ShieldCheck size={14} className="text-emerald-400" />
            Built for trust. Never asks for passwords or private data.
          </div>
        </div>
      </div>
    </footer>
  );
}
