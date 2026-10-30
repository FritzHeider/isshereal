import React from 'react';

/**
 * Darkroom glyph set. Drawn like equipment labels and film edge codes:
 * 24px grid, 1.5px stroke, square terminals, no fills except the
 * "developed" status mark (developed grain is solid by definition).
 */

type Part = { d?: string; rect?: [number, number, number, number]; circle?: [number, number, number]; fill?: boolean; dash?: string };

const GLYPHS = {
  instagram: [{ rect: [4, 4, 16, 16] }, { circle: [12, 12, 3.75] }, { d: 'M16.6 7.4h.01' }],
  tiktok: [{ d: 'M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5' }, { d: 'M14 4c.6 2.4 2.4 4 5 4.2' }],
  youtube: [{ rect: [3, 6, 18, 12] }, { d: 'M10.25 9.5v5l4.25-2.5z' }],
  x: [{ d: 'M5 5l14 14M19 5L5 19' }],
  reddit: [{ circle: [12, 13.5, 6.5] }, { d: 'M12 7l1.5-3.5 3.5 1M9.5 13h.01M14.5 13h.01M9.5 16c1.5 1 3.5 1 5 0' }],
  dating: [{ d: 'M12 19.5S4.5 15 4.5 9.8A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7.5 1.8C19.5 15 12 19.5 12 19.5z' }],
  marketplace: [{ d: 'M4 12.2V4h8.2L20 11.8 11.8 20z' }, { d: 'M8.5 8.5h.01' }],
  freelance: [{ rect: [3, 8, 18, 11] }, { d: 'M9 8V5h6v3M3 13h18' }],
  social: [{ circle: [9, 9, 3.5] }, { d: 'M3.5 19.5a5.5 5.5 0 0 1 11 0M15.5 6.5a3 3 0 1 1 0 5.5M17 14.5a5 5 0 0 1 3.5 5' }],
  tray: [{ d: 'M3 10h18l-2 8.5H5z' }, { d: 'M7 10V7h10v3' }],
  enlarger: [{ d: 'M12 3v4' }, { d: 'M8 7h8l-1.5 4h-5z' }, { d: 'M12 11v5M5 20.5h14M9 16h6v4.5H9z' }],
  loupe: [{ circle: [10.5, 10.5, 6] }, { d: 'M15 15l5.5 5.5' }],
  lightbox: [{ rect: [3, 5, 18, 12] }, { d: 'M7 9h4v4H7zM13 9h4v4h-4zM8 20.5h8' }],
  teststrip: [{ rect: [3, 8, 18, 8] }, { d: 'M7.5 8v8M12 8v8M16.5 8v8' }],
  sleeve: [{ rect: [4, 3, 16, 18] }, { d: 'M4 9h16M4 15h16M7 6h3M7 12h3M7 18h3' }],
  contact: [{ rect: [3, 4, 18, 16] }, { d: 'M3 7.5h18M3 16.5h18M7.5 7.5v9M12 7.5v9M16.5 7.5v9' }],
  timer: [{ circle: [12, 13.5, 7] }, { d: 'M12 13.5V9.5M10 3h4M18 7l1.5-1.5' }],
  canister: [{ rect: [6, 6, 12, 15] }, { d: 'M8 3h8v3M6 10h12M6 17h12' }],
  hash: [{ d: 'M5 9h14M5 15h14M10 4L8 20M16 4l-2 16' }],
  developed: [{ rect: [5, 5, 14, 14], fill: true }],
  ghost: [{ rect: [5, 5, 14, 14], dash: '2.5 2.5' }],
  fogged: [{ rect: [5, 5, 14, 14] }, { d: 'M5 10l5-5M5 15l10-10M5 19l14-14M9 19l10-10M14 19l5-5' }],
  warning: [{ d: 'M12 4l9 16H3z' }, { d: 'M12 10v4.5M12 17.25h.01' }],
  check: [{ d: 'M4.5 12.5l4.75 4.75L19.5 7' }],
  close: [{ d: 'M6 6l12 12M18 6L6 18' }],
  menu: [{ d: 'M4 7h16M4 12h16M4 17h10' }],
  'arrow-right': [{ d: 'M4 12h15M13.5 6.5L19 12l-5.5 5.5' }],
  'arrow-left': [{ d: 'M20 12H5M10.5 6.5L5 12l5.5 5.5' }],
  'arrow-up-right': [{ d: 'M7 17L17 7M8.5 7H17v8.5' }],
  'arrow-down': [{ d: 'M12 4v15M6.5 13.5L12 19l5.5-5.5' }],
  copy: [{ rect: [8, 8, 12, 12] }, { d: 'M16 8V4H4v12h4' }],
  export: [{ d: 'M12 4v11M7 10l5 5 5-5M4 20h16' }],
  share: [{ d: 'M14.5 5l5.5 5-5.5 5' }, { d: 'M20 10h-8.5A6.5 6.5 0 0 0 5 16.5V19' }],
  edit: [{ d: 'M4.5 19.5l1-4.5L16 4.5 19.5 8 9 18.5z' }, { d: 'M13.5 7l3.5 3.5' }],
  refresh: [{ d: 'M19.5 11.5a7.5 7.5 0 1 1-2.2-5.3' }, { d: 'M19.5 4.5v5h-5' }],
  external: [{ d: 'M14 4h6v6M20 4l-8.5 8.5M18 14v6H4V6h6' }],
  file: [{ d: 'M6 3h9l4 4v14H6z' }, { d: 'M14.5 3v4.5H19' }],
  code: [{ d: 'M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5' }],
  mail: [{ rect: [3, 5, 18, 14] }, { d: 'M3 6.5l9 7 9-7' }],
  user: [{ circle: [12, 8.5, 3.75] }, { d: 'M4.75 20a7.25 7.25 0 0 1 14.5 0' }],
  bulb: [{ d: 'M9 18h6M10 21h4' }, { d: 'M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z' }],
  plus: [{ d: 'M12 5v14M5 12h14' }],
  minus: [{ d: 'M5 12h14' }],
  sort: [{ d: 'M8 4v16M4.5 7.5L8 4l3.5 3.5M16 20V4M12.5 16.5L16 20l3.5-3.5' }],
  'sort-up': [{ d: 'M12 20V5M6.5 10.5L12 5l5.5 5.5' }],
  'sort-down': [{ d: 'M12 4v15M6.5 13.5L12 19l5.5-5.5' }],
  book: [{ d: 'M4 4.5h6a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H4zM20 4.5h-6a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h6z' }],
  pin: [{ circle: [12, 8, 3.5] }, { d: 'M12 11.5V21' }],
} satisfies Record<string, Part[]>;

