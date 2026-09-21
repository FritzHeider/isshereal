'use client';

import React, { useEffect, useState } from 'react';
import { getRiskColor } from '@/lib/utils';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  animate?: boolean;
}

export function ScoreGauge({
  score,
  size = 112,
  strokeWidth = 12,
  showLabel = true,
  animate = true,
}: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) return;
    
    let startTime: number;
    const duration = 1200; // 1.2s

    const easeOutCubic = (x: number): number => {
      return 1 - Math.pow(1 - x, 3);
    };

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easedProgress = easeOutCubic(progress);
      setDisplayScore(Math.round(easedProgress * score));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [score, animate]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use displayScore for animation of the ring as well if animate is true
  const strokeDashoffset = circumference - ((animate ? displayScore : score) / 100) * circumference;
  const { stroke, text } = getRiskColor(animate ? displayScore : score);

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          className="dark:stroke-slate-800"
          strokeWidth={strokeWidth}
        />
        {/* Colored Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="score-circle transition-all duration-75 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`font-bold font-display text-2xl ${text}`}>
            {displayScore}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">/100</span>
        </div>
      )}
    </div>
  );
}
