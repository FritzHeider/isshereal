import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Social preview (1200×630) in the direct style: white card, blue accent,
 * real share in green and fake share in red. With a handle it shows that
 * report's numbers; without one it is the site's own card.
 */

const INK = '#0f172a';
const MUTED = '#475569';
const LINE = '#e5e7eb';
const TINT = '#f5f8ff';
const ACCENT = '#2457d6';
const ACCENT_SOFT = '#e8efff';
const GOOD = '#0e7a53';
const BAD = '#b91c1c';
const BAD_SOFT = '#fee2e2';
const GOOD_SOFT = '#dcfce7';

function sanitizeHandle(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 40);
}

function clampPct(raw: string | null, fallback: number) {
  const n = parseInt(raw || '', 10);
  return Number.isNaN(n) ? fallback : Math.max(0, Math.min(100, n));
}

function verdictFor(score: number) {
  if (score >= 85) return 'Looks real';
  if (score >= 75) return 'Mostly real';
  if (score >= 50) return 'Partly real';
  if (score >= 30) return 'Mostly fake';
  return 'Almost all fake';
}

type AssetsBinding = { fetch: (input: Request | string | URL) => Promise<Response> };

// On Cloudflare a worker fetching its own hostname hangs, so read the fonts
// through the static-assets binding; plain fetch covers `next dev`.
async function font(req: NextRequest, file: string) {
  const url = new URL(`/og/${file}`, req.url);
  let assets: AssetsBinding | undefined;
  try {
    assets = (getCloudflareContext().env as { ASSETS?: AssetsBinding }).ASSETS;
  } catch {
    assets = undefined;
  }
  const res = assets ? await assets.fetch(url) : await fetch(url);
  if (!res.ok) throw new Error(`OG font ${file}: ${res.status}`);
  return res.arrayBuffer();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawHandle = searchParams.get('handle');
  const handle = rawHandle ? sanitizeHandle(rawHandle) : '';
  const score = clampPct(searchParams.get('score'), handle ? 50 : 31);
  const ghost = clampPct(searchParams.get('ghost'), handle ? Math.max(4, Math.min(88, 105 - score)) : 67);
  const developed = 100 - ghost;

  const [sans500, sans800] = await Promise.all([font(req, 'inter-500.woff'), font(req, 'inter-800.woff')]);

  const risky = ghost >= 50;
  const title = handle ? `@${handle}` : 'Check if any profile is real.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          backgroundImage: `linear-gradient(180deg, ${TINT}, #ffffff 55%)`,
          fontFamily: 'Inter',
          color: INK,
          padding: '56px 72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 64 64">
                <path d="M14 33.5l11 11 25-26" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>isshereal</span>
          </div>
          <span style={{ display: 'flex', fontSize: 22, fontWeight: 500, color: ACCENT, background: ACCENT_SOFT, padding: '8px 18px', borderRadius: 999 }}>
            Free · No sign-up · Nothing locked
          </span>
        </div>

        <div style={{ display: 'flex', fontSize: handle ? 84 : 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, marginTop: 44, maxWidth: 1050 }}>
          {title}
        </div>
        {handle ? (
          <div style={{ display: 'flex', marginTop: 18 }}>
            <span style={{ display: 'flex', fontSize: 26, fontWeight: 800, padding: '8px 18px', borderRadius: 999, background: risky ? BAD_SOFT : GOOD_SOFT, color: risky ? '#991b1b' : '#166534' }}>
              {verdictFor(score)}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 500, color: MUTED, marginTop: 16 }}>
            See how many followers are fake — in about four seconds.
          </div>
        )}

        <div style={{ display: 'flex', gap: 24, marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, border: `2px solid ${LINE}`, borderRadius: 20, padding: '20px 28px', background: '#ffffff' }}>
            <span style={{ fontSize: 24, fontWeight: 500, color: MUTED }}>Real followers</span>
            <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: -3, color: GOOD, lineHeight: 1.05 }}>{developed}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, border: `2px solid ${LINE}`, borderRadius: 20, padding: '20px 28px', background: '#ffffff' }}>
            <span style={{ fontSize: 24, fontWeight: 500, color: MUTED }}>Fake followers</span>
            <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: -3, color: BAD, lineHeight: 1.05 }}>{ghost}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, border: `2px solid ${LINE}`, borderRadius: 20, padding: '20px 28px', background: '#ffffff' }}>
            <span style={{ fontSize: 24, fontWeight: 500, color: MUTED }}>{handle ? 'Audience score' : 'Example score'}</span>
            <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>{score}<span style={{ fontSize: 36, color: MUTED, marginLeft: 6, marginTop: 44 }}>/100</span></span>
          </div>
        </div>
        <div style={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', marginTop: 22, background: LINE }}>
          <div style={{ width: `${developed}%`, background: GOOD }} />
          <div style={{ width: `${ghost}%`, background: BAD }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: sans500, weight: 500, style: 'normal' },
        { name: 'Inter', data: sans800, weight: 800, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    },
  );
}
