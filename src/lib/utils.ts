import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
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

/** Darkroom verdict tone for a score: developed (genuine), mixed, or ghost (fake). */
export function scoreTone(score: number): 'developed' | 'mixed' | 'ghost' {
  if (score >= 75) return 'developed';
  if (score >= 50) return 'mixed';
  return 'ghost';
}

/** The short grease-pencil verdict written on a print's border. */
export function greaseVerdict(score: number): string {
  if (score >= 85) return 'Came through clean';
  if (score >= 75) return 'Mostly came through';
  if (score >= 50) return 'Partly developed';
  if (score >= 30) return 'Mostly ghost';
  return 'Never came up';
}
