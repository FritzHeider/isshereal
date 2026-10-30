import React from 'react';

/**
 * Film-edge marking. Sits in the page grid's edge column on desktop
 * (vertical, like the rebate of a 35mm strip) and becomes a horizontal
 * edge line above its section on narrow screens. Decorative: the section
 * heading carries the same information for assistive tech.
 */
export function Edge({ frame, label, emulsion = '5063' }: { frame: string; label: string; emulsion?: string }) {
  return (
    <p className="edge-mark" aria-hidden="true">
      <span>ISSHEREAL {emulsion}</span>
      <span className="edge-mark__frame">▸ {frame}</span>
      <span>▸ {label}</span>
    </p>
  );
}

/** A thin row of sprocket holes for film-strip surfaces. */
export function Sprockets() {
  return <div className="sprockets" aria-hidden="true" />;
}
