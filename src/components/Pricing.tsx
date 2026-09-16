'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { PRICING } from '@/data/content';
import { Button } from './ui/button';

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white border-t border-slate-100">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Pricing
          </span>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2 tracking-tight">
            Choose the plan that fits you
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3.5">
            Start free. Upgrade when you need unlimited audits and pro tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {PRICING.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                tier.highlight
                  ? 'border-2 border-emerald-600 bg-emerald-50/20 shadow-xl shadow-emerald-500/10 scale-105 z-10'
                  : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-extrabold text-xl text-slate-900">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-extrabold text-4xl text-slate-900">
                    ${tier.price}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    / {tier.unit}
                  </span>
                </div>

                {/* Feature checklist */}
                <ul className="mt-8 space-y-3.5 text-sm text-slate-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={13} className="stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <Button
                  className={`w-full h-11 text-sm font-semibold rounded-full ${
                    tier.highlight
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {tier.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
