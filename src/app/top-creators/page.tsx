import type { Metadata } from 'next';
import Link from 'next/link';
import { VERIFIED_CREATORS } from '@/data/verified-creators';
import { greaseVerdict, formatNumber } from '@/lib/utils';
import { Edge } from '@/components/darkroom/Edge';
import { Print } from '@/components/darkroom/Print';
import { Reading } from '@/components/darkroom/Reading';
import { GreaseNote } from '@/components/darkroom/Grease';
import { Glyph, platformCode, platformGlyph } from '@/components/darkroom/Glyph';
import { Crumbs } from '@/components/library/Crumbs';
import { CreatorRegister, type RegisterEntry } from '@/components/library/CreatorRegister';

const DESCRIPTION =
  'The exhibition: every public profile isshereal keeps on file, ranked by how completely its audience developed. Top three as framed prints, then the full register.';

export const metadata: Metadata = {
  title: 'Top creators: the exhibition',
  description: DESCRIPTION,
  alternates: { canonical: '/top-creators' },
  openGraph: {
    title: 'Top creators: the exhibition · isshereal.com',
    description: DESCRIPTION,
    url: 'https://isshereal.com/top-creators',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Framed prints of the highest-scoring profiles on file.' }],
  },
};

const pad = (n: number) => String(n).padStart(2, '0');

function reportHref(key: string, platform: string) {
  return `/report/${platform.toLowerCase()}_${key}`;
}

export default function TopCreatorsPage() {
  const entries: RegisterEntry[] = Object.entries(VERIFIED_CREATORS)
    .map(([key, c]) => ({ key, c }))
    .sort((a, b) => b.c.score - a.c.score || b.c.realPct - a.c.realPct || a.key.localeCompare(b.key))
    .map(({ key, c }, i) => ({
      key,
      rank: i + 1,
      handle: c.handle.startsWith('@') ? c.handle : `@${c.handle}`,
      name: c.name,
      platform: c.platform,
      followers: c.followers,
      score: c.score,
      realPct: c.realPct,
      fakePct: c.fakePct,
      href: reportHref(key, c.platform),
    }));

  const podium = entries.slice(0, 3).map((e) => ({ ...e, avatar: VERIFIED_CREATORS[e.key].avatarUrl }));
  const total = entries.length;
  const platforms = Array.from(new Set(entries.map((e) => e.platform)));
  const lowest = entries.length ? entries[entries.length - 1] : null;

  return (
    <article className="exhibit">
      {/* 01 · The wall: headline and the three framed prints */}
      <section className="band band--tray page-grid exhibit-wall" aria-labelledby="exhibit-title">
        <Edge frame="01" label="Exhibition" />
        <Crumbs trail={[{ label: 'Home', href: '/' }, { label: 'Top creators' }]} />
        <div className="cols exhibit-wall__head">
          <div className="head exhibit-wall__title">
            <p className="head__kicker label">Top creators · {total} prints on file</p>
            <h1 id="exhibit-title">
              The prints that <span className="text-amber">came through</span>
            </h1>
          </div>
          <p className="head__lede exhibit-wall__lede">
            Every public profile we keep on file, hung in order of how completely its audience developed. A high
            score is evidence about an audience, <em>not an endorsement of the person</em>.
          </p>
        </div>

        <h2 className="sr-only">The top three</h2>
        <ol className="exhibit-podium" role="list">
          {podium.map((p, i) => (
            <li key={p.key} className={`exhibit-podium__item exhibit-podium__item--${i + 1}`}>
              <Link href={p.href} className="exhibit-podium__link" aria-label={`${p.name}, ${p.handle}. Rank ${i + 1}, score ${p.score}. Open report.`}>
                <Print
                  src={p.avatar}
                  alt=""
                  width={640}
                  height={640}
                  size={i === 0 ? 'l' : 'm'}
                  tilt={i === 0 ? -1.4 : i === 1 ? 1.8 : -2.4}
                  priority={i === 0}
                  sizes={i === 0 ? '(max-width: 56rem) 88vw, 46vw' : '(max-width: 56rem) 70vw, 28vw'}
                  frame={`${pad(i + 1)} · ${platformCode(p.platform)}`}
                  caption={<GreaseNote tilt={-5}>{greaseVerdict(p.score)}</GreaseNote>}
                />
              </Link>
              <div className="exhibit-plate">
                <span className="exhibit-plate__rank" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <div className="exhibit-plate__body">
                  <h3 className="exhibit-plate__name">{p.name}</h3>
                  <p className="exhibit-plate__handle">
                    <span className="edgecode">
                      <Glyph name={platformGlyph(p.platform)} size={16} />
                      {platformCode(p.platform)}
                    </span>
                    <Link href={p.href}>{p.handle}</Link>
                    <span className="text-2">{formatNumber(p.followers)} followers</span>
                  </p>
                  <div className="exhibit-plate__readings">
                    <Reading value={p.realPct} label="Developed" tone="developed" size="s" />
                    <Reading value={p.fakePct} label="Ghost" tone="ghost" size="s" />
                    <Reading value={p.score} unit="" label="Score" size="s" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 02 · The register */}
      <section className="band band--rebate page-grid exhibit-ledger" aria-labelledby="register-title">
        <Edge frame="02" label="Register" />
        <div className="cols exhibit-ledger__head">
          <div className="head exhibit-ledger__title">
            <p className="head__kicker label">Register · {total} entries · {platforms.length} platforms</p>
            <h2 id="register-title">Every print on file</h2>
          </div>
          <p className="exhibit-ledger__note">
            Sorted by score to start. Every column header sorts. Developed is the share of the audience that came
            through as genuine; ghost is the share that never came up.
          </p>
        </div>
        <CreatorRegister entries={entries} />
      </section>

      {/* 03 · How the wall was hung */}
      <section className="band band--contact band--rule page-grid exhibit-method" aria-labelledby="method-title">
        <Edge frame="03" label="Hanging notes" />
        <div className="cols">
          <p className="exhibit-method__numeral" aria-hidden="true">
            {total}
          </p>
          <div className="exhibit-method__body">
            <h2 id="method-title" className="display-s">How the wall was hung</h2>
            <p>
              These are public accounts we keep on file so their reports load without asking the platform again.
              Their counts were recorded when each account was filed and are not refreshed live, so a number here
              can lag the profile by weeks.
            </p>
            <p>
              Rank follows score; ties go to the larger developed share. Being on the wall is not a reward and
              nobody can pay to be hung higher.
              {lowest ? (
                <>
                  {' '}The lowest print on file, <Link href={lowest.href}>{lowest.handle}</Link>, still scored{' '}
                  <span className="tabular">{lowest.score}</span>.
                </>
              ) : null}
            </p>
            <p className="exhibit-method__links">
              <Link href="/about#what-a-score-shows" className="btn btn--line btn--compact">
                What a score can show
                <Glyph name="arrow-right" size={16} />
              </Link>
              <Link href="/analyze" className="btn btn--quiet">
                Develop a profile that isn’t on file
              </Link>
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
