import React from 'react';

interface RadarChartProps {
  data: {
    engagement: number;
    growth: number;
    quality: number;
    consistency: number;
    maturity: number;
  };
  size?: number;
}

export function RadarChart({ data, size = 280 }: RadarChartProps) {
  const center = size / 2;
  const radius = (size / 2) * 0.7;
  const keys = ['engagement', 'growth', 'quality', 'consistency', 'maturity'] as const;
  
  const getPoint = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / keys.length - Math.PI / 2;
    const distance = (value / 100) * radius;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  };

  const points = keys.map((key, i) => getPoint(data[key], i));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  const levels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} className="mx-auto overflow-visible">
      {levels.map((level, i) => {
        const levelPoints = keys.map((_, index) => getPoint(100 * level, index));
        const levelPath = levelPoints.map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';
        return (
          <path
            key={i}
            d={levelPath}
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="1"
          />
        );
      })}
      {keys.map((_, i) => {
        const p = getPoint(100, i);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="1"
          />
        );
      })}
      <path
        d={pathData}
        className="fill-emerald-500/20 stroke-emerald-500"
        strokeWidth="2"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          className="fill-emerald-500"
        />
      ))}
      {keys.map((key, i) => {
        const p = getPoint(115, i);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-600 dark:fill-slate-400 text-xs font-medium capitalize"
          >
            {key}
          </text>
        );
      })}
    </svg>
  );
}
