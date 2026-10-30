import type { AuditResult } from '@/lib/audit-engine';

/**
 * Client-side helpers for the tools that examine real profiles through the
 * existing GET /api/audit route. The route answers { success, report } and,
 * when it could not reach the profile, a baseline report flagged
 * needsInput / needsVerification. A baseline is never shown as a reading:
 * it was computed from zeros, so the tools call it "not reached".
 */

export type Platform = 'instagram' | 'tiktok' | 'youtube';

export const PLATFORMS: Array<{ value: Platform; label: string; code: string }> = [
  { value: 'instagram', label: 'Instagram', code: 'IG' },
  { value: 'tiktok', label: 'TikTok', code: 'TT' },
  { value: 'youtube', label: 'YouTube', code: 'YT' },
];

export type AuditOutcome =
  | { kind: 'developed'; report: AuditResult }
  | { kind: 'unreached'; handle: string }
  | { kind: 'fogged'; handle: string; message: string };

export const FOGGED_LINE = 'Fogged. The platform didn’t answer, so nothing was developed and nothing was guessed.';

/** Mirror of the API's handle sanitizer, so the page shows what will be sent. */
export function cleanHandle(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\/(www\.|m\.)?(instagram\.com|tiktok\.com|youtube\.com)\/?/i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
    .replace(/^@/, '')
    .replace(/[^a-zA-Z0-9_.]/g, '')
    .toLowerCase()
    .slice(0, 64);
}

/** Platform implied by a pasted link, if any. */
export function platformFromLink(raw: string): Platform | null {
  const s = raw.toLowerCase();
  if (s.includes('tiktok.com')) return 'tiktok';
  if (s.includes('youtube.com') || s.includes('youtu.be')) return 'youtube';
  if (s.includes('instagram.com')) return 'instagram';
  return null;
}

export async function fetchAudit(handle: string, platform: Platform, signal?: AbortSignal): Promise<AuditOutcome> {
  const clean = cleanHandle(handle);
  if (!clean) {
    return { kind: 'fogged', handle, message: 'That isn’t a handle the printer can read. Use letters, numbers, dots and underscores.' };
  }
  let res: Response;
  try {
    res = await fetch(`/api/audit?handle=${encodeURIComponent(clean)}&platform=${platform}`, { signal });
  } catch (err) {
    if (signal?.aborted) throw err;
    return { kind: 'fogged', handle: clean, message: FOGGED_LINE };
  }
  if (!res.ok) {
    return { kind: 'fogged', handle: clean, message: FOGGED_LINE };
  }
  let data: { report?: AuditResult; needsInput?: boolean } | null = null;
  try {
    data = await res.json();
  } catch {
    return { kind: 'fogged', handle: clean, message: FOGGED_LINE };
  }
  if (!data || !data.report) {
    return { kind: 'fogged', handle: clean, message: FOGGED_LINE };
  }
  if (data.needsInput || data.report.needsVerification) {
    return { kind: 'unreached', handle: clean };
  }
  return { kind: 'developed', report: data.report };
}

/** Link to the full report for a developed print. */
export function reportHref(report: AuditResult, platform: string): string {
  const h = report.handle.replace(/^@/, '');
  return `/report/${encodeURIComponent(h)}?platform=${encodeURIComponent(platform)}`;
}

/** Link to the manual bench for a profile the platform would not show us. */
export function benchHref(handle: string): string {
  return `/analyze?handle=${encodeURIComponent(handle)}`;
}

/** "3.4%" or "3.4" from the engine's string, as a number. NaN when absent. */
export function rateNumber(rate: string | undefined): number {
  if (!rate) return NaN;
  return parseFloat(rate.replace('%', ''));
}

export function isRemote(src: string): boolean {
  return /^https?:\/\//.test(src);
}

export function fmtInt(n: number): string {
  return Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '–';
}
