import React from 'react';
import Link from 'next/link';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph, type GlyphName } from '@/components/darkroom/Glyph';

/**
 * The opening band shared by the four darkroom tools: breadcrumb as an edge
 * line, an off-center headline at page scale, a short Newsreader lede, and a
 * small spec block printed like the label on a box of paper. `variant` moves
 * the pieces around the grid so no two tools open the same way.
 */
export function ToolOpening({
  id,
  frame,
  tool,
  glyph,
  title,
  lede,
  specs,
  variant,
}: {
  id: string;
  frame: string;
  tool: string;
  glyph: GlyphName;
  title: React.ReactNode;
  lede: React.ReactNode;
  specs: Array<[string, React.ReactNode]>;
  variant: 'bulk' | 'lightbox' | 'strip' | 'sleeve';
}) {
  return (
    <section className={`band tool-open tool-open--${variant} page-grid`} aria-labelledby={id}>
      <Edge frame={frame} label={tool} />
      <div className="tool-open__inner cols">
        <nav className="crumbs tool-open__crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/#equipment">Darkroom</Link>
            </li>
            <li>
              <span aria-current="page">{tool}</span>
            </li>
          </ol>
        </nav>
        <h1 id={id} className="tool-open__title">
          {title}
        </h1>
        <p className="tool-open__lede">{lede}</p>
        <div className="tool-open__label">
          <p className="tool-open__code label">
            <Glyph name={glyph} size={22} />
            <span>Equipment {frame}</span>
          </p>
          <dl className="tool-open__specs">
            {specs.map(([k, v]) => (
              <div key={k} className="tool-open__spec">
                <dt className="label">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
