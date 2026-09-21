import { NextRequest, NextResponse } from 'next/server';
import {
  scrapeInstagramProfile,
  scrapeYouTubeProfile,
  scrapeTikTokProfile,
  calculateProfileScore,
} from '@/lib/audit-engine';
import { saveAuditToStore, getAuditFromStore } from '@/lib/audit-store';
import { getVerifiedCreator } from '@/data/verified-creators';

// ── Security constants ───────────────────────────────────────────────────
const MAX_HANDLE_LENGTH = 64;
const ALLOWED_PLATFORMS = ['instagram', 'youtube', 'tiktok', 'x', 'reddit', 'dating', 'marketplace', 'freelance'];
const MAX_NUMERIC_VALUE = 100_000_000_000; // 100B cap
const MAX_BODY_SIZE_FIELDS = 10;

const cacheHeaders = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
};

/** Sanitize a handle: strip URLs, @, special chars, enforce length */
function sanitizeHandle(raw: string): string {
  return raw
    .replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com\/@?)/i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
    .replace(/[^a-zA-Z0-9_.]/g, '')
    .trim()
    .toLowerCase()
    .slice(0, MAX_HANDLE_LENGTH);
}

/** Clamp a numeric input to safe bounds */
function safeNum(val: unknown, fallback: number = 0): number {
  if (val === undefined || val === null || val === '') return fallback;
  const n = Number(val);
  if (isNaN(n) || !isFinite(n)) return fallback;
  return Math.max(0, Math.min(n, MAX_NUMERIC_VALUE));
}

/** Sanitize platform input against allowlist */
function sanitizePlatform(raw: string): string {
  const lower = raw.toLowerCase().trim();
  return ALLOWED_PLATFORMS.includes(lower) ? lower : 'instagram';
}

