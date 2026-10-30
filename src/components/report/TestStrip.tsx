import React from 'react';
import { engagementBands, tierFor } from '@/lib/benchmarks';

/**
 * Engagement rate as a darkroom test strip: stepped exposure bands for the
 * audience tier, with this profile's rate marked on the strip.
 */
export function TestStrip({ followers, rate }: { followers: number; rate: number | null }) {
  const tier = tierFor(followers);
  const bands = engagementBands(tier.expected);
  const max = bands[bands.length - 1].to;
  const pos = rate == null ? null : Math.min(100, Math.max(0, (rate / max) * 100));
  const current = rate == null ? null : bands.find((b) => rate >= b.from && rate < b.to) || bands[bands.length - 1];

  return (
    <figure className="teststrip" aria-labelledby="teststrip-cap">
      <div className="teststrip__strip">
        {bands.map((b, i) => (
          <span
            key={b.key}
            className={`teststrip__band teststrip__band--${b.tone}`}
            style={{ flexGrow: b.to - b.from, '--step': i } as React.CSSProperties}
          >
            <span className="teststrip__band-label">{b.label}</span>
            <span className="teststrip__band-range tabular">
              {b.from.toFixed(1)}–{b.to.toFixed(1)}%
            </span>
          </span>
        ))}
        {pos != null ? (
          <span className="teststrip__mark" style={{ left: `${pos}%` }} aria-hidden="true">
            <span className="teststrip__mark-label tabular">{rate!.toFixed(2)}%</span>
          </span>
        ) : null}
      </div>
      <figcaption id="teststrip-cap" className="teststrip__cap">
        {rate == null
          ? `No engagement figures were shared for this profile, so the strip shows the ${tier.label} bands without a mark. Baseline for this tier: ${tier.expected}%.`
          : `Engagement ${rate.toFixed(2)}% against a ${tier.expected}% baseline for accounts with ${tier.label} followers: ${current?.label.toLowerCase()}.`}
      </figcaption>
    </figure>
  );
}
