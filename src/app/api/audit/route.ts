import { NextRequest, NextResponse } from 'next/server';
import {
  scrapeInstagramProfile,
  scrapeYouTubeProfile,
  scrapeTikTokProfile,
  calculateProfileScore,
} from '@/lib/audit-engine';
import { saveAuditToStore, getAuditFromStore } from '@/lib/audit-store';
import { getVerifiedCreator } from '@/data/verified-creators';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform = 'instagram', handle = '', followers, following, posts, likes, comments, name, avatarUrl } = body;

    if (!handle || typeof handle !== 'string') {
      return NextResponse.json({ error: 'Profile handle is required' }, { status: 400 });
    }

    const cleanHandle = handle.replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com\/@?)/i, '').replace(/^@/, '').split('/')[0].trim().toLowerCase();

    // 1. Check verified real profiles first
    const verified = getVerifiedCreator(cleanHandle);
    if (verified && (!followers || Number(followers) === verified.followers)) {
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
      return NextResponse.json({ success: true, report: audit });
    }

    // 2. If user provides explicit numbers from form/verification modal
    if (followers !== undefined && Number(followers) > 0) {
      const numFollowers = Number(followers);
      const numFollowing = following !== undefined && following !== '' ? Math.max(0, Number(following)) : 0;
      const numPosts = posts !== undefined && posts !== '' ? Math.max(0, Number(posts)) : 0;
      const customAvatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=059669&color=ffffff&bold=true`;

      const audit = calculateProfileScore({
        platform: (platform.charAt(0).toUpperCase() + platform.slice(1)) as any,
        handle: `@${cleanHandle}`,
        name: name || cleanHandle,
        followers: numFollowers,
        following: numFollowing,
        posts: numPosts,
        likes: likes ? Number(likes) : undefined,
        comments: comments ? Number(comments) : undefined,
        avatarUrl: customAvatar,
      });

      saveAuditToStore(audit);
      return NextResponse.json({ success: true, report: audit });
    }

    // 3. Try live scraping based on platform
    let scrapedData = null;
    const platLower = platform.toLowerCase();

    if (platLower === 'youtube') {
      scrapedData = await scrapeYouTubeProfile(cleanHandle);
    } else if (platLower === 'tiktok') {
      scrapedData = await scrapeTikTokProfile(cleanHandle);
    } else {
      scrapedData = await scrapeInstagramProfile(cleanHandle);
    }

    if (scrapedData && scrapedData.followers > 0) {
      const audit = calculateProfileScore({
        platform: (platform.charAt(0).toUpperCase() + platform.slice(1)) as any,
        handle: scrapedData.handle,
        name: scrapedData.name,
        followers: scrapedData.followers,
        following: scrapedData.following,
        posts: scrapedData.posts,
        avatarUrl: scrapedData.avatarUrl,
        isVerified: scrapedData.isVerifiedReal,
      });

      saveAuditToStore(audit);
      return NextResponse.json({ success: true, report: audit });
    }

    // 4. If platform blocked scraping and no numbers were provided, signal that input is needed
    return NextResponse.json({
      success: true,
      needsInput: true,
      handle: `@${cleanHandle}`,
      platform,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=059669&color=ffffff&bold=true`,
      message: 'Platform firewall restricted automated crawl. Confirm public metrics to complete audit.',
    });
  } catch (error: any) {
    console.error('Audit API error:', error);
    return NextResponse.json({ error: error.message || 'Internal audit error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get('handle') || searchParams.get('id');
  const platform = searchParams.get('platform') || 'instagram';

  if (!handle) {
    return NextResponse.json({ error: 'Handle or ID is required' }, { status: 400 });
  }

  const cleanHandle = handle.replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com\/@?)/i, '').replace(/^@/, '').split('/')[0].trim().toLowerCase();

  // 1. Check in-memory store
  const cached = getAuditFromStore(cleanHandle);
  if (cached) {
    return NextResponse.json({ success: true, report: cached });
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
    return NextResponse.json({ success: true, report: audit });
  }

  // 3. Try live scraping
  let scrapedData = null;
  const platLower = platform.toLowerCase();

  if (platLower === 'youtube') {
    scrapedData = await scrapeYouTubeProfile(cleanHandle);
  } else if (platLower === 'tiktok') {
    scrapedData = await scrapeTikTokProfile(cleanHandle);
  } else {
    scrapedData = await scrapeInstagramProfile(cleanHandle);
  }

  if (scrapedData && scrapedData.followers > 0) {
    const audit = calculateProfileScore({
      platform: (platform.charAt(0).toUpperCase() + platform.slice(1)) as any,
      handle: scrapedData.handle,
      name: scrapedData.name,
      followers: scrapedData.followers,
      following: scrapedData.following,
      posts: scrapedData.posts,
      avatarUrl: scrapedData.avatarUrl,
      isVerified: scrapedData.isVerifiedReal,
    });

    saveAuditToStore(audit);
    return NextResponse.json({ success: true, report: audit });
  }

  // Return unverified/needs-input status with clean avatar, NEVER fake hash numbers
  return NextResponse.json({
    success: true,
    needsInput: true,
    handle: `@${cleanHandle}`,
    platform,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=059669&color=ffffff&bold=true`,
  });
}
