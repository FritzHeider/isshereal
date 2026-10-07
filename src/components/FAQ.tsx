import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '@/data/content';

export function FAQ() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800">
      <div className="container-x max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            FAQ
          </span>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            Questions, answered
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => {
            return (
              <details
                key={faq.q}
                name="faq"
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer text-left font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 hover:text-emerald-600 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 group-open:rotate-180 group-open:text-emerald-600" />
                </summary>
                <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50">
                  {faq.a}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
