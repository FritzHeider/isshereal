'use client';

import React from 'react';

interface ProgressBarProps {
  label: string;
  pct: number;
  color?: string;
  height?: string;
}

export function ProgressBar({
  label,
  pct,
  color = '#059669',
  height = 'h-2',
}: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs mb-1.5">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="font-semibold" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className={`w-full ${height} rounded-full bg-slate-100 overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.min(100, Math.max(0, pct))}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
