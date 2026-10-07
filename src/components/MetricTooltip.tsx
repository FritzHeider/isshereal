'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

export function MetricTooltip({ label }: { label: string }) {
  const id = React.useId();
  
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-describedby={id}
        className="inline-flex items-center justify-center w-4 h-4 text-slate-400 hover:text-emerald-500 dark:text-slate-500 dark:hover:text-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full"
        style={{ anchorName: `--tooltip-${id.replace(/:/g, '')}` } as React.CSSProperties}
        popoverTarget={`tooltip-${id.replace(/:/g, '')}`}
        popoverTargetAction="toggle"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      <div
        id={`tooltip-${id.replace(/:/g, '')}`}
        popover="auto"
        role="tooltip"
        className="m-0 px-3 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg shadow-lg max-w-[220px] leading-relaxed border border-slate-700 dark:border-slate-600"
        style={{
          positionAnchor: `--tooltip-${id.replace(/:/g, '')}`,
          top: 'anchor(bottom)',
          left: 'anchor(center)',
          translate: '-50% 8px',
          positionTryFallbacks: 'flip-block, flip-inline',
        } as React.CSSProperties}
      >
        {label}
      </div>
    </span>
  );
}
