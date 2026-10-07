'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: 'Welcome to isshereal.com!',
    description: 'Verify the authenticity of any social media profile in seconds.',
    target: null,
  },
  {
    title: 'Enter a Handle',
    description: 'Type any Instagram, TikTok, YouTube, or X username to start an audit.',
    target: 'search-input',
  },
  {
    title: 'Get Your Score',
    description: 'We analyze followers, engagement, and growth patterns to calculate a trust score from 0-100.',
    target: null,
  },
];

export function OnboardingTour() {
  const [step, setStep] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem('onboarding_seen');
    if (!seen) {
      setStep(0);
      setDismissed(false);
    }
  }, []);

  const dismiss = () => {
    setDismissed(true);
    setStep(null);
    localStorage.setItem('onboarding_seen', 'true');
  };

  const next = () => {
    if (step !== null && step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  if (dismissed || step === null) return null;

  const currentStep = TOUR_STEPS[step];

  return (
    <div className="fixed inset-0 z-[9998] flex items-end justify-center pb-8 sm:items-center sm:pb-0 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 pointer-events-auto" onClick={dismiss} />
      
      {/* Tour card */}
      <div className="relative pointer-events-auto mx-4 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 animate-slide-up">
        <button onClick={dismiss} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Step {step + 1} of {TOUR_STEPS.length}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
          {currentStep.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          {currentStep.description}
        </p>
        
        {/* Progress dots */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={next}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {step < TOUR_STEPS.length - 1 ? (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              'Get Started'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
