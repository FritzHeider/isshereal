'use client';

import React from 'react';
import { MousePointerClick, Keyboard, Cpu } from 'lucide-react';
import { HOW_IT_WORKS } from '@/data/content';

const STEP_ICONS: Record<string, React.ReactNode> = {
  MousePointerClick: <MousePointerClick size={24} className="text-emerald-600" />,
  Keyboard: <Keyboard size={24} className="text-emerald-600" />,
  Cpu: <Cpu size={24} className="text-emerald-600" />,
};

export function HowItWorks() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            How it works
          </span>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2 tracking-tight">
            A real verdict in three steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {HOW_IT_WORKS.map((step, idx) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-slate-200/80 bg-slate-50/30 p-8 flex flex-col items-start hover:border-emerald-200 hover:shadow-md transition-all"
            >
              {/* Step Number Badge */}
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold text-base flex items-center justify-center mb-6 shadow-sm shadow-emerald-500/20">
                {idx + 1}
              </div>

              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                {STEP_ICONS[step.icon]}
              </div>

              <h3 className="font-bold text-xl text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
