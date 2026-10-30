import React from 'react';

/**
 * A blown-up corner of a print: the grain resolves into individual
 * accounts (an illustration with fictional handles). Developed cells are genuine; the pale cluster is
 * where the ghosts sit, and four of them are labelled with what the
 * enlargement shows. Deterministic, so server and client agree.
 */

const COLS = 28;
const ROWS = 12;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const FLAGGED = [
  { col: 17, row: 3, handle: 'user4812207', note: 'Created 14 Mar 2026 · 0 posts · follows 4,112' },
  { col: 21, row: 6, handle: 'm.lux_9921', note: 'Created 15 Mar 2026 · no bio · follows 6,030' },
  { col: 15, row: 8, handle: 'shop_8812a', note: 'Created 14 Mar 2026 · 1 post · follows 3,977' },
  { col: 24, row: 2, handle: 'qz.photo.33', note: 'Created 16 Mar 2026 · 0 posts · follows 5,508' },
];

export function Enlarger() {
  const r = rng(5063);
  const cells: { tone: number; ghost: boolean; flagged?: (typeof FLAGGED)[number] }[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // ghost cluster centred right of middle, the way bought followers arrive together
      const dx = (col - 19.5) / 7.5;
      const dy = (row - 5.5) / 4.6;
      const inCluster = dx * dx + dy * dy < 1;
      const ghost = inCluster ? r() < 0.82 : r() < 0.07;
      const flagged = FLAGGED.find((f) => f.col === col && f.row === row);
      cells.push({ tone: 0.35 + r() * 0.65, ghost: ghost || !!flagged, flagged });
    }
  }

  return (
    <figure className="enlarger__field" aria-labelledby="enlarger-caption">
      <div className="enlarger__grid" style={{ '--cols': COLS, '--rows': ROWS } as React.CSSProperties} aria-hidden="true">
        {cells.map((c, i) => (
          <span
            key={i}
            className={c.ghost ? 'grain grain--ghost' : 'grain'}
            data-flagged={c.flagged ? 'true' : undefined}
            style={{ '--tone': c.tone.toFixed(2) } as React.CSSProperties}
          />
        ))}
      </div>
      <ol className="enlarger__flags" role="list">
        {FLAGGED.map((f) => (
          <li
            key={f.handle}
            className="enlarger__flag"
            style={{ '--col': f.col, '--row': f.row, '--cols': COLS, '--rows': ROWS } as React.CSSProperties}
          >
            <span className="enlarger__handle">@{f.handle}</span>
            <span className="enlarger__note">{f.note}</span>
          </li>
        ))}
      </ol>
      <figcaption id="enlarger-caption" className="sr-only">
        An enlargement of the ghost region of a print. Most grain cells are developed followers; a cluster of pale ghost cells
        sits right of centre. Four are labelled: accounts created between 14 and 16 March 2026, with no posts and thousands
        of follows each.
      </figcaption>
    </figure>
  );
}
