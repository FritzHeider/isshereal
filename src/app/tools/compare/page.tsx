'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph } from '@/components/darkroom/Glyph';
import { Print } from '@/components/darkroom/Print';
import { GreaseNote, GreaseUnderline } from '@/components/darkroom/Grease';
import { ToolOpening } from '@/components/tools/ToolOpening';
import {
  PLATFORMS,
  benchHref,
  cleanHandle,
  fetchAudit,
  fmtInt,
  rateNumber,
  reportHref,
  type AuditOutcome,
  type Platform,
} from '@/components/tools/audit-client';
import type { AuditResult } from '@/lib/audit-engine';
import { greaseVerdict } from '@/lib/utils';

type Side = 'a' | 'b';

interface Metric {
  key: string;
  label: string;
  unit: string;
  /** true: higher is the stronger print; false: lower is; null: context only */
  higherIsBetter: boolean | null;
  decimals: number;
  get: (r: AuditResult) => number;
}

const METRICS: Metric[] = [
  { key: 'developed', label: 'Developed', unit: '%', higherIsBetter: true, decimals: 0, get: (r) => r.realPct },
  { key: 'ghost', label: 'Ghost', unit: '%', higherIsBetter: false, decimals: 0, get: (r) => r.fakePct },
  { key: 'score', label: 'Score', unit: '', higherIsBetter: true, decimals: 0, get: (r) => r.score },
  { key: 'er', label: 'Engagement rate', unit: '%', higherIsBetter: true, decimals: 2, get: (r) => rateNumber(r.engagementRate) },
  { key: 'followers', label: 'Followers', unit: '', higherIsBetter: null, decimals: 0, get: (r) => r.followersCount },
  { key: 'posts', label: 'Posts', unit: '', higherIsBetter: null, decimals: 0, get: (r) => r.postsCount },
];

function fmt(v: number, m: Metric): string {
  if (!Number.isFinite(v)) return '–';
  if (m.decimals === 0) return fmtInt(v);
  return v.toFixed(m.decimals);
}

