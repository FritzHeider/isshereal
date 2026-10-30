'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SAMPLE_REPORTS } from '@/data/content';
import { VERIFIED_CREATORS } from '@/data/verified-creators';
import { calculateProfileScore, parseCount, type AuditResult } from '@/lib/audit-engine';
import { greaseVerdict, scoreTone } from '@/lib/utils';
import { Edge } from '@/components/darkroom/Edge';
import { DevelopTray } from '@/components/darkroom/DevelopTray';
import { Glyph, platformCode, platformGlyph } from '@/components/darkroom/Glyph';
import { GreaseNote } from '@/components/darkroom/Grease';
import { Reading } from '@/components/darkroom/Reading';
import { NumbersForm } from '@/components/report/NumbersForm';
import { TestStrip } from '@/components/report/TestStrip';
import { ExaminerNote } from '@/components/report/ExaminerNote';
import { SharePrint } from '@/components/report/SharePrint';
import { ReportPageJsonLd } from '@/components/JsonLd';

export type Report = AuditResult & { needsVerification?: boolean };

function cleanNumber(val: string): number {
  return parseCount((val || '').trim());
}

function frameFor(handle: string): string {
  const n = handle.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return `${(n % 36) + 1}${'ABCD'[n % 4]}`;
}

/** Deterministic related prints (no shuffling, so server and client agree). */
function relatedFor(current: string) {
  const pool = [
    ...SAMPLE_REPORTS.map((r) => ({ id: r.id, handle: r.handle, platform: r.platform, fakePct: r.fakePct, avatar: r.avatarImage })),
    ...Object.entries(VERIFIED_CREATORS)
      .filter(([, v]) => v.avatarUrl.startsWith('/'))
      .map(([id, v]) => ({ id, handle: v.handle, platform: v.platform, fakePct: v.fakePct, avatar: v.avatarUrl })),
  ].filter((p, i, arr) => p.id.toLowerCase() !== current && arr.findIndex((q) => q.avatar === p.avatar) === i);
  const start = current.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % Math.max(1, pool.length);
  return Array.from({ length: Math.min(5, pool.length) }, (_, i) => pool[(start + i) % pool.length]);
}

/**
 * The report view. Known profiles (verified creators and the fictional
 * examples) arrive resolved from the server as `initial`, so the print is in
 * the first HTML response; anything else is examined in the browser.
 */
