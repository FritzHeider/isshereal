import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export function getRiskColor(score: number): {
  text: string;
  bg: string;
  border: string;
  stroke: string;
  verdict: string;
} {
  if (score >= 75) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      stroke: '#059669',
      verdict: 'Likely authentic',
    };
  }
  if (score >= 50) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      stroke: '#d97706',
      verdict: 'Mostly genuine, minor flags',
    };
  }
  if (score >= 25) {
    return {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      stroke: '#e11d48',
      verdict: 'High risk — likely fake',
    };
  }
  return {
    text: 'text-red-800',
    bg: 'bg-red-50',
    border: 'border-red-300',
    stroke: '#dc2626',
    verdict: 'High scam risk',
  };
}
