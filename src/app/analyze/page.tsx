'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, PLATFORMS, SAMPLE_REPORTS } from '@/data/content';
import { getVerifiedCreator } from '@/data/verified-creators';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph, platformCode, platformGlyph, type GlyphName } from '@/components/darkroom/Glyph';
import { Reading } from '@/components/darkroom/Reading';

const CATEGORY_GLYPH: Record<string, GlyphName> = {
  social: 'social',
  dating: 'dating',
  marketplace: 'marketplace',
  freelance: 'freelance',
};

const QUICK = [
  { label: '@nike', handle: 'nike', plat: 'instagram' },
  { label: '@natgeo', handle: 'natgeo', plat: 'instagram' },
  { label: '@mrbeast', handle: 'mrbeast', plat: 'youtube' },
  { label: '@figma', handle: 'figma', plat: 'instagram' },
  { label: '@cristiano', handle: 'cristiano', plat: 'instagram' },
];

function stripHandle(raw: string) {
  return raw
    .replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com\/@?)/i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
    .trim();
}

const num = (v: string) => (v.trim() ? parseFloat(v.replace(/,/g, '')) : undefined);

type Status = { tone: 'info' | 'developed' | 'error'; text: string } | null;

export default function AnalyzePage() {
  const router = useRouter();
  // Read ?handle= after mount so the bench prerenders as static HTML (no fallback swap, no layout shift).
  const [initialHandle, setInitialHandle] = useState('');
  useEffect(() => {
    const h = new URLSearchParams(window.location.search).get('handle') || '';
    if (h) {
      setHandle(h);
      setInitialHandle(h);
    }
  }, []);

  const [category, setCategory] = useState('social');
  const [platform, setPlatform] = useState('instagram');
  const [handle, setHandle] = useState('');
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [posts, setPosts] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [busy, setBusy] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [handleError, setHandleError] = useState<string | null>(null);

  const loadVerified = (key: string, message: (name: string, n: number) => string) => {
    const v = getVerifiedCreator(key);
    if (!v) return false;
    setHandle(v.handle);
    setPlatform(v.platform.toLowerCase());
    setFollowers(v.followers.toString());
    setFollowing(v.following.toString());
    setPosts(v.posts.toString());
    setStatus({ tone: 'developed', text: message(v.name, v.followers) });
    return true;
  };

  const fetchNumbers = async (raw = handle) => {
    const clean = stripHandle(raw).toLowerCase();
    if (!clean) {
      setHandleError('Paste a handle or a profile link first.');
      return;
    }
    setFetching(true);
    setStatus({ tone: 'info', text: `Pulling public numbers for @${clean}.` });
    if (loadVerified(clean, (name, n) => `Verified public numbers for ${name}: ${n.toLocaleString('en-US')} followers.`)) {
      setFetching(false);
      return;
    }
    try {
      const res = await fetch(`/api/audit?handle=${encodeURIComponent(clean)}&platform=${platform}`);
      if (res.ok) {
        const data = await res.json();
        if (data.report && data.report.followersCount > 0) {
          setFollowers(data.report.followersCount.toString());
          if (data.report.followingCount) setFollowing(data.report.followingCount.toString());
          if (data.report.postsCount) setPosts(data.report.postsCount.toString());
          setStatus({ tone: 'developed', text: `Pulled live numbers for ${data.report.name}: ${data.report.followers}.` });
        } else {
          setStatus({ tone: 'error', text: `The platform didn’t share @${clean}’s numbers. Type in what the profile shows and we’ll develop from those.` });
        }
      } else {
        setStatus({ tone: 'error', text: 'The platform didn’t answer. Type in the numbers from the profile and we’ll develop from those.' });
      }
    } catch {
      setStatus({ tone: 'error', text: 'Fogged: the request didn’t complete. Check your connection, or type the numbers in yourself.' });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!initialHandle) return;
    const clean = stripHandle(initialHandle).toLowerCase();
    if (!loadVerified(clean, (name, n) => `Loaded verified public numbers for ${name}: ${n.toLocaleString('en-US')} followers.`)) {
      fetchNumbers(initialHandle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHandle]);

  const loadPreset = (id: string) => {
    if (loadVerified(id, (name, n) => `Loaded verified profile ${name}: ${n.toLocaleString('en-US')} followers.`)) return;
    const rep = SAMPLE_REPORTS.find((r) => r.id === id);
    if (!rep) return;
    setHandle(rep.handle);
    if (rep.id === 'mrbeast') {
      setPlatform('youtube'); setFollowers('342000000'); setFollowing('240'); setPosts('820');
    } else if (rep.id === 'lucamodels') {
      setPlatform('instagram'); setFollowers('480000'); setFollowing('3400'); setPosts('65');
    } else if (rep.id === 'maya') {
      setPlatform('tiktok'); setFollowers('1200000'); setFollowing('410'); setPosts('340');
    }
    setStatus({ tone: 'developed', text: `Loaded the example ${rep.handle}. These numbers are fictional.` });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = stripHandle(handle);
    if (!clean) {
      setHandleError('Paste a handle or a profile link first.');
      document.getElementById('an-handle')?.focus();
      return;
    }
    setBusy(true);
    setStatus({ tone: 'info', text: `Developing @${clean}. Holding for fixer.` });
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          handle: clean,
          followers: num(followers),
          following: num(following),
          posts: num(posts),
          likes: num(likes),
          comments: num(comments),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          try {
            localStorage.setItem(`audit_${data.report.id}`, JSON.stringify(data.report));
            localStorage.setItem('isshereal_last_report', JSON.stringify(data.report));
          } catch {
            /* storage blocked: the report page fetches again */
          }
          router.push(`/report/${data.report.id}`);
          return;
        }
      }
    } catch {
      /* fall through to the report page, which asks for numbers if needed */
    }
    setBusy(false);
    router.push(`/report/ig_${clean}`);
  };

  const f = num(followers) || 0;
  const er = f > 0 ? (((num(likes) || 0) + (num(comments) || 0)) / f) * 100 : 0;
  const ready = !!stripHandle(handle);
  const platformLabel = PLATFORMS.find((p) => p.id === platform)?.label || platform;

  return (
    <>
      <section className="bench band band--contact page-grid" aria-labelledby="bench-title">
        <Edge frame="00" label="Loading bench" />
        <div className="bench__top">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><span aria-current="page">Develop a profile</span></li>
            </ol>
          </nav>
          <h1 id="bench-title" className="bench__title display-l">
            The loading <span className="safe">bench</span>
          </h1>
          <p className="bench__lede lede">
            Paste a profile. We pull the public numbers where the platform shares them; where it doesn’t, you type in what the
            profile shows. Then it goes in the tray.
          </p>
        </div>
      </section>

      <section className="bench band band--flush page-grid" aria-label="Examination form">
        <form className="bench__layout" onSubmit={onSubmit} noValidate>
          <div className="bench__form">
            <fieldset className="bench__group">
              <legend className="bench__legend"><span className="label text-safe">A</span> What kind of profile</legend>
              <div className="chips" role="group" aria-label="Profile type">
                {CATEGORIES.map((c) => (
                  <button key={c.id} type="button" className="chip" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
                    <Glyph name={CATEGORY_GLYPH[c.id] || 'social'} size={16} />
                    {c.label}
                  </button>
                ))}
              </div>
              <p className="field__hint">{CATEGORIES.find((c) => c.id === category)?.desc}</p>
              {category === 'social' && (
                <div className="chips bench__platforms" role="group" aria-label="Platform">
                  {PLATFORMS.map((p) => (
                    <button key={p.id} type="button" className="chip" aria-pressed={platform === p.id} onClick={() => setPlatform(p.id)}>
                      <Glyph name={platformGlyph(p.label)} size={16} />
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </fieldset>

            <fieldset className="bench__group">
              <legend className="bench__legend"><span className="label text-safe">B</span> The specimen</legend>
              <div className="filmfield">
                <span className="filmfield__code" aria-hidden="true">
                  <Glyph name={platformGlyph(platformLabel)} size={18} />
                  {platformCode(platformLabel)}
                </span>
                <span className="filmfield__body">
                  <label className="filmfield__label" htmlFor="an-handle">Handle or profile link <span className="text-safe">required</span></label>
                  <input
                    id="an-handle"
                    className="filmfield__input"
                    type="text"
                    value={handle}
                    onChange={(e) => {
                      setHandle(e.target.value);
                      setHandleError(null);
                    }}
                    placeholder="@handle or profile link"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    maxLength={120}
                    aria-invalid={handleError ? true : undefined}
                    aria-describedby="an-handle-msg"
                  />
                </span>
                <button type="button" className="btn btn--line" onClick={() => fetchNumbers()} disabled={fetching || !ready}>
                  <Glyph name="refresh" size={16} />
                  {fetching ? 'Pulling' : 'Pull numbers'}
                </button>
                <p id="an-handle-msg" className="filmfield__status" data-tone={handleError ? 'error' : undefined} hidden={!handleError}>
                  {handleError}
                </p>
              </div>
              <div className="bench__quick">
                <span className="label text-2">Verified examples</span>
                <div className="chips">
                  {QUICK.map((q) => (
                    <button
                      key={q.handle}
                      type="button"
                      className="chip"
                      onClick={() => {
                        setPlatform(q.plat);
                        if (!loadVerified(q.handle, (name, n) => `Loaded verified numbers for ${name}: ${n.toLocaleString('en-US')} followers.`)) setHandle(q.label);
                      }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>

            <fieldset className="bench__group">
              <legend className="bench__legend"><span className="label text-safe">C</span> Public numbers <span className="text-2 bench__optional">optional if we can pull them</span></legend>
              <div className="bench__numbers">
                <div className="field">
                  <label className="field__label" htmlFor="an-followers">Followers</label>
                  <input id="an-followers" className="input" inputMode="numeric" value={followers} onChange={(e) => setFollowers(e.target.value)} placeholder="48,000" />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="an-following">Following</label>
                  <input id="an-following" className="input" inputMode="numeric" value={following} onChange={(e) => setFollowing(e.target.value)} placeholder="820" />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="an-posts">Posts or videos</label>
                  <input id="an-posts" className="input" inputMode="numeric" value={posts} onChange={(e) => setPosts(e.target.value)} placeholder="140" />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="an-likes">Average likes per post</label>
                  <input id="an-likes" className="input" inputMode="numeric" value={likes} onChange={(e) => setLikes(e.target.value)} placeholder="1,200" />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="an-comments">Average comments per post</label>
                  <input id="an-comments" className="input" inputMode="numeric" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="45" />
                </div>
                <div className="bench__er">
                  <Reading value={er.toFixed(2)} label="Engagement, live" size="m" tone={f > 0 && er > 0 ? 'developed' : 'neutral'} />
                </div>
              </div>
            </fieldset>
          </div>

          <aside className="bench__side" aria-label="Tray">
            <div className="bench__tray">
              {status ? (
                <div className={`state ${status.tone === 'error' ? 'state--fogged' : 'state--notice'}`} role="status">
                  <span className="state__mark"><Glyph name={status.tone === 'error' ? 'fogged' : status.tone === 'developed' ? 'developed' : 'timer'} size={28} /></span>
                  <div className="state__body">
                    <p className="state__title">{status.tone === 'error' ? 'Fogged' : status.tone === 'developed' ? 'Numbers in' : 'In the tray'}</p>
                    <p>{status.text}</p>
                  </div>
                </div>
              ) : (
                <div className="state" role="status">
                  <span className="state__mark"><Glyph name="tray" size={28} /></span>
                  <div className="state__body">
                    <p className="state__title">Nothing in the tray yet</p>
                    <p>Paste a handle or link to start. We never ask for a login, and we only read public numbers.</p>
                  </div>
                </div>
              )}
              <button type="submit" className="btn btn--safe btn--wide bench__go" disabled={busy}>
                {busy ? 'Developing' : 'Develop'} <Glyph name="arrow-right" size={18} />
              </button>
              <p className="bench__fine">A score is evidence about an audience, not a verdict on a person.</p>
            </div>

            <div className="bench__examples contact" data-room="dark">
              <p className="label text-2">Or load an example</p>
              <div className="bench__frames">
                {SAMPLE_REPORTS.slice(0, 3).map((r, i) => (
                  <button key={r.id} type="button" className="frame" onClick={() => loadPreset(r.id)}>
                    <span className="frame__img">
                      <Image src={r.avatarImage} alt="" width={200} height={200} sizes="6rem" />
                    </span>
                    <span className="frame__code"><span>{String(i + 1).padStart(2, '0')} ▸ {platformCode(r.platform)}</span></span>
                    <span className="frame__title">{r.handle}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </form>
      </section>
    </>
  );
}
