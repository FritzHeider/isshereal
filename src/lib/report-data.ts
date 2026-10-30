import { SAMPLE_REPORTS } from '@/data/content';
import { getVerifiedCreator } from '@/data/verified-creators';
import { calculateProfileScore, parseCount, type AuditResult } from '@/lib/audit-engine';

/** Normalise a report id or handle the way every report route does. */
export function cleanReportHandle(raw: string): string {
  return (raw || '')
    .replace(/^(ig_|instagram_|youtube_|tiktok_)/i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
    .toLowerCase()
    .trim();
}

/**
 * Resolve a profile we already hold (a verified creator on file, or one of
 * the fictional examples) without any network call. Returns null for
 * anything that has to be examined live.
 */
export function resolveKnownReport(cleanHandle: string): AuditResult | null {
  const verified = getVerifiedCreator(cleanHandle);
  if (verified) {
    return calculateProfileScore({
      platform: verified.platform as AuditResult['platform'],
      handle: verified.handle,
      name: verified.name,
      followers: verified.followers,
      following: verified.following,
      posts: verified.posts,
      avatarUrl: verified.avatarUrl,
      isVerified: true,
    });
  }
  const sample = SAMPLE_REPORTS.find((r) => r.id.toLowerCase() === cleanHandle);
  if (sample) {
    const followers = parseCount(sample.followers) || 10000;
    const base = calculateProfileScore({
      platform: (sample.platform || 'Instagram') as AuditResult['platform'],
      handle: sample.handle,
      name: sample.name,
      followers,
      following: 450,
      posts: 120,
      avatarUrl: sample.avatarImage,
      isVerified: sample.score > 80,
    });
    return {
      ...base,
      ...sample,
      platform: (sample.platform || 'Instagram') as AuditResult['platform'],
      followersCount: followers,
      followingCount: 450,
      postsCount: 120,
      realPct: 100 - sample.fakePct,
    };
  }
  return null;
}
