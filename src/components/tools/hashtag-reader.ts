/**
 * Reads a set of hashtags from their text alone. Nothing here queries a
 * platform, so it cannot see live reach or whether a tag is restricted today.
 * It reports what can be read honestly from the characters: engagement-bait
 * patterns, tags on a fixed list of very broad tags, tags that will not link
 * as typed, and duplicates.
 */

export type TagClass = 'ghost' | 'broken' | 'saturated' | 'specific';

export interface TagReading {
  n: number;
  raw: string;
  tag: string;
  /** What the platform would actually link, for tags broken by punctuation. */
  links: string;
  cls: TagClass;
  length: number;
  spamSignals: string[];
  saturated: boolean;
  note: string;
}

export interface SleeveReading {
  tags: TagReading[];
  duplicates: string[];
  counts: Record<TagClass, number>;
  total: number;
}

/** Instagram allows 30 hashtags on a post; more and the caption will not post. */
export const INSTAGRAM_TAG_LIMIT = 30;

/** Engagement-bait tags: asking for follows, likes or comments in exchange. */
const BAIT = new Set([
  'followforfollow', 'follow4follow', 'f4f', 'followback', 'followme', 'follow', 'followers',
  'followtrain', 'teamfollowback', 'followforfollowback', 'follow4followback',
  'likeforlike', 'like4like', 'l4l', 'likeforlikes', 'likes', 'likeback', 'instalike', 'instalikes',
  'tagsforlikes', 'likesforlikes', 'commentforcomment', 'comment4comment', 'c4c',
  'sub4sub', 'subforsub', 'shoutout4shoutout', 'shoutoutforshoutout', 's4s', 'spam4spam',
  'gainpost', 'gaintrain', 'gainfollowers', 'followall', 'pleasefollow',
]);

const BAIT_PATTERNS: Array<[RegExp, string]> = [
  [/(follow|like|comment|sub|shoutout|share|spam)s?(4|for)(follow|like|comment|sub|shoutout|share|spam)/, 'trade pattern: x-for-x'],
  [/^[flcs]4[flcs]$/, 'trade shorthand'],
  [/^gain(train|post|followers|likes)/, 'follower-gain pattern'],
  [/follow(back|me|all|train)/, 'follow request'],
];

/** Very broad tags. Posts under them are buried within minutes. */
const SATURATED = new Set([
  'instagood', 'love', 'photooftheday', 'fashion', 'beautiful', 'happy', 'cute', 'tbt', 'picoftheday',
  'instadaily', 'selfie', 'summer', 'art', 'nature', 'fitness', 'lifestyle', 'travel', 'food', 'style',
  'explorepage', 'explore', 'viral', 'fyp', 'foryou', 'foryoupage', 'trending', 'reels', 'instagram',
  'photography', 'music', 'motivation', 'beauty', 'girl', 'model', 'smile', 'friends', 'fun', 'repost',
  'instamood', 'me', 'like', 'photo', 'dog', 'cat', 'family', 'life', 'reelsinstagram', 'tiktok',
]);

export function readSleeve(input: string): SleeveReading {
  const tokens = input
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && t !== '#');

  const seen = new Set<string>();
  const duplicates: string[] = [];
  const tags: TagReading[] = [];

  for (const raw of tokens) {
    const body = raw.replace(/^#+/, '');
    if (!body) continue;
    const lower = body.toLowerCase();
    // A hashtag links only up to the first character that is not a letter, digit or underscore.
    const linkMatch = lower.match(/^[\p{L}\p{N}_]+/u);
    const links = linkMatch ? linkMatch[0] : '';
    const key = links || lower;
    if (seen.has(key)) {
      duplicates.push(`#${key}`);
      continue;
    }
    seen.add(key);

    const spamSignals: string[] = [];
    if (BAIT.has(key)) spamSignals.push('on the engagement-bait list');
    for (const [re, label] of BAIT_PATTERNS) {
      if (re.test(key) && !spamSignals.includes(label)) spamSignals.push(label);
    }
    if (/(.)\1{3,}/.test(key)) spamSignals.push('repeated characters');

    const broken = links !== lower;
    const saturated = SATURATED.has(key);

    let cls: TagClass = 'specific';
    let note = 'Specific enough to be found by people looking for it.';
    if (spamSignals.length) {
      cls = 'ghost';
      note = 'Asks for follows or likes in trade. Audiences built this way rarely come through.';
    } else if (broken) {
      cls = 'broken';
      note = links
        ? `Only #${links} will link. Everything from the “${lower.charAt(links.length)}” on is plain text.`
        : 'Starts with a character a hashtag cannot hold, so nothing links.';
    } else if (saturated) {
      cls = 'saturated';
      note = 'One of the broadest tags there is. A post under it is buried within minutes.';
    }

    tags.push({
      n: tags.length + 1,
      raw,
      tag: key,
      links,
      cls,
      length: body.length,
      spamSignals,
      saturated,
      note,
    });
  }

  const counts: Record<TagClass, number> = { ghost: 0, broken: 0, saturated: 0, specific: 0 };
  for (const t of tags) counts[t.cls]++;

  return { tags, duplicates, counts, total: tags.length };
}
