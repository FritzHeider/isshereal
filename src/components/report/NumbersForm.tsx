'use client';

import React from 'react';
import { Glyph } from '@/components/darkroom/Glyph';

const TIERS = [
  { label: '10K', followers: '10,000', following: '450', posts: '95' },
  { label: '50K', followers: '50,000', following: '720', posts: '180' },
  { label: '250K', followers: '250,000', following: '410', posts: '340' },
  { label: '1.2M', followers: '1,200,000', following: '290', posts: '850' },
];

/**
 * The public-numbers form used when a platform does not answer, and when a
 * visitor adjusts the numbers on an existing print. Accepts "14,200", "1.2M", "48K".
 */
export function NumbersForm({
  idPrefix,
  followers,
  following,
  posts,
  onFollowers,
  onFollowing,
  onPosts,
  onSubmit,
  error,
  submitLabel,
  onCancel,
}: {
  idPrefix: string;
  followers: string;
  following: string;
  posts: string;
  onFollowers: (v: string) => void;
  onFollowing: (v: string) => void;
  onPosts: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  submitLabel: string;
  onCancel?: () => void;
}) {
  return (
    <form className="numbers" onSubmit={onSubmit} noValidate>
      <div className="numbers__fields">
        <div className="field numbers__followers">
          <label className="field__label" htmlFor={`${idPrefix}-followers`}>
            <span>Followers <span className="req">required</span></span>
          </label>
          <input
            id={`${idPrefix}-followers`}
            className="input"
            inputMode="decimal"
            placeholder="14,200 or 1.2M"
            value={followers}
            onChange={(e) => onFollowers(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${idPrefix}-error` : `${idPrefix}-hint`}
            required
          />
          <span id={`${idPrefix}-hint`} className="field__hint">Type what the profile shows. 1.2M and 48K both work.</span>
        </div>
        <div className="field">
          <label className="field__label" htmlFor={`${idPrefix}-following`}>Following</label>
          <input id={`${idPrefix}-following`} className="input" inputMode="decimal" placeholder="350" value={following} onChange={(e) => onFollowing(e.target.value)} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor={`${idPrefix}-posts`}>Posts</label>
          <input id={`${idPrefix}-posts`} className="input" inputMode="decimal" placeholder="84" value={posts} onChange={(e) => onPosts(e.target.value)} />
        </div>
      </div>

      <div className="numbers__tiers">
        <span className="label text-2">Not sure? Start from a typical account</span>
        <div className="chips">
          {TIERS.map((t) => (
            <button
              key={t.label}
              type="button"
              className="chip"
              onClick={() => {
                onFollowers(t.followers);
                onFollowing(t.following);
                onPosts(t.posts);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p id={`${idPrefix}-error`} className="field__error" role="alert">
          <Glyph name="warning" size={16} /> {error}
        </p>
      ) : null}

      <div className="numbers__actions">
        <button type="submit" className="btn btn--safe">
          {submitLabel} <Glyph name="arrow-right" size={18} />
        </button>
        {onCancel ? (
          <button type="button" className="btn btn--quiet" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
