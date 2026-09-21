'use client';

import { DollarSign, Calculator, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCalculatorProps {
  followers: number;
  engagementRate: number;
  platform: string;
}

export function PricingCalculator({ followers, engagementRate, platform }: PricingCalculatorProps) {
  const getBaseCPM = (plat: string) => {
    switch (plat.toLowerCase()) {
      case 'youtube': return 15;
      case 'instagram': return 10;
      case 'tiktok': return 8;
      case 'twitter':
      case 'x': return 5;
      default: return 10;
    }
  };

  const cpm = getBaseCPM(platform);
  // Base price = (followers * engagementRate / 100 * CPM) / 1000
  const estimatedReach = followers * (engagementRate / 100);
  const basePrice = (estimatedReach * cpm) / 1000;
  
  // Calculate range +/- 20%
  const minPrice = Math.max(10, Math.floor(basePrice * 0.8));
  const maxPrice = Math.ceil(basePrice * 1.2);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/5 dark:to-emerald-600/5 p-6 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
        <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
          <Calculator className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">Estimated Sponsored Post Value</h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-6 mb-6">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Estimated Range</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{formatCurrency(minPrice)}</span>
            <span className="text-slate-400 text-xl">—</span>
            <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{formatCurrency(maxPrice)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <DollarSign className="w-5 h-5 text-emerald-500 mb-2" />
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase mb-1">Base CPM</span>
            <span className="font-semibold text-slate-900 dark:text-white">${cpm}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase mb-1">Est. True Reach</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatNumber(estimatedReach)}</span>
          </div>
        </div>

        <div className="text-xs text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          Note: Based on authentic follower count, real engagement rate, and platform benchmarks. Actual rates vary by niche and negotiation.
        </div>
      </div>
    </div>
  );
}
