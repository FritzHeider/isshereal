'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph, platformCode, platformGlyph } from '@/components/darkroom/Glyph';
import { Crumbs } from '@/components/library/Crumbs';
import { scoreTone } from '@/lib/utils';

/**
 * A filed examination as it sits in localStorage under `audit_<id>`.
 * Written by the analyze page, the home hero and the report page, so the
 * shape is an AuditResult; older entries may carry `avatarUrl` and a
 * numeric timestamp instead.
 */
interface StoredAudit {
  id?: string;
  handle: string;
  platform?: string;
  score?: number;
  name?: string;
  avatarUrl?: string;
  avatarImage?: string;
  realPct?: number;
  fakePct?: number;
  timestamp?: number | string;
}

interface Negative {
  key: string;
  href: string;
  handle: string;
  name?: string;
  platform: string;
  score: number | null;
  realPct: number | null;
  fakePct: number | null;
  avatar?: string;
  time: number | null;
}

type Status = 'loading' | 'ready' | 'error';

const PREFIX = 'audit_';

function toTime(t: StoredAudit['timestamp']): number | null {
  if (typeof t === 'number' && Number.isFinite(t)) return t;
  if (typeof t === 'string') {
    const n = Date.parse(t);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : null;
}

function readArchive(): Negative[] {
  const seen = new Set<string>();
  const items: Negative[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PREFIX)) continue;
    let data: StoredAudit | null = null;
    try {
      data = JSON.parse(localStorage.getItem(key) || '{}');
    } catch {
      continue; // one unreadable negative should not fog the whole archive
    }
    if (!data || !data.handle) continue;
    // The report page files the same examination under its id and its handle.
    const identity = (data.id || data.handle).toLowerCase();
    if (seen.has(identity)) continue;
    seen.add(identity);
    const platform = data.platform || 'Instagram';
    items.push({
      key,
      href: `/report/${data.id || encodeURIComponent(data.handle)}?platform=${platform}`,
      handle: data.handle.startsWith('@') ? data.handle : `@${data.handle}`,
      name: data.name,
      platform,
      score: num(data.score),
      realPct: num(data.realPct),
      fakePct: num(data.fakePct),
      avatar: data.avatarUrl || data.avatarImage,
      time: toTime(data.timestamp),
    });
  }
  items.sort((a, b) => (b.time ?? 0) - (a.time ?? 0));
  return items;
}

function clearArchive(): number {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) keys.push(key);
  }
  keys.forEach((k) => localStorage.removeItem(k));
  return keys.length;
}

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });
const pad = (n: number) => String(n).padStart(2, '0');

