import React from 'react';

/**
 * Grease pencil: the only hand-drawn element on the site.
 * Strokes use pathLength="1" so Stage 5 can draw them on with
 * stroke-dashoffset. Everything is decorative unless `label` is given.
 */

/** Wraps content in a loose hand-drawn ring. */
export function GreaseCircle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={['grease-ring', className].filter(Boolean).join(' ')}>
      {children}
      <svg className="grease-ring__svg grease-stroke" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          pathLength={1}
          d="M9 33 C 6 9, 88 2, 94 27 C 99 52, 18 62, 6 39 C 2 26, 28 9, 61 8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

/** A grease-pencil underline under inline text. */
export function GreaseUnderline({ children }: { children: React.ReactNode }) {
  return (
    <span className="grease-under">
      {children}
      <svg className="grease-under__svg grease-stroke" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength={1} d="M2 6 C 30 3, 60 8, 98 4" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}

/** A grease-pencil cross over a frame (rejected frame on a contact sheet). */
export function GreaseCross() {
  return (
    <svg className="grease-cross grease-stroke" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength={1} d="M14 18 C 40 44, 62 64, 88 86" vectorEffect="non-scaling-stroke" />
      <path pathLength={1} d="M86 14 C 60 40, 38 62, 12 88" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Hand-written words, e.g. a verdict on a print border. */
export function GreaseNote({
  children,
  tilt = -4,
  tone = 'amber',
  as: Tag = 'span',
  className,
}: {
  children: React.ReactNode;
  tilt?: number;
  tone?: 'amber' | 'cyan' | 'safe';
  as?: 'span' | 'p' | 'strong';
  className?: string;
}) {
  return (
    <Tag
      className={['grease-note', `grease-note--${tone}`, className].filter(Boolean).join(' ')}
      style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