export default function ComparePage() {
  const [handleA, setHandleA] = useState('');
  const [handleB, setHandleB] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ a: AuditOutcome; b: AuditOutcome } | null>(null);
  const [error, setError] = useState<{ field: Side | 'both' | 'same'; text: string } | null>(null);
  const [requestError, setRequestError] = useState('');
  const aRef = useRef<HTMLInputElement>(null);
  const bRef = useRef<HTMLInputElement>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    const a = cleanHandle(handleA);
    const b = cleanHandle(handleB);
    if (!a && !b) {
      setError({ field: 'both', text: 'The light box needs two specimens. Enter both handles.' });
      aRef.current?.focus();
      return;
    }
    if (!a || !b) {
      const field: Side = !a ? 'a' : 'b';
      setError({ field, text: `Specimen ${field.toUpperCase()} is empty. Enter a handle for it.` });
      (field === 'a' ? aRef : bRef).current?.focus();
      return;
    }
    if (a === b) {
      setError({ field: 'same', text: 'Both specimens are the same handle. Put a different profile beside it.' });
      bRef.current?.focus();
      return;
    }

    setError(null);
    setRequestError('');
    setLoading(true);

    try {
      const [outA, outB] = await Promise.all([fetchAudit(a, platform), fetchAudit(b, platform)]);
      setResults({ a: outA, b: outB });
    } catch {
      setResults(null);
      setRequestError('Fogged. The platform didn’t answer, so nothing was developed and nothing was guessed.');
    } finally {
      setLoading(false);
    }
  };

  const ra = results?.a.kind === 'developed' ? results.a.report : null;
  const rb = results?.b.kind === 'developed' ? results.b.report : null;
  const both = Boolean(ra && rb);
  const statusLine = loading
    ? 'Developing both specimens.'
    : results
      ? both
        ? `Both specimens are on the light box. ${ra!.handle} reads ${ra!.realPct}% developed, ${rb!.handle} reads ${rb!.realPct}% developed.`
        : 'One or both specimens could not be developed.'
      : '';

  const errA = error && (error.field === 'a' || error.field === 'both');
  const errB = error && (error.field === 'b' || error.field === 'both' || error.field === 'same');

  return (
    <>
      <ToolOpening
        id="lightbox-title"
        frame="C0"
        tool="Light box"
        glyph="lightbox"
        variant="lightbox"
        title={
          <>
            Two prints, <span className="safe">one light</span>
          </>
        }
        lede={
          <>
            Lay two profiles side by side on the same backlit glass. The readings run down the middle, and
            the difference between them is marked in grease pencil.
          </>
        }
        specs={[
          ['Takes', 'Two handles on one platform'],
          ['Reads', 'Developed, ghost, score, engagement'],
          ['Marks', 'The gap on every reading'],
        ]}
      />

      <section className="band band--contact lightbox-bench page-grid" aria-labelledby="lightbox-bench-title">
        <Edge frame="C1" label="Specimens" />
        <form className="lightbox-form cols" onSubmit={handleCompare} noValidate>
          <h2 id="lightbox-bench-title" className="sr-only">
            Choose two specimens
          </h2>
          <div className="field lightbox-form__a">
            <label className="field__label" htmlFor="specimen-a">
              <span>Specimen A</span>
              <span className="req" aria-hidden="true">Required</span>
            </label>
            <div className="lightbox-form__handle">
              <span className="lightbox-form__at" aria-hidden="true">@</span>
              <input
                ref={aRef}
                id="specimen-a"
                className="input"
                type="text"
                value={handleA}
                onChange={(e) => setHandleA(e.target.value.replace('@', ''))}
                placeholder="first_handle"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                required
                aria-invalid={errA ? 'true' : undefined}
                aria-describedby={errA ? 'lightbox-error' : undefined}
              />
            </div>
          </div>

          <p className="lightbox-form__against" aria-hidden="true">
            <span>against</span>
          </p>

          <div className="field lightbox-form__b">
            <label className="field__label" htmlFor="specimen-b">
              <span>Specimen B</span>
              <span className="req" aria-hidden="true">Required</span>
            </label>
            <div className="lightbox-form__handle">
              <span className="lightbox-form__at" aria-hidden="true">@</span>
              <input
                ref={bRef}
                id="specimen-b"
                className="input"
                type="text"
                value={handleB}
                onChange={(e) => setHandleB(e.target.value.replace('@', ''))}
                placeholder="second_handle"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                required
                aria-invalid={errB ? 'true' : undefined}
                aria-describedby={errB ? 'lightbox-error' : undefined}
              />
            </div>
          </div>

          <fieldset className="lightbox-form__platform">
            <legend className="field__label">Platform</legend>
            <div className="chips">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className="chip"
                  aria-pressed={platform === p.value}
                  onClick={() => setPlatform(p.value)}
                >
                  <span className="label">{p.code}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="lightbox-form__go">
            <button type="submit" className="btn btn--safe" disabled={loading}>
              <Glyph name="lightbox" size={18} />
              {loading ? 'Developing' : 'Develop both'}
            </button>
          </div>

          {error ? (
            <p id="lightbox-error" className="field__error lightbox-form__error" role="alert">
              <Glyph name="warning" size={16} />
              {error.text}
            </p>
          ) : null}
        </form>
      </section>

      <section className="band band--tray lightbox-band page-grid" aria-labelledby="lightbox-box-title">
        <Edge frame="C2" label="On the glass" />
        <div className="lightbox-band__inner">
          <h2 id="lightbox-box-title" className="lightbox-band__title">
            On the <span className="safe">glass</span>
          </h2>
          <p className="sr-only" role="status" aria-live="polite">
            {statusLine}
          </p>

          {requestError ? (
            <div className="state state--fogged">
              <span className="state__mark">
                <Glyph name="fogged" size={28} />
              </span>
              <div className="state__body">
                <p className="state__title">Fogged</p>
                <p>{requestError}</p>
              </div>
            </div>
          ) : (
            <div className="lightbox" data-state={loading ? 'loading' : results ? 'loaded' : 'empty'}>
              <div className="lightbox__specimen lightbox__specimen--a">
                <Specimen side="a" outcome={results?.a} loading={loading} platform={platform} />
              </div>

              <div className="lightbox__readings">
                {loading ? (
                  <div className="lightbox__latent" aria-hidden="true">
                    {METRICS.map((m) => (
                      <span key={m.key} className="latent latent--line" />
                    ))}
                  </div>
                ) : both ? (
                  <Readings a={ra!} b={rb!} />
                ) : results ? (
                  <div className="lightbox__note">
                    <p className="lightbox__note-title">No readings to compare</p>
                    <p>
                      A difference needs two developed prints. Add the missing figures by hand, then put the
                      pair back on the glass.
                    </p>
                  </div>
                ) : (
                  <div className="lightbox__note">
                    <p className="lightbox__note-title">The light box is on</p>
                    <p>Nothing on it yet. Enter two handles above and develop both.</p>
                  </div>
                )}
              </div>

              <div className="lightbox__specimen lightbox__specimen--b">
                <Specimen side="b" outcome={results?.b} loading={loading} platform={platform} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="band band--rule lightbox-notes page-grid" aria-labelledby="lightbox-notes-title">
        <Edge frame="C3" label="Reading the box" />
        <div className="lightbox-notes__inner cols">
          <h2 id="lightbox-notes-title" className="lightbox-notes__title">
            Reading <span className="safe">the box</span>
          </h2>
          <div className="lightbox-notes__body prose">
            <p>
              Each reading is the same one a single report gives. The pencil mark sits beside the stronger
              print and states the gap in points, so a 12-point lead in developed share reads as{' '}
              <span className="lightbox-notes__mono">+12</span>.
            </p>
            <p>
              Followers and posts are printed for context and left unmarked. A larger audience is not a
              more genuine one.
            </p>
            <p>
              Two prints can be close and still both mostly ghost. Look at the numbers before the marks.
              A score is evidence about an audience, not a verdict on a person.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Specimen({
  side,
  outcome,
  loading,
  platform,
}: {
  side: Side;
  outcome?: AuditOutcome;
  loading: boolean;
  platform: Platform;
}) {
  const letter = side.toUpperCase();

  if (loading) {
    return (
      <div className="lightbox__slot lightbox__slot--latent" aria-hidden="true">
        <span className="latent latent--block lightbox__slot-img" />
        <span className="latent latent--line" />
        <span className="label">Specimen {letter} · in the tray</span>
      </div>
    );
  }

  if (!outcome) {
    return (
      <div className="lightbox__slot lightbox__slot--empty">
        <span className="lightbox__slot-img lightbox__slot-blank" aria-hidden="true">
          {letter}
        </span>
        <span className="label">Specimen {letter} · empty</span>
      </div>
    );
  }

  if (outcome.kind === 'developed') {
    const r = outcome.report;
    return (
      <div className="lightbox__slot">
        <Print
          src={r.avatarImage}
          alt={`Profile photo of ${r.name}`}
          width={480}
          height={480}
          sizes="(max-width: 40rem) 42vw, 22vw"
          tilt={side === 'a' ? -2.2 : 1.6}
          frame={`${letter} · ${r.platform}`}
          caption={
            <GreaseNote tone={r.fakePct >= 50 ? 'cyan' : 'amber'} tilt={side === 'a' ? -4 : -6}>
              {greaseVerdict(r.score)}
            </GreaseNote>
          }
        />
        <p className="lightbox__who">
          <span className="lightbox__name">{r.name}</span>
          <Link href={reportHref(r, platform)} className="lightbox__handle">
            {r.handle}
            <Glyph name="arrow-up-right" size={14} />
          </Link>
        </p>
      </div>
    );
  }

  if (outcome.kind === 'unreached') {
    return (
      <div className="lightbox__slot lightbox__slot--ghost">
        <span className="lightbox__slot-img lightbox__slot-blank" aria-hidden="true">
          <Glyph name="ghost" size={36} />
        </span>
        <p className="lightbox__who">
          <span className="lightbox__name">@{outcome.handle}</span>
          <span>Not reached. The platform kept the figures private.</span>
          <Link href={benchHref(outcome.handle)} className="lightbox__handle">
            Add them by hand
            <Glyph name="arrow-right" size={14} />
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="lightbox__slot lightbox__slot--fogged">
      <span className="lightbox__slot-img lightbox__slot-blank" aria-hidden="true">
        <Glyph name="fogged" size={36} />
      </span>
      <p className="lightbox__who">
        <span className="lightbox__name">@{outcome.handle}</span>
        <span>Fogged. The platform didn’t answer, so nothing was developed and nothing was guessed.</span>
      </p>
    </div>
  );
}

function Readings({ a, b }: { a: AuditResult; b: AuditResult }) {
  return (
    <ol className="lightbox__list" role="list" aria-label="Readings, specimen A against specimen B">
      {METRICS.map((m) => {
        const va = m.get(a);
        const vb = m.get(b);
        const comparable = m.higherIsBetter !== null && Number.isFinite(va) && Number.isFinite(vb);
        const diff = comparable ? Math.abs(va - vb) : 0;
        const level = comparable && diff < (m.decimals ? 0.005 : 0.5);
        let stronger: Side | null = null;
        if (comparable && !level) {
          const aHigher = va > vb;
          stronger = m.higherIsBetter ? (aHigher ? 'a' : 'b') : aHigher ? 'b' : 'a';
        }
        const gap = m.decimals ? diff.toFixed(m.decimals) : String(Math.round(diff));
        const unitWord = m.unit === '%' ? ' pts' : '';
        const valueA = (
          <data value={Number.isFinite(va) ? va : undefined}>
            {fmt(va, m)}
            {m.unit && Number.isFinite(va) ? <span className="lightbox__unit">{m.unit}</span> : null}
          </data>
        );
        const valueB = (
          <data value={Number.isFinite(vb) ? vb : undefined}>
            {fmt(vb, m)}
            {m.unit && Number.isFinite(vb) ? <span className="lightbox__unit">{m.unit}</span> : null}
          </data>
        );
        const tone = m.key === 'ghost' ? 'ghost' : m.key === 'developed' ? 'developed' : 'neutral';
        return (
          <li key={m.key} className="lightbox__row" data-tone={tone}>
            <span className="lightbox__val lightbox__val--a">
              <span className="sr-only">A: </span>
              {stronger === 'a' ? <GreaseUnderline>{valueA}</GreaseUnderline> : valueA}
            </span>
            <span className="lightbox__mid">
              <span className="lightbox__label label">{m.label}</span>
              {m.higherIsBetter === null ? (
                <span className="lightbox__context label">Context</span>
              ) : level ? (
                <GreaseNote tone="amber" tilt={-3} className="lightbox__diff">
                  Level
                </GreaseNote>
              ) : comparable ? (
                <GreaseNote tone="amber" tilt={stronger === 'a' ? -5 : 4} className={`lightbox__diff lightbox__diff--${stronger}`}>
                  <span aria-hidden="true">{stronger === 'a' ? '◂ ' : ''}</span>
                  {stronger!.toUpperCase()} +{gap}
                  {unitWord}
                  <span aria-hidden="true">{stronger === 'b' ? ' ▸' : ''}</span>
                </GreaseNote>
              ) : (
                <span className="lightbox__context label">No reading</span>
              )}
            </span>
            <span className="lightbox__val lightbox__val--b">
              <span className="sr-only">B: </span>
              {stronger === 'b' ? <GreaseUnderline>{valueB}</GreaseUnderline> : valueB}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