/** Capitalize first letter */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Reject if body has too many fields (payload stuffing defense)
    if (Object.keys(body).length > MAX_BODY_SIZE_FIELDS) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { handle = '', followers, following, posts, likes, comments, name, avatarUrl } = body;
    const platform = sanitizePlatform(body.platform || 'instagram');

    if (!handle || typeof handle !== 'string') {
      return NextResponse.json({ error: 'Profile handle is required' }, { status: 400 });
    }

    const cleanHandle = sanitizeHandle(handle);

    if (!cleanHandle) {
      return NextResponse.json({ error: 'Invalid handle format' }, { status: 400 });
    }

    // 1. Check verified real profiles first
    const verified = getVerifiedCreator(cleanHandle);
    if (verified && (!followers || safeNum(followers) === verified.followers)) {
      const audit = calculateProfileScore({
        platform: verified.platform as any,
        handle: verified.handle,
        name: verified.name,
        followers: verified.followers,
        following: verified.following,
        posts: verified.posts,
        avatarUrl: verified.avatarUrl,
        isVerified: true,
      });
      saveAuditToStore(audit);
      return NextResponse.json({ success: true, report: audit }, { headers: cacheHeaders });
    }

    // 2. If user provides explicit numbers from form/verification modal
    if (followers !== undefined && safeNum(followers) > 0) {
      const numFollowers = safeNum(followers);
      const numFollowing = safeNum(following);
      const numPosts = safeNum(posts);
      const sanitizedName = typeof name === 'string' ? name.slice(0, 100).replace(/[<>"'&]/g, '') : cleanHandle;
      const customAvatar = typeof avatarUrl === 'string' && avatarUrl.startsWith('https://')
        ? avatarUrl.slice(0, 500)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=059669&color=ffffff&bold=true`;

      const audit = calculateProfileScore({
        platform: capitalize(platform) as any,
        handle: `@${cleanHandle}`,
        name: sanitizedName,
        followers: numFollowers,
        following: numFollowing,
        posts: numPosts,
        likes: likes ? safeNum(likes) : undefined,
        comments: comments ? safeNum(comments) : undefined,
        avatarUrl: customAvatar,
      });

      saveAuditToStore(audit);
      return NextResponse.json({ success: true, report: audit }, { headers: cacheHeaders });
    }

    // 3. Try live scraping based on platform
    let scrapedData = null;

    if (platform === 'youtube') {
      scrapedData = await scrapeYouTubeProfile(cleanHandle);
    } else if (platform === 'tiktok') {
      scrapedData = await scrapeTikTokProfile(cleanHandle);
    } else {
      scrapedData = await scrapeInstagramProfile(cleanHandle);
    }

    if (scrapedData && scrapedData.followers > 0) {
      const audit = calculateProfileScore({
        platform: capitalize(platform) as any,
        handle: scrapedData.handle,
        name: scrapedData.name,
        followers: scrapedData.followers,
        following: scrapedData.following,
        posts: scrapedData.posts,
        avatarUrl: scrapedData.avatarUrl,
        isVerified: scrapedData.isVerifiedReal,
      });

      saveAuditToStore(audit);
      return NextResponse.json({ success: true, report: audit }, { headers: cacheHeaders });
    }

    // 4. Return provisional baseline report with needsVerification flag
    const baseline = calculateProfileScore({
      platform: capitalize(platform) as any,
      handle: `@${cleanHandle}`,
      name: cleanHandle.charAt(0).toUpperCase() + cleanHandle.slice(1),
      followers: 12500,
      following: 480,
      posts: 96,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=059669&color=ffffff&bold=true`,
    });
    baseline.needsVerification = true;
    saveAuditToStore(baseline);

    return NextResponse.json({
      success: true,
      report: baseline,
      needsInput: true,
      handle: `@${cleanHandle}`,
      platform,
      message: 'Platform firewall restricted automated crawl. Showing preliminary baseline.',
    }, { headers: cacheHeaders });
  } catch (error: unknown) {
    console.error('Audit API error:', error);
    // Never leak internal error details to the client
    return NextResponse.json({ error: 'An internal error occurred. Please try again.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handleParam = searchParams.get('handle') || searchParams.get('id');
  const platform = sanitizePlatform(searchParams.get('platform') || 'instagram');

  if (!handleParam) {
    return NextResponse.json({ error: 'Handle or ID is required' }, { status: 400 });
  }

  const cleanHandle = sanitizeHandle(handleParam);

  if (!cleanHandle) {
    return NextResponse.json({ error: 'Invalid handle format' }, { status: 400 });
  }

  // 1. Check in-memory store
  const cached = getAuditFromStore(cleanHandle);
  if (cached) {
    return NextResponse.json({ success: true, report: cached }, { headers: cacheHeaders });
  }

  // 2. Check verified real profiles
  const verified = getVerifiedCreator(cleanHandle);
  if (verified) {
    const audit = calculateProfileScore({
      platform: verified.platform as any,
      handle: verified.handle,
      name: verified.name,
      followers: verified.followers,
      following: verified.following,
      posts: verified.posts,
      avatarUrl: verified.avatarUrl,
      isVerified: true,
    });
    saveAuditToStore(audit);
    return NextResponse.json({ success: true, report: audit }, { headers: cacheHeaders });
  }

  // 3. Try live scraping
  let scrapedData = null;

  if (platform === 'youtube') {
    scrapedData = await scrapeYouTubeProfile(cleanHandle);
  } else if (platform === 'tiktok') {
    scrapedData = await scrapeTikTokProfile(cleanHandle);
  } else {
    scrapedData = await scrapeInstagramProfile(cleanHandle);
  }

  if (scrapedData && scrapedData.followers > 0) {
    const audit = calculateProfileScore({
      platform: capitalize(platform) as any,
      handle: scrapedData.handle,
      name: scrapedData.name,
      followers: scrapedData.followers,
      following: scrapedData.following,
      posts: scrapedData.posts,
      avatarUrl: scrapedData.avatarUrl,
      isVerified: scrapedData.isVerifiedReal,
    });

    saveAuditToStore(audit);
    return NextResponse.json({ success: true, report: audit }, { headers: cacheHeaders });
  }

  // Return provisional baseline audit if scraping was firewalled
  const baseline = calculateProfileScore({
    platform: capitalize(platform) as any,
    handle: `@${cleanHandle}`,
    name: cleanHandle.charAt(0).toUpperCase() + cleanHandle.slice(1),
    followers: 12500,
    following: 480,
    posts: 96,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=059669&color=ffffff&bold=true`,
  });
  baseline.needsVerification = true;
  saveAuditToStore(baseline);

  return NextResponse.json({
    success: true,
    report: baseline,
    needsInput: true,
    handle: `@${cleanHandle}`,
    platform,
  }, { headers: cacheHeaders });
}