export function ReportView({ rawId, cleanHandle, initial }: { rawId: string; cleanHandle: string; initial: Report | null }) {
  const fmt = (n?: number) => (n ? n.toLocaleString('en-US') : '');
  const [phase, setPhase] = useState<'loading' | 'ready' | 'needs-numbers' | 'fogged'>(initial ? 'ready' : 'loading');
  const [report, setReport] = useState<Report | null>(initial);
  const [adjusting, setAdjusting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editFollowers, setEditFollowers] = useState(fmt(initial?.followersCount));
  const [editFollowing, setEditFollowing] = useState(fmt(initial?.followingCount));
  const [editPosts, setEditPosts] = useState(fmt(initial?.postsCount));

  const fill = (r: { followersCount?: number; followingCount?: number; postsCount?: number }) => {
    if (r.followersCount) setEditFollowers(r.followersCount.toLocaleString('en-US'));
    if (r.followingCount) setEditFollowing(r.followingCount.toLocaleString('en-US'));
    if (r.postsCount) setEditPosts(r.postsCount.toLocaleString('en-US'));
  };

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    async function load() {
      setPhase('loading');
      if (!cleanHandle) {
        setPhase('fogged');
        return;
      }

      // 2. A print developed earlier in this browser
      try {
        const cached = localStorage.getItem(`audit_${rawId}`) || localStorage.getItem(`audit_${cleanHandle}`);
        if (cached) {
          const parsed = JSON.parse(cached) as Report;
          if (cancelled) return;
          if (!parsed.needsVerification) {
            setReport(parsed);
            fill(parsed);
            setPhase('ready');
            return;
          }
          // A placeholder print from an unreachable profile: ask for the numbers instead.
          setReport(null);
          setPhase('needs-numbers');
          return;
        }
      } catch {
        /* storage blocked or corrupt: fetch again */
      }

      // 3. A live examination
      try {
        const res = await fetch(`/api/audit?handle=${encodeURIComponent(cleanHandle)}&platform=instagram`);
        if (res.ok) {
          const data = await res.json();
          // needsInput means the platform didn't answer and the numbers are placeholders: never show them as a result.
          if (data.report && data.report.followersCount > 0 && !data.needsInput && !data.report.needsVerification) {
            if (cancelled) return;
            setReport(data.report);
            fill(data.report);
            try {
              localStorage.setItem(`audit_${data.report.id}`, JSON.stringify(data.report));
            } catch {
              /* storage blocked */
            }
            setPhase('ready');
            return;
          }
        }
      } catch {
        /* the platform did not answer; fall through */
      }

      // 5. Nothing answered: ask for the public numbers rather than guess them.
      if (cancelled) return;
      setReport(null);
      setPhase('needs-numbers');
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawId, cleanHandle]);

  const develop = (e: React.FormEvent) => {
    e.preventDefault();
    const followers = cleanNumber(editFollowers);
    if (!followers || followers <= 0) {
      setError('Enter the follower count shown on the profile, greater than zero.');
      return;
    }
    setError(null);
    const updated = calculateProfileScore({
      platform: report?.platform || 'Instagram',
      handle: report?.handle || `@${cleanHandle}`,
      name: report?.name || cleanHandle,
      followers,
      following: cleanNumber(editFollowing),
      posts: cleanNumber(editPosts),
      avatarUrl: report?.avatarImage || '',
    });
    updated.needsVerification = false;
    setReport(updated);
    setAdjusting(false);
    setPhase('ready');
    try {
      localStorage.setItem(`audit_${updated.id}`, JSON.stringify(updated));
      localStorage.setItem(`audit_${cleanHandle}`, JSON.stringify(updated));
    } catch {
      /* storage blocked */
    }
  };

  /* ---------------------------------------------------------------- loading */
  // Same composition as the latent (needs-numbers) view, which is where most
  // live lookups that take a while end up: the handle headline paints at once.
  if (phase === 'loading') {
    return (
      <section className="report band band--tray page-grid" aria-busy="true" aria-labelledby="latent-title">
        <Edge frame={frameFor(cleanHandle)} label="Latent image" />
        <div className="report__latent">
          <div className="report__latent-copy">
            <nav className="crumbs" aria-label="Breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/analyze">Develop</Link></li>
                <li><span aria-current="page">@{cleanHandle}</span></li>
              </ol>
            </nav>
            <h1 id="latent-title" className="report__handle display-l">@{cleanHandle}</h1>
            <p className="lede" role="status">
              In the tray. Pulling the public numbers for this profile; if the platform won’t share them, you can type them
              in here.
            </p>
          </div>
          <div className="report__latent-form sheet" aria-hidden="true">
            <div className="sheet__head">
              <span className="sheet__code">Public numbers · frame {frameFor(cleanHandle)}</span>
              <span className="label text-2">Holding for fixer</span>
            </div>
            <div className="report__latent-lines">
              <span className="latent latent--block" />
              <span className="latent latent--line" />
              <span className="latent latent--line report__latent-short" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- fogged */
  if (phase === 'fogged') {
    return (
      <section className="report band band--tray page-grid">
        <Edge frame="00" label="Fogged" />
        <div className="report__solo">
          <div className="state state--fogged">
            <span className="state__mark"><Glyph name="fogged" size={32} /></span>
            <div className="state__body">
              <h1 className="state__title">Fogged</h1>
              <p>There was no handle in this address, so nothing was developed and nothing was guessed.</p>
              <Link href="/analyze" className="btn btn--safe">Develop a profile <Glyph name="arrow-right" size={18} /></Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------- needs public numbers */
  if (phase === 'needs-numbers' && !report) {
    return (
      <section className="report band band--tray page-grid" aria-labelledby="latent-title">
        <Edge frame={frameFor(cleanHandle)} label="Latent image" />
        <div className="report__latent">
          <div className="report__latent-copy">
            <nav className="crumbs" aria-label="Breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/analyze">Develop</Link></li>
                <li><span aria-current="page">@{cleanHandle}</span></li>
              </ol>
            </nav>
            <h1 id="latent-title" className="report__handle display-l">@{cleanHandle}</h1>
            <p className="lede">
              The platform didn’t share this profile’s numbers, so the print is still a latent image. Type in what the profile
              shows and it will develop from those. <em>We won’t guess.</em>
            </p>
          </div>
          <div className="report__latent-form sheet">
            <div className="sheet__head">
              <span className="sheet__code">Public numbers · frame {frameFor(cleanHandle)}</span>
              <span className="label text-2">From the profile page</span>
            </div>
            <NumbersForm
              idPrefix="latent"
              followers={editFollowers}
              following={editFollowing}
              posts={editPosts}
              onFollowers={setEditFollowers}
              onFollowing={setEditFollowing}
              onPosts={setEditPosts}
              onSubmit={develop}
              error={error}
              submitLabel="Develop"
            />
          </div>
        </div>
      </section>
    );
  }

  if (!report) return null;

  /* ----------------------------------------------------------------- ready */
  const name = report.name || `@${cleanHandle}`;
  const handle = report.handle || `@${cleanHandle}`;
  const platform = report.platform || 'Instagram';
  const realPct = report.realPct ?? 100 - report.fakePct;
  const fakePct = report.fakePct;
  const tone = scoreTone(report.score);
  const frame = frameFor(cleanHandle);
  const rate = parseFloat(String(report.engagementRate));
  const rateKnown = Number.isFinite(rate) && /%/.test(String(report.engagementRate));
  const ratio = report.followingCount ? report.followersCount / Math.max(1, report.followingCount) : null;
  const related = relatedFor(cleanHandle);
  const avatar = report.avatarImage && !report.avatarImage.includes('ui-avatars.com') ? report.avatarImage : undefined;
  const hasAvatar = !!avatar;
  const verdictWords = greaseVerdict(report.score);
  const reach = rateKnown ? report.followersCount * (rate / 100) : null;
  const cpm = ({ youtube: 15, instagram: 10, tiktok: 8, x: 5 } as Record<string, number>)[platform.toLowerCase()] ?? 10;
  const usd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <article className={`report report--${tone}`} aria-labelledby="report-title">
      {/* 01 · The print */}
      <section className="band band--contact page-grid">
        <Edge frame={frame} label={`${platformCode(platform)} ▸ examined print`} />
        <div className="report__top">
          <div className="report__print">
            <DevelopTray
              handle={handle}
              followersLabel={`${platform} · ${report.followers}`}
              realPct={realPct}
              fakePct={fakePct}
              avatar={avatar}
              alt={hasAvatar ? `Profile photo of ${handle}` : `Placeholder print for ${handle}`}
              frame={frame}
              priority
              verdict={
                <GreaseNote tone={tone === 'ghost' ? 'cyan' : 'amber'} tilt={-3}>
                  {verdictWords}
                </GreaseNote>
              }
            />
          </div>

          <div className="report__id">
            <nav className="crumbs" aria-label="Breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/analyze">Develop</Link></li>
                <li><span aria-current="page">{handle}</span></li>
              </ol>
            </nav>
            <p className="edgecode">
              <Glyph name={platformGlyph(platform)} size={16} /> {platform} ▸ frame {frame}
              {report.isLive ? <span className="tag tag--developed">Live numbers</span> : null}
            </p>
            <h1 id="report-title" className="report__handle display-l">{handle}</h1>
            <p className="report__name">{name}</p>

            <dl className="specs report__specs">
              <dt>Declared</dt>
              <dd className="tabular">{report.followersCount.toLocaleString('en-US')} followers</dd>
              {report.followingCount !== undefined && (<><dt>Following</dt><dd className="tabular">{report.followingCount.toLocaleString('en-US')}</dd></>)}
              {report.postsCount !== undefined && (<><dt>Posts</dt><dd className="tabular">{report.postsCount.toLocaleString('en-US')}</dd></>)}
              <dt>Verdict</dt>
              <dd>{verdictWords}</dd>
            </dl>

            <div className="report__actions">
              <button type="button" className="btn btn--line btn--compact" aria-expanded={adjusting} aria-controls="adjust" onClick={() => setAdjusting((a) => !a)}>
                <Glyph name="edit" size={16} /> Adjust numbers
              </button>
              <SharePrint handle={handle} name={name} platform={platform} realPct={realPct} fakePct={fakePct} verdict={verdictWords} />
            </div>
          </div>
        </div>
      </section>

      {adjusting && (
        <section id="adjust" className="band band--flush page-grid" aria-labelledby="adjust-title">
          <div className="report__adjust sheet">
            <div className="sheet__head">
              <h2 id="adjust-title" className="sheet__title">Adjust the numbers</h2>
              <span className="sheet__code">The print re-develops from what you enter</span>
            </div>
            <NumbersForm
              idPrefix="adjust"
              followers={editFollowers}
              following={editFollowing}
              posts={editPosts}
              onFollowers={setEditFollowers}
              onFollowing={setEditFollowing}
              onPosts={setEditPosts}
              onSubmit={develop}
              error={error}
              submitLabel="Develop again"
              onCancel={() => setAdjusting(false)}
            />
          </div>
        </section>
      )}

      {/* 02 · Readings */}
      <section className="report__readings band band--tray page-grid" aria-labelledby="readings-title">
        <Edge frame="02" label="Densitometer readings" />
        <h2 id="readings-title" className="sr-only">Readings</h2>
        <div className="readings">
          <Reading value={realPct} label="Developed" tone="developed" note="Estimated share of the audience that behaves like genuine accounts." />
          <Reading value={fakePct} label="Ghost" tone="ghost" note="Estimated share that doesn’t: bots, bought accounts, or people who went quiet." />
          <Reading value={report.score} unit="/100" label="Score" size="m" note={report.suspiciousSpike} />
        </div>
      </section>

      {/* 03 · Enlargements */}
      <section className="band band--contact band--rule page-grid" aria-labelledby="enlarge-title">
        <Edge frame="03" label="Enlargements" />
        <div className="enlargements">
          <div className="enlargements__head">
            <h2 id="enlarge-title" className="display-s">Enlargements</h2>
            <p className="text-2">Each pale patch in the print, blown up with what caused it.</p>
          </div>
          <ol className="enlargements__row" role="list">
            {(report.riskSignals || []).map((s, i) => (
              <li key={i} className="blowup">
                <span className="blowup__grain" aria-hidden="true" style={{ '--seed': i } as React.CSSProperties} />
                <span className="blowup__code label">×{(i + 2) * 10} ▸ patch {String.fromCharCode(65 + i)}</span>
                <p className="blowup__text">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 04 · Data sheet */}
      <section className="band page-grid" aria-labelledby="sheet-title">
        <Edge frame="04" label="Technical data" />
        <div className="report__sheet sheet">
          <div className="sheet__head">
            <h2 id="sheet-title" className="sheet__title">Data sheet</h2>
            <span className="sheet__code">Publication R-{frame} · {platform}</span>
          </div>
          <div className="report__sheet-grid">
            <div className="report__signals">
              <h3 className="report__sheet-h">What stayed a ghost</h3>
              <ul className="signals signals--ghost" role="list">
                {(report.riskSignals || []).map((s, i) => (
                  <li key={i}><Glyph name="ghost" size={16} /><span>{s}</span></li>
                ))}
              </ul>
              <h3 className="report__sheet-h">What came through</h3>
              <ul className="signals signals--developed" role="list">
                {(report.verifiedSignals || []).map((s, i) => (
                  <li key={i}><Glyph name="developed" size={16} /><span>{s}</span></li>
                ))}
              </ul>
            </div>
            <div className="report__measures">
              <h3 className="report__sheet-h">Engagement test strip</h3>
              <TestStrip followers={report.followersCount} rate={rateKnown ? rate : null} />
              <dl className="specs">
                <dt>Engagement</dt>
                <dd className="tabular">{String(report.engagementRate)}</dd>
                <dt>Follow ratio</dt>
                <dd className="tabular">{ratio != null ? `${ratio.toFixed(ratio >= 10 ? 0 : 2)} followers per follow` : 'Not shared'}</dd>
                <dt>Posts</dt>
                <dd className="tabular">{report.postsCount?.toLocaleString('en-US') ?? 'Not shared'}</dd>
                <dt>Rate estimate</dt>
                <dd>
                  {reach != null ? (
                    <>
                      <span className="tabular">{usd(Math.max(10, Math.floor(((reach * cpm) / 1000) * 0.8)))}–{usd(Math.ceil(((reach * cpm) / 1000) * 1.2))}</span>
                      <span className="report__formula">per sponsored post: engaged reach × ${cpm} CPM for {platform}, ±20%. Niche and negotiation move it.</span>
                    </>
                  ) : (
                    'Needs an engagement figure'
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 05 · Examiner's note */}
      <section className="band band--tray page-grid" aria-label="Examiner’s note">
        <Edge frame="05" label="Memo" />
        <div className="report__memo">
          <ExaminerNote
            frame={frame}
            handle={handle}
            name={name}
            score={report.score}
            realPct={realPct}
            fakePct={fakePct}
            followersLabel={report.followers}
            riskSignals={report.riskSignals || []}
            verifiedSignals={report.verifiedSignals || []}
            examinedAt={report.timestamp || new Date().toISOString()}
          />
        </div>
      </section>

      {/* 06 · Related prints */}
      {related.length > 0 && (
        <section className="band band--contact band--rule page-grid" aria-labelledby="related-title">
          <Edge frame="06" label="Related prints" />
          <div className="report__related">
            <h2 id="related-title" className="display-s">Related prints</h2>
            <div className="contact" data-room="dark">
              <div className="contact__frames">
                {related.map((r, i) => (
                  <Link key={r.id} href={`/report/${r.id}`} className="frame">
                    <span className="frame__img">
                      <Image src={r.avatar} alt="" width={240} height={240} sizes="(max-width: 48rem) 45vw, 12rem" loading="lazy" />
                    </span>
                    <span className="frame__code">
                      <span>{String(40 + i)} ▸ {platformCode(r.platform)}</span>
                      <span className={r.fakePct > 50 ? 'text-cyan' : ''}>{r.fakePct}% ghost</span>
                    </span>
                    <span className="frame__title">{r.handle}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <ReportPageJsonLd handle={cleanHandle} score={report.score} verdict={report.verdict} />
    </article>
  );
}