export default function HistoryPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [negatives, setNegatives] = useState<Negative[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState('');
  const confirmRef = useRef<HTMLHeadingElement>(null);
  const clearBtnRef = useRef<HTMLButtonElement>(null);
  const emptyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    try {
      setNegatives(readArchive());
      setStatus('ready');
    } catch (error) {
      console.error('Error loading history:', error);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  const cancel = () => {
    setConfirming(false);
    requestAnimationFrame(() => clearBtnRef.current?.focus());
  };

  const confirmClear = () => {
    try {
      const removed = clearArchive();
      setNegatives([]);
      setConfirming(false);
      setNotice(`Binder emptied. ${removed} ${removed === 1 ? 'entry' : 'entries'} removed from this browser.`);
      requestAnimationFrame(() => emptyRef.current?.focus());
    } catch (error) {
      console.error('Error clearing history:', error);
      setConfirming(false);
      setStatus('error');
    }
  };

  const count = negatives.length;
  const oldest = negatives.reduce<number | null>((m, n) => (n.time !== null && (m === null || n.time < m) ? n.time : m), null);

  return (
    <article className="archive">
      {/* 01 · The binder cover */}
      <section className="band page-grid archive-cover" aria-labelledby="archive-title">
        <Edge frame="01" label="Negative archive" />
        <Crumbs trail={[{ label: 'Home', href: '/' }, { label: 'History' }]} />
        <div className="cols archive-cover__grid">
          <div className="head archive-cover__title">
            <p className="head__kicker label">History · filed in this browser</p>
            <h1 id="archive-title">
              Negative <span className="text-2">archive</span>
            </h1>
            <p className="head__lede">
              Every examination you run is filed here automatically, newest first. The binder lives in this browser
              only. Nothing on this page is sent anywhere.
            </p>
          </div>

          <aside className="archive-cover__spine" aria-label="Archive details">
            <dl className="specs">
              <dt>Filed</dt>
              <dd className="tabular">
                {status === 'loading' ? <span className="latent latent--line archive-latent-inline" /> : count}
              </dd>
              <dt>Oldest</dt>
              <dd className="tabular">
                {status === 'loading' ? (
                  <span className="latent latent--line archive-latent-inline" />
                ) : oldest !== null ? (
                  <time dateTime={new Date(oldest).toISOString()}>{dateFmt.format(oldest)}</time>
                ) : (
                  <span className="text-2">None</span>
                )}
              </dd>
              <dt>Stored</dt>
              <dd>This browser, as local storage</dd>
            </dl>

            {status === 'ready' && count > 0 && !confirming ? (
              <button
                ref={clearBtnRef}
                type="button"
                className="btn btn--line btn--compact archive-cover__clear"
                onClick={() => setConfirming(true)}
              >
                <Glyph name="close" size={16} />
                Empty the binder
              </button>
            ) : null}

            {confirming ? (
              <div className="archive-confirm" role="group" aria-labelledby="archive-confirm-title">
                <h2 id="archive-confirm-title" className="archive-confirm__title" ref={confirmRef} tabIndex={-1}>
                  Remove all {count} {count === 1 ? 'negative' : 'negatives'}?
                </h2>
                <p>
                  This clears the archive from this browser and can’t be undone. The reports themselves stay online;
                  you can develop any of them again.
                </p>
                <div className="archive-confirm__actions">
                  <button type="button" className="btn btn--safe btn--compact" onClick={confirmClear}>
                    Remove {count}
                  </button>
                  <button type="button" className="btn btn--line btn--compact" onClick={cancel}>
                    Keep them
                  </button>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {/* 02 · The sleeves */}
      <section className="band band--contact page-grid archive-pages" aria-labelledby="archive-sleeves-title">
        <Edge frame="02" label="Sleeves" />
        <h2 id="archive-sleeves-title" className="sr-only">
          Filed examinations
        </h2>
        <p className="sr-only" role="status">
          {notice}
        </p>

        {status === 'loading' ? (
          <div className="archive-binder" aria-busy="true" aria-label="Opening the archive">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="archive-sleeve archive-sleeve--latent" aria-hidden="true">
                <span className="latent latent--line archive-latent-code" />
                <span className="latent archive-latent-thumb" />
                <span className="latent latent--line archive-latent-wide" />
                <span className="latent latent--line archive-latent-code" />
              </div>
            ))}
          </div>
        ) : null}

        {status === 'error' ? (
          <div className="state state--fogged" role="alert">
            <div className="state__mark" aria-hidden="true">
              <Glyph name="fogged" size={28} />
            </div>
            <div className="state__body">
              <p className="state__title">Fogged. The archive couldn’t be read.</p>
              <p>
                This browser blocked local storage, so nothing could be opened and nothing was deleted. Private
                windows and strict privacy settings often do this.
              </p>
              <button type="button" className="btn btn--line btn--compact" onClick={() => window.location.reload()}>
                <Glyph name="refresh" size={16} />
                Try the drawer again
              </button>
            </div>
          </div>
        ) : null}

        {status === 'ready' && count === 0 ? (
          <div className="archive-empty">
            <div className="archive-empty__page" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="archive-empty__pocket" />
              ))}
            </div>
            <div className="state archive-empty__state">
              <div className="state__mark" aria-hidden="true">
                <Glyph name="sleeve" size={28} />
              </div>
              <div className="state__body">
                <p className="state__title" ref={emptyRef} tabIndex={-1}>
                  No negatives filed yet.
                </p>
                <p>Your first examination is filed here automatically.</p>
                <Link href="/analyze" className="btn btn--safe">
                  Develop a profile
                  <Glyph name="arrow-right" size={16} />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {status === 'ready' && count > 0 ? (
          <ol className="archive-binder" role="list">
            {negatives.map((n, i) => {
              const frame = pad(count - i);
              const tone = n.score === null ? null : scoreTone(n.score);
              const remote = !!n.avatar && /^(https?:|data:)/.test(n.avatar);
              return (
                <li key={n.key} className="archive-sleeve" data-tone={tone ?? undefined}>
                  <Link href={n.href} className="archive-sleeve__link">
                    <span className="archive-sleeve__frame">
                      <span className="label text-2">Frame</span>
                      <span className="archive-sleeve__no">{frame}</span>
                    </span>
                    <span className="archive-sleeve__thumb">
                      {n.avatar ? (
                        <Image
                          src={n.avatar}
                          alt=""
                          width={72}
                          height={72}
                          sizes="72px"
                          loading={i < 6 ? undefined : 'lazy'}
                          unoptimized={remote}
                        />
                      ) : (
                        <Glyph name="ghost" size={28} />
                      )}
                    </span>
                    <span className="archive-sleeve__subject">
                      <span className="archive-sleeve__handle">{n.handle}</span>
                      <span className="archive-sleeve__meta">
                        <span className="edgecode">
                          <Glyph name={platformGlyph(n.platform)} size={14} />
                          {platformCode(n.platform)}
                        </span>
                        {n.name && n.name.replace(/^@/, '') !== n.handle.replace(/^@/, '') ? (
                          <span className="text-2">{n.name}</span>
                        ) : null}
                      </span>
                    </span>
                    <span className="archive-sleeve__date">
                      {n.time !== null ? (
                        <time dateTime={new Date(n.time).toISOString()}>
                          {dateFmt.format(n.time)}
                          <span className="text-2"> · {timeFmt.format(n.time)}</span>
                        </time>
                      ) : (
                        <span className="text-2">Undated</span>
                      )}
                    </span>
                    <span className="archive-sleeve__readings">
                      {n.realPct !== null && n.fakePct !== null ? (
                        <>
                          <span className="archive-sleeve__pct">
                            <span className="text-amber">
                              <Glyph name="developed" size={12} /> {n.realPct}%
                              <span className="sr-only"> developed</span>
                            </span>
                            <span className="text-cyan">
                              <Glyph name="ghost" size={12} /> {n.fakePct}%
                              <span className="sr-only"> ghost</span>
                            </span>
                          </span>
                          <span className="bar" aria-hidden="true">
                            <span className="bar__fill" style={{ width: `${n.realPct}%` }} />
                          </span>
                        </>
                      ) : (
                        <span className="text-2">Readings not filed</span>
                      )}
                    </span>
                    <span className="archive-sleeve__score">
                      {n.score !== null ? (
                        <>
                          <span className="tabular">{n.score}</span>
                          <span className="label text-2">Score</span>
                        </>
                      ) : (
                        <span className="label text-2">No score</span>
                      )}
                    </span>
                    <Glyph name="arrow-right" size={18} className="archive-sleeve__go" />
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : null}
      </section>
    </article>
  );
}
