import React from 'react';
import { Glyph } from './Glyph';

/**
 * A densitometer-style reading: thin display numeral plus a mono label.
 * "developed" is amber (genuine), "ghost" is cyan (fake), "neutral" is print white.
 */
export function Reading({
  value,
  unit = '%',
  label,
  tone = 'neutral',
  size = 'l',
  note,
}: {
  value: React.ReactNode;
  unit?: string;
  label: string;
  tone?: 'developed' | 'ghost' | 'neutral';
  size?: 's' | 'm' | 'l';
  note?: React.ReactNode;
}) {
  const glyph = tone === 'developed' ? 'developed' : tone === 'ghost' ? 'ghost' : null;
  return (
    <div className={`reading reading--${tone} reading--${size}`}>
      <span className="reading__label label">
        {glyph ? <Glyph name={glyph} size={14} /> : null}
        {label}
      </span>
      <data className="reading__value" value={typeof value === 'number' ? value : undefined}>
        {value}
        {unit ? <span className="reading__unit">{unit}</span> : null}
      </data>
      {note ? <span className="reading__note">{note}</span> : null}
    </div>
  );
}
