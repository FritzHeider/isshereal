'use client';

import React from 'react';
import { getRiskColor, cn } from '@/lib/utils';

interface RiskBadgeProps {
  score?: number;
  label?: string;
  className?: string;
}

export function RiskBadge({ score, label, className }: RiskBadgeProps) {
  if (score !== undefined) {
    const { bg, text, border, verdict } = getRiskColor(score);
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
          bg,
          text,
          border,
          className
        )}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: 'currentColor' }}
        />
        {label || verdict}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:border-slate-800',
        className
      )}
    >
      {label}
    </span>
  );
}
