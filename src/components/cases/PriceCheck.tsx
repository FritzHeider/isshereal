'use client';

import React, { useId, useState } from 'react';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph } from '@/components/darkroom/Glyph';

/**
 * Marketplace price check. Plain arithmetic: how far below the going rate
 * is the asking price? It does not score the seller and claims nothing
 * beyond the subtraction it shows.
 */

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function toNumber(v: string) {
  const n = Number(v.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function reading(pct: number, usual: number, asking: number) {
  if (usual <= 0 || asking <= 0) {
    return {
      tone: 'neutral' as const,
      title: 'Waiting for two prices',
      text: 'Put in what this item usually sells for second-hand and what the seller is asking.',
    };
  }
  if (pct <= 0) {
    return {
      tone: 'developed' as const,
      title: 'At or above the going rate',
      text: 'Nothing unusual about the price. You can still haggle, and the usual payment advice still applies.',
    };
  }
  if (pct < 15) {
    return {
      tone: 'developed' as const,
      title: 'Ordinary haggling range',
      text: 'A normal second-hand price. Check the item works before you pay and you’re in good shape.',
    };
  }
  if (pct < 35) {
    return {
      tone: 'neutral' as const,
      title: 'A good deal',
      text: 'Good deals happen: someone moving house, someone who wants it gone. Ask one or two questions and keep payment on the platform.',
    };
  }
  return {
    tone: 'ghost' as const,
    title: 'Far below the going rate',
    text: 'Prices this low on things people want are how most marketplace scams start. Ask why it’s so cheap, ask for a fresh photo, and don’t pay anything you can’t get back.',
  };
}

export function PriceCheck({ slug }: { slug: string }) {
  const id = useId();
  const [usual, setUsual] = useState('800');
  const [asking, setAsking] = useState('290');
  const u = toNumber(usual);
  const a = toNumber(asking);
  const pct = u > 0 && a > 0 ? Math.round(((u - a) / u) * 100) : 0;
  const r = reading(pct, u, a);
  const below = Math.max(0, pct);

  return (
    <section className="band band--contact band--tray-surface page-grid" aria-labelledby={`${slug}-price`}>
      <Edge frame="MK 03B" label="Price check" />
      <div className="case-tool cols">
        <div className="case-tool__head head">
          <p className="head__kicker label">Test strip · price against the going rate</p>
          <h2 id={`${slug}-price`} className="case-tool__title">
            How cheap is too cheap?
          </h2>
          <div className="case-body">
            <p>
              Look up what the same item has actually sold for recently (sold listings, not asking prices), then put both
              numbers in. This is subtraction, not a verdict. It just makes the gap easy to see.
            </p>
          </div>
        </div>

        <div className="case-tool__panel">
          <div className="case-tool__fields">
            <div className="field">
              <label className="field__label" htmlFor={`${id}-usual`}>
                Usual second-hand price (USD)
              </label>
              <input
                id={`${id}-usual`}
                className="input"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={usual}
                onChange={(e) => setUsual(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`${id}-asking`}>
                Seller’s asking price (USD)
              </label>
              <input
                id={`${id}-asking`}
                className="input"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={asking}
                onChange={(e) => setAsking(e.target.value)}
              />
            </div>
          </div>

          <output className="case-tool__result" htmlFor={`${id}-usual ${id}-asking`} aria-live="polite" data-tone={r.tone}>
            <span className="case-tool__strip" aria-hidden="true">
              <span className="case-tool__strip-fill" style={{ inlineSize: `${Math.min(100, below)}%` }} />
            </span>
            <span className="case-tool__figure">
              <span className="case-tool__num tabular">{below}</span>
              <span className="case-tool__unit">% below</span>
            </span>
            <span className="case-tool__verdict">
              <Glyph name={r.tone === 'ghost' ? 'ghost' : r.tone === 'developed' ? 'developed' : 'loupe'} size={18} />
              <strong>{r.title}</strong>
            </span>
            <span className="case-tool__text">{r.text}</span>
            {u > 0 && a > 0 && pct > 0 ? (
              <span className="case-tool__sum label text-2">
                {money.format(u)} usual − {money.format(a)} asked = {money.format(u - a)} off
              </span>
            ) : null}
          </output>
        </div>
      </div>
    </section>
  );
}