export type GlyphName = keyof typeof GLYPHS;

export function Glyph({
  name,
  size = 20,
  title,
  className,
  strokeWidth = 1.5,
}: {
  name: GlyphName;
  size?: number;
  title?: string;
  className?: string;
  strokeWidth?: number;
}) {
  const parts = GLYPHS[name] as Part[];
  return (
    <svg
      className={['glyph', className].filter(Boolean).join(' ')}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {parts.map((p, i) => {
        const fill = p.fill ? 'currentColor' : undefined;
        if (p.rect) return <rect key={i} x={p.rect[0]} y={p.rect[1]} width={p.rect[2]} height={p.rect[3]} fill={fill} strokeDasharray={p.dash} />;
        if (p.circle) return <circle key={i} cx={p.circle[0]} cy={p.circle[1]} r={p.circle[2]} fill={fill} />;
        return <path key={i} d={p.d} fill={fill} strokeDasharray={p.dash} />;
      })}
    </svg>
  );
}

/** Map a platform name from the audit engine to its edge-code glyph. */
export function platformGlyph(platform?: string): GlyphName {
  const p = (platform || '').toLowerCase();
  if (p.includes('insta')) return 'instagram';
  if (p.includes('tiktok')) return 'tiktok';
  if (p.includes('youtube')) return 'youtube';
  if (p === 'x' || p.includes('twitter')) return 'x';
  if (p.includes('reddit')) return 'reddit';
  if (p.includes('hinge') || p.includes('tinder') || p.includes('bumble') || p.includes('dating')) return 'dating';
  if (p.includes('market')) return 'marketplace';
  if (p.includes('fiverr') || p.includes('upwork') || p.includes('freelance')) return 'freelance';
  return 'social';
}

/** Short film-edge code for a platform, e.g. "IG", "TT", "YT". */
export function platformCode(platform?: string): string {
  const p = (platform || '').toLowerCase();
  if (p.includes('insta')) return 'IG';
  if (p.includes('tiktok')) return 'TT';
  if (p.includes('youtube')) return 'YT';
  if (p === 'x' || p.includes('twitter')) return 'X';
  if (p.includes('reddit')) return 'RD';
  if (p.includes('hinge') || p.includes('tinder') || p.includes('bumble') || p.includes('dating')) return 'DT';
  if (p.includes('market')) return 'MK';
  if (p.includes('fiverr') || p.includes('upwork') || p.includes('freelance')) return 'FL';
  return 'SC';
}
