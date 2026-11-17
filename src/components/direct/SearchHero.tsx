'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Search-first hero: one field, platform tabs, straight to the report.
 * Submits to the same /api/audit endpoint the rest of the site uses.
 */

type PlatformId = 'instagram' | 'tiktok' | 'youtube' | 'x' | 'dating' | 'freelance';

const TABS: { id: PlatformId; label: string; placeholder: string }[] = [
  { id: 'instagram', label: 'Instagram', placeholder: 'instagram handle or link' },
  { id: 'tiktok', label: 'TikTok', placeholder: 'tiktok handle or link' },
  { id: 'youtube', label: 'YouTube', placeholder: 'channel handle or link' },
  { id: 'x', label: 'X', placeholder: 'x handle or link' },
  { id: 'dating', label: 'Dating apps', placeholder: 'linked Instagram or profile link' },
  { id: 'freelance', label: 'Fiverr / Upwork', placeholder: 'freelancer profile link' },
];

/** Infer the platform from a pasted link so the right tab lights up. */
function detectPlatform(q: string): PlatformId | null {
  const s = q.toLowerCase();
  if (s.includes('instagram.com')) return 'instagram';
  if (s.includes('tiktok.com')) return 'tiktok';
  if (s.includes('youtube.com') || s.includes('youtu.be')) return 'youtube';
  if (s.includes('x.com/') || s.includes('twitter.com')) return 'x';
  if (s.includes('tinder') || s.includes('hinge') || s.includes('bumble')) return 'dating';
  if (s.includes('fiverr.com') || s.includes('upwork.com')) return 'freelance';
  return null;
}

/** Reduce a handle or profile URL to the bare username. */
function cleanHandle(q: string): string {
  return q
    .trim()
    .replace(/^https?:\/\/(www\.|m\.)?/i, '')
    .replace(/^(instagram\.com|tiktok\.com|youtube\.com|x\.com|twitter\.com|fiverr\.com|upwork\.com\/freelancers)\//i, '')
    .replace(/^@/, '')
    .split(/[/?#\s]/)[0]
    .replace(/^@/, '')
    .trim();
}

export function SearchHero() {
  const router = useRouter();
  const [tab, setTab] = useState<PlatformId>('instagram');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ tone: 'info' | 'error'; text: string } | null>(null);

  const current = TABS.find((t) => t.id === tab)!;

  const onChange = (value: string) => {
    setQuery(value);
    const detected = detectPlatform(value);
    if (detected && detected !== tab) setTab(detected);
    if (status?.tone === 'error') setStatus(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const handle = cleanHandle(query);
    if (!handle) {
      setStatus({ tone: 'error', text: 'Paste a handle or profile link to check.' });
      return;
    }
    setBusy(true);
    setStatus({ tone: 'info', text: `Checking @${handle}…` });
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: tab, handle }),
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
        router.push(`/report/${data.report.id}`);
        return;
      }
      router.push(`/report/${tab === 'instagram' ? 'ig_' : ''}${encodeURIComponent(handle)}`);
    } catch {
      // The report page asks for the public numbers when the platform does not answer.
      router.push(`/report/ig_${encodeURIComponent(handle)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="dh-hero" aria-labelledby="dh-title">
      <div className="dh-hero__inner">
        <p className="dh-pill">Free · No sign-up · Nothing locked</p>
        <h1 id="dh-title" className="dh-hero__title">Check if any profile is real.</h1>
        <p className="dh-hero__lede">
          See how many followers are fake, which accounts look like bots, and why — in about four seconds.
        </p>

        <div className="dh-tabs" role="group" aria-label="Platform">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="dh-tab"
              aria-pressed={t.id === tab}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form className="dh-search" onSubmit={onSubmit} noValidate role="search">
          <label htmlFor="dh-handle" className="sr-only">
            {current.label} profile handle or link
          </label>
          <div className="dh-search__box">
            <span className="dh-search__at" aria-hidden="true">@</span>
            <input
              id="dh-handle"
              className="dh-search__input"
              type="text"
              inputMode="url"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="search"
              maxLength={160}
              placeholder={current.placeholder}
              value={query}
              onChange={(e) => onChange(e.target.value)}
              aria-invalid={status?.tone === 'error' ? true : undefined}
              aria-describedby="dh-status dh-hint"
            />
            <button type="submit" className="dh-btn dh-btn--primary" disabled={busy}>
              {busy ? 'Checking…' : 'Check profile'}
            </button>
          </div>
          <p id="dh-status" className="dh-search__status" data-tone={status?.tone} aria-live="polite" hidden={!status}>
            {status?.text}
          </p>
          <p id="dh-hint" className="dh-search__hint">
            Public data only. We never ask for a password or store anything about you.
          </p>
        </form>
      </div>
    </section>
  );
}
