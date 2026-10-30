'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph } from '@/components/darkroom/Glyph';
import { GreaseCross, GreaseNote } from '@/components/darkroom/Grease';
import { ToolOpening } from '@/components/tools/ToolOpening';
import {
  PLATFORMS,
  FOGGED_LINE,
  benchHref,
  cleanHandle,
  fetchAudit,
  isRemote,
  platformFromLink,
  reportHref,
  type AuditOutcome,
  type Platform,
} from '@/components/tools/audit-client';
import { greaseVerdict } from '@/lib/utils';

/** A roll of 35 mm film holds 36 frames; so does a sheet. */
const FRAMES_PER_ROLL = 36;
const BLANK_FRAMES = 12;

type FrameState = { kind: 'queued' } | { kind: 'developing' } | AuditOutcome;

interface FrameRow {
  id: string;
  n: number;
  handle: string;
  platform: Platform;
  state: FrameState;
}

const pad = (n: number) => String(n).padStart(2, '0');
const codeFor = (p: Platform) => PLATFORMS.find((x) => x.value === p)?.code ?? 'SC';

/** Split pasted text into unique handles, keeping a platform when a link names one. */
function parseHandles(text: string, fallback: Platform): Array<{ handle: string; platform: Platform }> {
  const seen = new Set<string>();
  const out: Array<{ handle: string; platform: Platform }> = [];
  for (const token of text.split(/[\s,;]+/)) {
    if (!token) continue;
    const handle = cleanHandle(token);
    if (!handle) continue;
    const platform = platformFromLink(token) ?? fallback;
    const key = `${platform}:${handle}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ handle, platform });
  }
  return out;
}

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function isMostlyGhost(f: FrameRow): boolean {
  return f.state.kind === 'developed' && f.state.report.fakePct >= 50;
}

export default function BulkPage() {
  const [text, setText] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [frames, setFrames] = useState<FrameRow[]>([]);
  const [roll, setRoll] = useState(0);
  const [running, setRunning] = useState(false);
  const [inputError, setInputError] = useState('');
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const pending = useMemo(() => parseHandles(text, platform), [text, platform]);

  const update = useCallback((id: string, state: FrameState) => {
    setFrames((prev) => prev.map((f) => (f.id === id ? { ...f, state } : f)));
  }, []);

  const run = useCallback(
    async (rows: FrameRow[], total: number) => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setRunning(true);
      for (const row of rows) {
        if (ctrl.signal.aborted) break;
        update(row.id, { kind: 'developing' });
        setStatus(`Frame ${pad(row.n)} of ${pad(total)} in the tray: @${row.handle}.`);
        try {
          const outcome = await fetchAudit(row.handle, row.platform, ctrl.signal);
          update(row.id, outcome);
        } catch {
          update(row.id, { kind: 'queued' });
          break;
        }
      }
      setRunning(false);
      if (ctrl.signal.aborted) {
        setStatus('Roll stopped. Frames still queued were left unexposed.');
      } else {
        setStatus('Roll finished. Every frame has been examined.');
      }
    },
    [update],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (running) return;
    if (pending.length === 0) {
      setInputError('No handles found. Paste one per line, or separate them with commas.');
      return;
    }
    setInputError('');
    const take = pending.slice(0, FRAMES_PER_ROLL);
    const left = pending.length - take.length;
    setNotice(
      left > 0
        ? `A roll holds ${FRAMES_PER_ROLL} frames. The last ${left} handle${left === 1 ? ' was' : 's were'} left off; print ${left === 1 ? 'it' : 'them'} on a second roll.`
        : '',
    );
    const nextRoll = roll + 1;
    setRoll(nextRoll);
    const rows: FrameRow[] = take.map((p, i) => ({
      id: `${nextRoll}-${i}-${p.platform}-${p.handle}`,
      n: i + 1,
      handle: p.handle,
      platform: p.platform,
      state: { kind: 'queued' },
    }));
    setFrames(rows);
    void run(rows, rows.length);
  };

  const stop = () => abortRef.current?.abort();

  const resume = () => {
    const queued = frames.filter((f) => f.state.kind === 'queued');
    if (queued.length) void run(queued, frames.length);
  };

  const retry = (row: FrameRow) => {
    if (running) return;
    void run([row], frames.length);
  };

  const clear = () => {
    if (running) return;
    setFrames([]);
    setNotice('');
    setStatus('Sheet cleared.');
  };

  const counts = useMemo(() => {
    let developed = 0, ghost = 0, unreached = 0, fogged = 0, queued = 0;
    for (const f of frames) {
      if (f.state.kind === 'developed') {
        developed++;
        if (f.state.report.fakePct >= 50) ghost++;
      } else if (f.state.kind === 'unreached') unreached++;
      else if (f.state.kind === 'fogged') fogged++;
      else queued++;
    }
    return { developed, ghost, unreached, fogged, queued, done: developed + unreached + fogged };
  }, [frames]);

  const exportCsv = () => {
    const header = ['frame', 'handle', 'platform', 'status', 'developed_pct', 'ghost_pct', 'score', 'engagement_rate', 'followers', 'verdict'];
    const lines = frames.map((f) => {
      const s = f.state;
      if (s.kind === 'developed') {
        const r = s.report;
        return [pad(f.n), r.handle, f.platform, 'developed', r.realPct, r.fakePct, r.score, r.engagementRate, r.followersCount, r.verdict];
      }
      const statusWord = s.kind === 'unreached' ? 'not_reached' : s.kind === 'fogged' ? 'fogged' : 'not_exposed';
      return [pad(f.n), `@${f.handle}`, f.platform, statusWord, '', '', '', '', '', ''];
    });
    const csv = [header, ...lines].map((row) => row.map(csvCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isshereal-roll-${pad(roll)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus(`Roll ${pad(roll)} exported as CSV, ${frames.length} rows.`);
  };

  const hasSheet = frames.length > 0;
  const canExport = hasSheet && counts.done > 0 && !running;

  return (
    <>
      <ToolOpening
        id="bulk-title"
        frame="B0"
        tool="Contact sheet printer"
        glyph="contact"
        variant="bulk"
        title={
          <>
            Contact sheet <span className="safe">printer</span>
          </>
        }
        lede={
          <>
            Paste a list of handles. Each one becomes a frame on the sheet and goes into the tray in turn.
            The frames that come up <em>mostly ghost</em> get a mark in grease pencil.
          </>
        }
        specs={[
          ['Takes', 'Handles or profile links, one per line'],
          ['Holds', `${FRAMES_PER_ROLL} frames per roll`],
          ['Returns', 'A marked contact sheet and a CSV'],
        ]}
      />

      <section className="band band--contact bulk-bench page-grid" aria-labelledby="bulk-bench-title">
        <Edge frame="B1" label={hasSheet ? `Roll ${pad(roll)}` : 'Loading the printer'} />
        <div className="bulk-bench__inner cols">
          <form className="bulk-loader" onSubmit={onSubmit} noValidate>
            <h2 id="bulk-bench-title" className="bulk-loader__title">
              Load the roll
            </h2>
            <div className="field">
              <label className="field__label" htmlFor="bulk-handles">
                <span>Handles</span>
                <span className="tabular" aria-live="off">
                  {Math.min(pending.length, FRAMES_PER_ROLL)} / {FRAMES_PER_ROLL}
                </span>
              </label>
              <textarea
                id="bulk-handles"
                className="textarea bulk-loader__text"
                rows={9}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (inputError) setInputError('');
                }}
                placeholder={'@first_handle\n@second_handle\nhttps://www.tiktok.com/@third'}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                aria-invalid={inputError ? 'true' : undefined}
                aria-describedby={inputError ? 'bulk-handles-error' : 'bulk-handles-hint'}
                disabled={running}
              />
              {inputError ? (
                <p id="bulk-handles-error" className="field__error">
                  <Glyph name="warning" size={16} />
                  {inputError}
                </p>
              ) : (
                <p id="bulk-handles-hint" className="field__hint">
                  Duplicates are dropped. A link to TikTok or YouTube keeps its own platform.
                </p>
              )}
            </div>

            <fieldset className="bulk-loader__platforms">
              <legend className="field__label">Platform for bare handles</legend>
              <div className="chips">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className="chip"
                    aria-pressed={platform === p.value}
                    onClick={() => setPlatform(p.value)}
                    disabled={running}
                  >
                    <span className="label">{p.code}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="bulk-loader__actions">
              {running ? (
                <button type="button" className="btn btn--line" onClick={stop}>
                  <Glyph name="close" size={18} />
                  Stop the roll
                </button>
              ) : (
                <button type="submit" className="btn btn--safe">
                  <Glyph name="contact" size={18} />
                  Print the sheet
                </button>
              )}
              {!running && counts.queued > 0 && hasSheet ? (
                <button type="button" className="btn btn--line" onClick={resume}>
                  Resume
                </button>
              ) : null}
              {!running && hasSheet ? (
                <button type="button" className="btn btn--quiet" onClick={clear}>
                  Clear the sheet
                </button>
              ) : null}
            </div>
            {notice ? <p className="bulk-loader__notice">{notice}</p> : null}
            <p className="bulk-loader__aside">
              Each handle is examined one at a time, the same way a single report is. Profiles
              examined recently come back at once; the rest take a few seconds each.
            </p>
          </form>

          <div className="bulk-sheet">
            <div className="bulk-sheet__head">
              <p className="bulk-sheet__roll label">
                Roll <span className="tabular">{hasSheet ? pad(roll) : '––'}</span>
              </p>
              <dl className="bulk-sheet__tally">
                <div>
                  <dt className="label">Exposed</dt>
                  <dd className="tabular">
                    {pad(counts.done)}/{pad(frames.length)}
                  </dd>
                </div>
                <div className="bulk-sheet__tally--developed">
                  <dt className="label">Developed</dt>
                  <dd className="tabular">{pad(counts.developed)}</dd>
                </div>
                <div className="bulk-sheet__tally--ghost">
                  <dt className="label">Mostly ghost</dt>
                  <dd className="tabular">{pad(counts.ghost)}</dd>
                </div>
                <div>
                  <dt className="label">Not reached</dt>
                  <dd className="tabular">{pad(counts.unreached + counts.fogged)}</dd>
                </div>
              </dl>
              <button type="button" className="btn btn--line btn--compact" onClick={exportCsv} disabled={!canExport}>
                <Glyph name="export" size={16} />
                Export CSV
              </button>
            </div>

            <p className="sr-only" role="status" aria-live="polite">
              {status}
            </p>

            <div className="contact bulk-sheet__film" data-room="dark">
              {!hasSheet ? (
                <div className="bulk-sheet__empty">
                  <div className="state">
                    <span className="state__mark">
                      <Glyph name="contact" size={28} />
                    </span>
                    <div className="state__body">
                      <p className="state__title">Nothing on the sheet yet</p>
                      <p>Paste handles to the left and print. Frames appear here in the order you listed them.</p>
                    </div>
                  </div>
                  <ol className="contact__frames bulk-frames bulk-frames--blank" role="list" aria-hidden="true">
                    {Array.from({ length: BLANK_FRAMES }, (_, i) => (
                      <li key={i} className="bulk-frame bulk-frame--blank">
                        <span className="frame__img" />
                        <span className="frame__code">
                          <span>{pad(i + 1)}</span>
                          <span>{pad(i + 1)}A</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <ol className="contact__frames bulk-frames" role="list" aria-label={`Roll ${pad(roll)}, ${frames.length} frames`}>
                  {frames.map((f) => (
                    <FrameCell key={f.id} f={f} onRetry={() => retry(f)} disabled={running} />
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="band band--rule bulk-log page-grid" aria-labelledby="bulk-log-title">
        <Edge frame="B2" label="Sheet log" />
        <div className="bulk-log__inner cols">
          <div className="bulk-log__notes">
            <h2 id="bulk-log-title" className="bulk-log__title">
              Sheet <span className="safe">log</span>
            </h2>
            <p>
              The same frames as a register, in the order they were printed. The CSV carries exactly these
              columns, with a blank where nothing was measured.
            </p>
            <ul className="signals bulk-log__key" role="list">
              <li>
                <Glyph name="developed" size={16} className="text-amber" />
                <span><strong>Developed.</strong> The profile answered and its audience was read.</span>
              </li>
              <li>
                <Glyph name="ghost" size={16} className="text-cyan" />
                <span><strong>Not reached.</strong> The platform kept the figures private. Add them by hand on the bench.</span>
              </li>
              <li>
                <Glyph name="fogged" size={16} className="text-safe" />
                <span><strong>Fogged.</strong> The request failed. Nothing was developed and nothing was guessed.</span>
              </li>
            </ul>
            <p className="bulk-log__caveat">A score is evidence about an audience, not a verdict on a person.</p>
          </div>

          <div className="sheet bulk-log__sheet">
            <div className="sheet__head">
              <span className="sheet__code">Roll {hasSheet ? pad(roll) : '––'} · {frames.length} frames</span>
              <span className="sheet__title">Register</span>
            </div>
            {!hasSheet ? (
              <div className="bulk-log__empty">
                <span className="latent latent--line" aria-hidden="true" />
                <span className="latent latent--line" aria-hidden="true" />
                <span className="latent latent--line" aria-hidden="true" />
                <p className="text-2">The register fills in as each frame comes out of the tray.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="datatable bulk-table">
                  <caption className="sr-only">Results for roll {pad(roll)}</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="num">Frame</th>
                      <th scope="col">Handle</th>
                      <th scope="col">Edge</th>
                      <th scope="col" className="num">Developed</th>
                      <th scope="col" className="num">Ghost</th>
                      <th scope="col" className="num">Score</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {frames.map((f) => (
                      <LogRow key={f.id} f={f} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FrameCell({ f, onRetry, disabled }: { f: FrameRow; onRetry: () => void; disabled: boolean }) {
  const s = f.state;
  const code = codeFor(f.platform);

  if (s.kind === 'developed') {
    const r = s.report;
    const ghost = isMostlyGhost(f);
    return (
      <li className="bulk-frame" data-state={ghost ? 'ghost' : 'developed'}>
        <Link className="frame bulk-frame__link" href={reportHref(r, f.platform)}>
          <span className="frame__img">
            <Image
              src={r.avatarImage}
              alt=""
              width={200}
              height={200}
              sizes="(max-width: 56rem) 44vw, 11rem"
              loading="lazy"
              unoptimized={isRemote(r.avatarImage)}
            />
            {ghost ? <GreaseCross /> : null}
          </span>
          <span className="frame__code">
            <span>
              {pad(f.n)} · {code}
            </span>
            <span className={ghost ? 'text-cyan' : undefined}>{r.realPct}% dev</span>
          </span>
          <span className="frame__title">{r.handle}</span>
          <span className="frame__sub">
            {r.followers} · score <span className="tabular">{r.score}</span>
          </span>
          {ghost ? (
            <GreaseNote tone="cyan" tilt={-5} className="bulk-frame__verdict">
              {greaseVerdict(r.score)}
            </GreaseNote>
          ) : null}
        </Link>
      </li>
    );
  }

  if (s.kind === 'unreached') {
    return (
      <li className="bulk-frame" data-state="unreached">
        <div className="frame">
          <span className="frame__img bulk-frame__blank">
            <Glyph name="ghost" size={28} />
          </span>
          <span className="frame__code">
            <span>
              {pad(f.n)} · {code}
            </span>
            <span className="text-cyan">Not reached</span>
          </span>
          <span className="frame__title">@{f.handle}</span>
          <span className="frame__sub">
            The platform kept the figures private.{' '}
            <Link href={benchHref(f.handle)} className="bulk-frame__action">
              Add them by hand
            </Link>
          </span>
        </div>
      </li>
    );
  }

  if (s.kind === 'fogged') {
    return (
      <li className="bulk-frame" data-state="fogged">
        <div className="frame">
          <span className="frame__img bulk-frame__fog">
            <Glyph name="fogged" size={28} />
          </span>
          <span className="frame__code">
            <span>
              {pad(f.n)} · {code}
            </span>
            <span className="text-safe">Fogged</span>
          </span>
          <span className="frame__title">@{f.handle}</span>
          <span className="frame__sub">
            {s.message === FOGGED_LINE ? 'The platform didn’t answer. Nothing was guessed.' : s.message}
          </span>
          <button type="button" className="btn btn--quiet bulk-frame__retry" onClick={onRetry} disabled={disabled}>
            <Glyph name="refresh" size={16} />
            Expose again
          </button>
        </div>
      </li>
    );
  }

  const developing = s.kind === 'developing';
  return (
    <li className="bulk-frame" data-state={s.kind} aria-busy={developing || undefined}>
      <div className="frame">
        <span className={`frame__img bulk-frame__blank${developing ? ' latent' : ''}`}>
          {developing ? <Glyph name="tray" size={28} /> : null}
        </span>
        <span className="frame__code">
          <span>
            {pad(f.n)} · {code}
          </span>
          <span className="text-2">{developing ? 'In the tray' : 'Queued'}</span>
        </span>
        <span className="frame__title">@{f.handle}</span>
      </div>
    </li>
  );
}

function LogRow({ f }: { f: FrameRow }) {
  const s = f.state;
  const code = codeFor(f.platform);
  if (s.kind === 'developed') {
    const r = s.report;
    const ghost = r.fakePct >= 50;
    return (
      <tr data-state={ghost ? 'ghost' : 'developed'}>
        <td className="num" data-label="Frame">{pad(f.n)}</td>
        <td className="mono" data-label="Handle">
          <Link href={reportHref(r, f.platform)}>{r.handle}</Link>
        </td>
        <td className="mono" data-label="Edge">{code}</td>
        <td className="num text-amber" data-label="Developed">{r.realPct}%</td>
        <td className="num text-cyan" data-label="Ghost">{r.fakePct}%</td>
        <td className="num" data-label="Score">{r.score}</td>
        <td data-label="Status">
          <span className={`tag ${ghost ? 'tag--ghost' : 'tag--developed'}`}>{ghost ? 'Mostly ghost' : 'Developed'}</span>
        </td>
      </tr>
    );
  }
  const label =
    s.kind === 'unreached' ? 'Not reached' : s.kind === 'fogged' ? 'Fogged' : s.kind === 'developing' ? 'In the tray' : 'Queued';
  const tagClass = s.kind === 'unreached' ? 'tag tag--ghost' : s.kind === 'fogged' ? 'tag tag--safe' : 'tag';
  return (
    <tr data-state={s.kind}>
      <td className="num" data-label="Frame">{pad(f.n)}</td>
      <td className="mono" data-label="Handle">@{f.handle}</td>
      <td className="mono" data-label="Edge">{code}</td>
      <td className="num text-2" data-label="Developed">–</td>
      <td className="num text-2" data-label="Ghost">–</td>
      <td className="num text-2" data-label="Score">–</td>
      <td data-label="Status">
        <span className={tagClass}>{label}</span>
      </td>
    </tr>
  );
}

