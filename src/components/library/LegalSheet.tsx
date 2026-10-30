import React from 'react';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph } from '@/components/darkroom/Glyph';
import { Crumbs } from '@/components/library/Crumbs';

export interface Clause {
  /** Anchor id, e.g. "pr-01" */
  id: string;
  /** Mono section code, e.g. "PR-01" */
  code: string;
  title: string;
  body: React.ReactNode;
}

/**
 * A legal page set as a Kodak-style technical data sheet: numbered clauses,
 * mono section codes, a sticky clause index on wide screens and a
 * collapsible index on phones. Rendered in the Lights-on palette.
 */
export function LegalSheet({
  publication,
  crumb,
  title,
  titleId,
  lede,
  effective,
  revision,
  notice,
  clauses,
  frame,
}: {
  publication: string;
  crumb: string;
  title: React.ReactNode;
  titleId: string;
  lede: React.ReactNode;
  effective: string;
  revision: string;
  notice?: React.ReactNode;
  clauses: Clause[];
  frame: string;
}) {
  const index = (
    <ol className="legal-index__list">
      {clauses.map((c) => (
        <li key={c.id}>
          <a href={`#${c.id}`} className="legal-index__link">
            <span className="legal-index__code">{c.code}</span>
            <span>{c.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="legal" data-room="light">
      <section className="band page-grid legal-head" aria-labelledby={titleId}>
        <Edge frame={frame} label={publication} />
        <Crumbs trail={[{ label: 'Home', href: '/' }, { label: crumb }]} />
        <div className="cols legal-head__grid">
          <div className="head legal-head__title">
            <p className="head__kicker label">Data sheet · {publication}</p>
            <h1 id={titleId}>{title}</h1>
            <p className="head__lede">{lede}</p>
          </div>
          <dl className="specs legal-head__specs">
            <dt>Publication</dt>
            <dd className="legal-mono">{publication}</dd>
            <dt>Effective</dt>
            <dd>{effective}</dd>
            <dt>Revision</dt>
            <dd>{revision}</dd>
            <dt>Clauses</dt>
            <dd className="tabular">{clauses.length}</dd>
          </dl>
        </div>
      </section>

      <section className="band band--rule page-grid legal-body" aria-label={`${crumb} clauses`}>
        <div className="legal-layout">
          <nav className="legal-index legal-index--rail" aria-label="Clause index">
            <p className="label legal-index__head">Clause index</p>
            {index}
          </nav>

          <details className="legal-index legal-index--drawer">
            <summary className="legal-index__summary">
              <span className="label">Clause index</span>
              <span className="label text-2 tabular">{clauses.length} clauses</span>
              <Glyph name="plus" size={18} className="legal-index__plus" />
              <Glyph name="minus" size={18} className="legal-index__minus" />
            </summary>
            <nav aria-label="Clause index, compact">{index}</nav>
          </details>

          <div className="legal-clauses">
            {notice ? <div className="legal-notice">{notice}</div> : null}
            {clauses.map((c) => (
              <section key={c.id} id={c.id} className="legal-clause" aria-labelledby={`${c.id}-title`}>
                <p className="legal-clause__code">{c.code}</p>
                <h2 id={`${c.id}-title`} className="legal-clause__title">
                  {c.title}
                </h2>
                <div className="prose legal-clause__body">{c.body}</div>
              </section>
            ))}
            <p className="legal-end label">End of {publication}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
