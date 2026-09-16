'use client';

import React from 'react';
import Link from 'next/link';
import {
  Percent,
  GitCompareArrows,
  Hash,
  FileSpreadsheet,
  ScanFace,
  ArrowRight,
} from 'lucide-react';
import { TOOLS } from '@/data/content';

const TOOL_ICONS: Record<string, React.ReactNode> = {
  Percent: <Percent size={22} className="text-emerald-600" />,
  GitCompareArrows: <GitCompareArrows size={22} className="text-emerald-600" />,
  Hash: <Hash size={22} className="text-emerald-600" />,
  FileSpreadsheet: <FileSpreadsheet size={22} className="text-emerald-600" />,
  ScanFace: <ScanFace size={22} className="text-emerald-600" />,
};

export function ToolsSection() {
  return (
    <section id="tools" className="py-24 bg-slate-50/60 border-t border-slate-100">
      <div className="container-x">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Free tools
          </span>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2 tracking-tight">
            More than an auditor — a full toolkit
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3.5">
            Purpose-built calculators and analyzers. Every result uses real math, not guesses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {TOOL_ICONS[tool.icon] || <Percent size={22} className="text-emerald-600" />}
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {tool.text}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <Link
                  href={tool.path}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 group-hover:gap-2.5 transition-all"
                >
                  <span>Open tool</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
