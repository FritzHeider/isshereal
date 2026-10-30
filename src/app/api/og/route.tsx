import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

/**
 * Social preview (1200×630): a print in the darkroom. With a handle it
 * shows that report's developed and ghost shares; without one it is the
 * site's own card. Colors mirror design/tokens.css (sRGB equivalents,
 * since the image renderer has no OKLCH).
 */

const ROOM = '#170c0a';
const REBATE = '#0a0403';
const PAPER = '#f1e6da';
const SILVER = '#22140f';
const TEXT = '#f2d8ca';
const TEXT_2 = '#c9a99a';
const SAFE = '#de3d34';
const AMBER = '#f2af48';
const CYAN = '#6cc7d7';
const WAX = '#8a5a1e';

function sanitizeHandle(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 40);
}

function clampPct(raw: string | null, fallback: number) {
  const n = parseInt(raw || '', 10);
  return Number.isNaN(n) ? fallback : Math.max(0, Math.min(100, n));
}

function verdictFor(score: number) {
  if (score >= 85) return 'Came through clean';
  if (score >= 75) return 'Mostly came through';
  if (score >= 50) return 'Partly developed';
  if (score >= 30) return 'Mostly ghost';
  return 'Never came up';
}

async function font(req: NextRequest, file: string) {
  const res = await fetch(new URL(`/og/${file}`, req.url));
  return res.arrayBuffer();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawHandle = searchParams.get('handle');
  const handle = rawHandle ? sanitizeHandle(rawHandle) : '';
  const score = clampPct(searchParams.get('score'), handle ? 50 : 31);
  const ghost = clampPct(searchParams.get('ghost'), handle ? Math.max(4, Math.min(88, 105 - score)) : 67);
  const developed = 100 - ghost;

  const [display900, display300, mono] = await Promise.all([
    font(req, 'bsd-900.ttf'),
    font(req, 'bsd-300.ttf'),
    font(req, 'plex-500.ttf'),
  ]);

  // The print: a 16×16 grain field, ghosts clustered, seeded by the handle
  const N = 16;
  let seed = (handle || 'isshereal').split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const cx = 4 + rnd() * 8;
  const cy = 4 + rnd() * 8;
  const order = Array.from({ length: N * N }, (_, i) => ({ i, k: Math.hypot((i % N) - cx, Math.floor(i / N) - cy) + rnd() * 6 }))
    .sort((a, b) => a.k - b.k);
  const ghostSet = new Set(order.slice(0, Math.round((N * N * ghost) / 100)).map((o) => o.i));
  const cells = Array.from({ length: N * N }, (_, i) => ({ ghost: ghostSet.has(i), tone: 0.55 + rnd() * 0.45 }));

  const title = handle ? `@${handle}` : 'What’s real comes through.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: ROOM,
          backgroundImage: 'radial-gradient(ellipse 900px 520px at 1150px -40px, rgba(222,61,52,0.42), rgba(222,61,52,0) 70%)',
          fontFamily: 'Mono',
          color: TEXT,
          position: 'relative',
        }}
      >
        {/* film edge */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 54, background: REBATE, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ width: 22, height: 16, borderRadius: 3, background: ROOM }} />
          ))}
        </div>

        {/* the print */}
        <div style={{ position: 'absolute', left: 110, top: 64, width: 420, height: 500, background: PAPER, display: 'flex', flexDirection: 'column', padding: 20, transform: 'rotate(-2deg)', boxShadow: '-14px 28px 40px rgba(0,0,0,0.55)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', width: 380, height: 380 }}>
            {cells.map((c, i) => (
              <div
                key={i}
                style={{
                  width: 22.75,
                  height: 22.75,
                  margin: 0.5,
                  background: c.ghost ? 'rgba(108,199,215,0.16)' : SILVER,
                  opacity: c.ghost ? 1 : c.tone,
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
            <span style={{ fontFamily: 'Display', fontWeight: 900, fontSize: 40, color: WAX, transform: 'rotate(-3deg)', textTransform: 'uppercase' }}>
              {verdictFor(score)}
            </span>
            <span style={{ fontSize: 16, color: '#7d6a5f' }}>14A</span>
          </div>
        </div>

        {/* readings */}
        <div style={{ position: 'absolute', left: 610, top: 70, right: 64, bottom: 60, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: SAFE }}>ISSHEREAL 5063 · {handle ? 'PRINT' : 'DARKROOM'}</div>
          <div style={{ display: 'flex', fontFamily: 'Display', fontWeight: 900, fontSize: handle ? 92 : 104, lineHeight: 0.9, textTransform: 'uppercase', marginTop: 26, color: TEXT, letterSpacing: -1 }}>
            {title}
          </div>
          <div style={{ display: 'flex', gap: 56, marginTop: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 20, letterSpacing: 3, color: AMBER }}>DEVELOPED</span>
              <span style={{ fontFamily: 'Thin', fontWeight: 300, fontSize: 150, lineHeight: 0.9, color: AMBER }}>{developed}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 20, letterSpacing: 3, color: CYAN }}>GHOST</span>
              <span style={{ fontFamily: 'Thin', fontWeight: 300, fontSize: 150, lineHeight: 0.9, color: CYAN }}>{ghost}%</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, fontSize: 22, color: TEXT_2 }}>
            <span>isshereal.com</span>
            <span>{handle ? `Score ${score}/100` : 'Free · public numbers only'}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Display', data: display900, weight: 900, style: 'normal' },
        { name: 'Thin', data: display300, weight: 300, style: 'normal' },
        { name: 'Mono', data: mono, weight: 500, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    },
  );
}
