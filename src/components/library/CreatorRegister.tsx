'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Glyph, platformCode, platformGlyph, type GlyphName } from '@/components/darkroom/Glyph';
import { formatNumber } from '@/lib/utils';

export interface RegisterEntry {
  key: string;
  rank: number;
  handle: string;
  name: string;
  platform: string;
  followers: number;
  score: number;
  realPct: number;
  fakePct: number;
  href: string;
}

type SortKey = 'rank' | 'handle' | 'platform' | 'followers' | 'developed' | 'score';
type Dir = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string; num?: boolean; short: string }[] = [
  { key: 'rank', label: 'Rank', short: 'Rank', num: true },
  { key: 'handle', label: 'Handle', short: 'Handle' },
  { key: 'platform', label: 'Platform', short: 'Platform' },
  { key: 'followers', label: 'Followers', short: 'Followers', num: true },
  { key: 'developed', label: 'Developed', short: 'Developed', num: true },
  { key: 'score', label: 'Score', short: 'Score', num: true },
];

/** Numeric columns open highest first; text and rank open from the top. */
const DEFAULT_DIR: Record<SortKey, Dir> = {
  rank: 'asc',
  handle: 'asc',
  platform: 'asc',
  followers: 'desc',
  developed: 'desc',
  score: 'desc',
};

const DIR_WORD: Record<Dir, 'ascending' | 'descending'> = { asc: 'ascending', desc: 'descending' };

function compare(a: RegisterEntry, b: RegisterEntry, key: SortKey): number {
  switch (key) {
    case 'handle':
      return a.handle.localeCompare(b.handle);
    case 'platform':
      return a.platform.localeCompare(b.platform) || a.rank - b.rank;
    case 'followers':
      return a.followers - b.followers;
    case 'developed':
      return a.realPct - b.realPct || b.rank - a.rank;
    case 'score':
      return a.score - b.score || b.rank - a.rank;
    case 'rank':
    default:
      return a.rank - b.rank;
  }
}

const pad = (n: number) => String(n).padStart(2, '0');

export function CreatorRegister({ entries }: { entries: RegisterEntry[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [dir, setDir] = useState<Dir>('asc');

  const rows = useMemo(() => {
    const sorted = [...entries].sort((a, b) => compare(a, b, sortKey));
    return dir === 'asc' ? sorted : sorted.reverse();
  }, [entries, sortKey, dir]);

  const sortBy = (key: SortKey) => {
    if (key === sortKey) {
      setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setDir(DEFAULT_DIR[key]);
    }
  };

  const activeLabel = COLUMNS.find((c) => c.key === sortKey)?.label ?? 'Rank';

  if (entries.length === 0) {
    return (
      <div className="state">
        <div className="state__mark" aria-hidden="true">
          <Glyph name="sleeve" size={28} />
        </div>
        <div className="state__body">
          <p className="state__title">The register is empty</p>
          <p>No prints are on file right now. Nothing was removed from any report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exhibit-register">
      <div className="exhibit-sortbar" role="group" aria-label="Sort the register">
        <span className="label text-2" aria-hidden="true">Sort</span>
        <div className="chips">
          {COLUMNS.filter((c) => c.key !== 'platform').map((c) => (
            <button
              key={c.key}
              type="button"
              className="chip"
              aria-pressed={sortKey === c.key}
              onClick={() => sortBy(c.key)}
            >
              {c.short}
              {sortKey === c.key ? (
                <Glyph name={dir === 'asc' ? 'sort-up' : 'sort-down'} size={14} title={DIR_WORD[dir]} />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Sorted by {activeLabel.toLowerCase()}, {DIR_WORD[dir]}.
      </p>

      <div className="table-wrap">
        <table className="datatable exhibit-table">
          <caption className="sr-only">
            Every profile on file with its rank, platform, follower count, developed share and score. Column
            headers are buttons that sort the table.
          </caption>
          <thead>
            <tr>
              {COLUMNS.map((c) => {
                const active = sortKey === c.key;
                const glyph: GlyphName = active ? (dir === 'asc' ? 'sort-up' : 'sort-down') : 'sort';
                return (
                  <th
                    key={c.key}
                    scope="col"
                    className={c.num ? 'num' : undefined}
                    aria-sort={active ? DIR_WORD[dir] : 'none'}
                  >
                    <button
                      type="button"
                      className="sort-btn"
                      data-active={active ? 'true' : undefined}
                      onClick={() => sortBy(c.key)}
                    >
                      {c.label}
                      <Glyph name={glyph} size={14} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="exhibit-row">
                <td className="num exhibit-row__rank">
                  <span className="exhibit-row__no" aria-hidden="true">No.</span>
                  {pad(r.rank)}
                </td>
                <td className="exhibit-row__subject">
                  <Link href={r.href} className="exhibit-row__handle">
                    {r.handle}
                  </Link>
                  <span className="exhibit-row__name">{r.name}</span>
                </td>
                <td className="exhibit-row__platform">
                  <span className="edgecode">
                    <Glyph name={platformGlyph(r.platform)} size={16} />
                    <span aria-hidden="true">{platformCode(r.platform)}</span>
                    <span className="sr-only">{r.platform}</span>
                  </span>
                </td>
                <td className="num exhibit-row__followers" data-label="Followers">
                  <data value={r.followers} title={r.followers.toLocaleString('en-US')}>
                    {formatNumber(r.followers)}
                  </data>
                </td>
                <td className="num exhibit-row__developed" data-label="Developed">
                  <span className="exhibit-row__pct">
                    <span className="text-amber">{r.realPct}%</span>
                    <span className="exhibit-row__ghost text-cyan">
                      <span className="sr-only">, ghost </span>
                      {r.fakePct}%
                    </span>
                  </span>
                  <span className="bar exhibit-row__bar" aria-hidden="true">
                    <span className="bar__fill" style={{ width: `${r.realPct}%` }} />
                  </span>
                </td>
                <td className="num exhibit-row__score" data-label="Score">
                  {r.score}
                  <span className="exhibit-row__of" aria-hidden="true">/100</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
