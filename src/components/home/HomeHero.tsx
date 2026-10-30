'use client';

import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SAMPLE_REPORTS } from '@/data/content';
import { DevelopTray } from '@/components/darkroom/DevelopTray';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph, platformCode, platformGlyph } from '@/components/darkroom/Glyph';
import { GreaseCircle, GreaseNote } from '@/components/darkroom/Grease';

/** The three example prints on the hero contact strip: an obvious fake, a mixed case, a genuine creator. */
const EXAMPLE_IDS = ['lucamodels', 'maya', 'fittitan'] as const;
const EXAMPLES = EXAMPLE_IDS.map((id) => SAMPLE_REPORTS.find((r) => r.id === id)!).filter(Boolean);

type Detected = 'instagram' | 'tiktok' | 'youtube' | 'dating';

function detectPlatform(q: string): Detected {
  const s = q.toLowerCase();
  if (s.includes('youtube.com') || s.includes('youtu.be')) return 'youtube';
  if (s.includes('tiktok.com')) return 'tiktok';
  if (s.includes('tinder') || s.includes('hinge') || s.includes('bumble')) return 'dating';
  return 'instagram';
}

function cleanHandle(q: string): string {
  return q
    .replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com\/@?)/i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
    .trim();
}

const PLATFORM_LABEL: Record<Detected, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  dating: 'Dating',
};

export function HomeHero() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<{ tone: 'info' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const example = EXAMPLES[active];

  /** Swap the print in the tray like a new frame under the enlarger. */
  const choose = (i: number) => {
    if (i === active) return;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(i);
      return;
    }
    document.documentElement.classList.add('vt-print');
    const vt = doc.startViewTransition(() => flushSync(() => setActive(i)));
    vt.finished.finally(() => document.documentElement.classList.remove('vt-print'));
  };
  const detected = detectPlatform(query);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const handle = cleanHandle(query);
    if (!handle) {
      setStatus({ tone: 'error', text: 'Nothing in the tray yet. Paste a handle or a profile link to start.' });
      return;
    }
    setBusy(true);
    setStatus({ tone: 'info', text: `Specimen received. Pulling public numbers for @${handle} from ${PLATFORM_LABEL[detected]}.` });
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: detected, handle }),
      });
      if (!res.ok) throw new Error(`audit ${res.status}`);
      const data = await res.json();
      if (data.report && data.report.followersCount > 0) {
        try {
          localStorage.setItem(`audit_${data.report.id}`, JSON.stringify(data.report));
          localStorage.setItem('isshereal_last_report', JSON.stringify(data.report));
        } catch {
          /* storage blocked: the report page fetches again */
        }
        setStatus({ tone: 'info', text: 'Holding for fixer. Opening the print.' });
        router.push(`/report/${data.report.id}`);
        return;
      }
      router.push(`/report/${detected === 'instagram' ? 'ig_' : ''}${encodeURIComponent(handle)}`);
    } catch {
      // The report page asks for the public numbers when the platform does not answer.
      router.push(`/report/ig_${encodeURIComponent(handle)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="hero band band--flush page-grid" aria-labelledby="hero-title">
        <Edge frame="01" label="Specimen intake" />
        <div className="hero__stage to-bleed-end">
          <div className="hero__copy">
            <p className="hero__kicker label">Free · no login · public numbers only</p>
            <h1 id="hero-title" className="hero__title display-xl">
              <span className="line" style={{ '--i': 0 } as React.CSSProperties}>What’s real</span>{' '}
              <span className="line safe" style={{ '--i': 1 } as React.CSSProperties}>comes through.</span>
            </h1>
            <p className="hero__lede lede">
              Drop a profile in the tray. Real followers develop into solid grain. <em>Bought ones never come up.</em>
            </p>

            <form className="hero__form" onSubmit={onSubmit} noValidate>
              <div className="filmfield">
                <span className="filmfield__code" aria-hidden="true">
                  <Glyph name={platformGlyph(detected)} size={18} />
                  {platformCode(PLATFORM_LABEL[detected])}
                </span>
                <span className="filmfield__body">
                  <label className="filmfield__label" htmlFor="hero-handle">Specimen · handle or profile link</label>
                  <input
                    id="hero-handle"
                    className="filmfield__input"
                    type="text"
                    inputMode="url"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="@handle or instagram.com/…"
                    value={query}
                    maxLength={120}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (status?.tone === 'error') setStatus(null);
                    }}
                    aria-invalid={status?.tone === 'error' ? true : undefined}
                    aria-describedby="hero-status"
                  />
                </span>
                <button type="submit" className="btn btn--safe" disabled={busy}>
                  {busy ? 'Developing' : 'Develop'}
                  <Glyph name="arrow-right" size={18} />
                </button>
                <p id="hero-status" className="filmfield__status" data-tone={status?.tone} aria-live="polite" hidden={!status}>
                  {status?.text}
                </p>
              </div>
            </form>
            <p className="hero__fineprint">
              Instagram, TikTok, YouTube, X, plus dating, marketplace and freelance profiles. A score is evidence about an
              audience, not a verdict on a person.
            </p>
          </div>

          <div className="hero__tray">
            <DevelopTray
              key={example.id}
              handle={example.handle}
              followersLabel={`${example.platform} · ${example.followers}`}
              realPct={100 - example.fakePct}
              fakePct={example.fakePct}
              avatar={example.avatarImage}
              alt={`Example print of ${example.handle}`}
              frame={`1${active + 3}A`}
              priority
              hold={busy}
              caption={example.suspiciousSpike}
            />
          </div>
        </div>
      </section>

      <section className="hstrip band band--contact page-grid" aria-labelledby="strip-title">
        <Edge frame="02" label="Contact strip" />
        <div className="hstrip__inner">
          <div className="hstrip__head">
            <h2 id="strip-title" className="display-s">Three examples. Pick one to develop.</h2>
            <p className="text-2">Fictional profiles, real arithmetic. Each one comes up differently.</p>
          </div>
          <div className="contact hstrip__sheet" data-room="dark">
            <div className="hstrip__frames" role="group" aria-label="Example profiles">
              {EXAMPLES.map((r, i) => {
                const ghost = r.fakePct;
                const img = (
                  <span className="frame__img">
                    <Image src={r.avatarImage} alt="" width={320} height={320} sizes="(max-width: 48rem) 40vw, 14rem" />
                  </span>
                );
                return (
                  <button
                    key={r.id}
                    type="button"
                    className="frame"
                    aria-pressed={active === i}
                    onClick={() => choose(i)}
                  >
                    {ghost > 50 ? <GreaseCircle>{img}</GreaseCircle> : img}
                    <span className="frame__code">
                      <span>{`1${i + 3}`} ▸ {platformCode(r.platform)}</span>
                      <span className={ghost > 50 ? 'text-cyan' : ''}>{ghost}% ghost</span>
                    </span>
                    <span className="frame__title">{r.handle}</span>
                    <span className="frame__sub">{r.verdict}</span>
                  </button>
                );
              })}
            </div>
            <GreaseNote className="hstrip__note" tilt={-6}>
              ↑ This one never came up
            </GreaseNote>
          </div>
        </div>
      </section>
    </>
  );
}
