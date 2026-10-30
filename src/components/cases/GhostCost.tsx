'use client';

import React, { useId, useState } from 'react';
import { Edge } from '@/components/darkroom/Edge';
import { Reading } from '@/components/darkroom/Reading';

/**
 * Influencer fee against the developed audience. Arithmetic on numbers the
 * visitor types in (or reads off a report): what share of the fee reaches
 * followers who never developed, and the cost per thousand real followers.
 */

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const money2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const count = new Intl.NumberFormat('en-US');

function toNumber(v: string) {
  const n = Number(v.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function GhostCost({ slug }: { slug: string }) {
  const id = useId();
  const [followers, setFollowers] = useState('480000');
  const [fee, setFee] = useState('3000');
  const [ghost, setGhost] = useState('67');

  const f = toNumber(followers);
  const p = toNumber(fee);
  const g = Math.min(100, Math.max(0, toNumber(ghost)));
  const ready = f > 0 && p > 0;
  const developed = Math.round(f * (1 - g / 100));
  const toGhosts = Math.round(p * (g / 100));
  const statedCpm = ready ? (p / f) * 1000 : 0;
  const realCpm = ready && developed > 0 ? (p / developed) * 1000 : 0;

  return (
    <section className="band band--contact band--tray-surface page-grid" aria-labelledby={`${slug}-cost`}>
      <Edge frame="IV 03B" label="Fee against the print" />
      <div className="case-tool case-tool--wide cols">
        <div className="case-tool__head head">
          <p className="head__kicker label">Test strip · fee per developed follower</p>
          <h2 id={`${slug}-cost`} className="case-tool__title">
            What the ghosts cost you
          </h2>
          <div className="case-body">
            <p>
              Put in the creator’s follower count, the fee they quoted, and the ghost share from their print. The
              arithmetic shows how much of the fee is aimed at followers who never developed. A fair counter-offer starts
              from the developed audience, not the follower count.
            </p>
          </div>
        </div>

        <div className="case-tool__panel">
          <div className="case-tool__fields case-tool__fields--three">
            <div className="field">
              <label className="field__label" htmlFor={`${id}-followers`}>
                Followers
              </label>
              <input
                id={`${id}-followers`}
                className="input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`${id}-fee`}>
                Quoted fee (USD)
              </label>
              <input
                id={`${id}-fee`}
                className="input"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`${id}-ghost`}>
                Ghost share (%)
              </label>
              <input
                id={`${id}-ghost`}
                className="input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={ghost}
                onChange={(e) => setGhost(e.target.value)}
                aria-describedby={`${id}-ghost-hint`}
              />
              <span id={`${id}-ghost-hint`} className="field__hint">
                From the creator’s report. 0 to 100.
              </span>
            </div>
          </div>

          <div className="case-tool__result case-tool__result--readings" role="status" aria-live="polite">
            {ready ? (
              <>
                <span className="case-tool__readings">
                  <Reading value={money.format(toGhosts)} unit="" label="Aimed at ghosts" tone="ghost" size="m" />
                  <Reading value={count.format(developed)} unit="" label="Developed followers" tone="developed" size="m" />
                </span>
                <span className="case-tool__bar bar" aria-hidden="true">
                  <span className="bar__fill" style={{ inlineSize: `${100 - g}%` }} />
                </span>
                <dl className="specs case-tool__specs">
                  <dt>Per 1,000 followers</dt>
                  <dd className="tabular">{money2.format(statedCpm)} as quoted</dd>
                  <dt>Per 1,000 developed</dt>
                  <dd className="tabular">{developed > 0 ? `${money2.format(realCpm)} in practice` : 'No developed audience to divide by'}</dd>
                </dl>
              </>
            ) : (
              <span className="case-tool__text">Put in a follower count and a fee to see the split.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
