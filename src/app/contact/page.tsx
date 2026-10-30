'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph, type GlyphName } from '@/components/darkroom/Glyph';
import { Crumbs } from '@/components/library/Crumbs';

type CategoryId = 'general' | 'api' | 'takedown' | 'support';
type Field = 'name' | 'email' | 'message';
type Phase = 'open' | 'sealing' | 'sealed';

const CATEGORIES: { id: CategoryId; label: string; code: string; to: string; hint: string }[] = [
  { id: 'general', label: 'General question', code: 'GN', to: 'support@isshereal.com', hint: 'Anything about a report or how the site works.' },
  { id: 'api', label: 'API and limits', code: 'AP', to: 'enterprise@isshereal.com', hint: 'Higher limits or building on the API.' },
  { id: 'takedown', label: 'Remove a cached report', code: 'RM', to: 'privacy@isshereal.com', hint: 'For profile owners. Include the handle below.' },
  { id: 'support', label: 'Bug or technical fault', code: 'BG', to: 'support@isshereal.com', hint: 'What you did, what you expected, what happened.' },
];

const CHANNELS: { glyph: GlyphName; title: string; address: string; note: string }[] = [
  { glyph: 'mail', title: 'General support', address: 'support@isshereal.com', note: 'Reports, results, bugs.' },
  { glyph: 'code', title: 'API and partnerships', address: 'enterprise@isshereal.com', note: 'Limits and integrations.' },
  { glyph: 'warning', title: 'Security disclosures', address: 'security@isshereal.com', note: 'Vulnerabilities, privately.' },
  { glyph: 'file', title: 'Privacy and legal', address: 'privacy@isshereal.com', note: 'GDPR and CCPA requests.' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_MESSAGE = 20;

function validate(values: Record<Field, string>): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = 'Write a name, so we know what to call you.';
  if (!values.email.trim()) errors.email = 'We need an address to reply to.';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'That address is missing something. Check the part after the @.';
  const len = values.message.trim().length;
  if (len === 0) errors.message = 'The envelope is empty. Tell us what you need.';
  else if (len < MIN_MESSAGE) errors.message = `A little more detail, please: at least ${MIN_MESSAGE} characters (${len} so far).`;
  return errors;
}

function makeReference(): string {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const tail = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
  return `ISR-${ymd}-${tail}`;
}

export default function ContactPage() {
  const [category, setCategory] = useState<CategoryId>('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const [phase, setPhase] = useState<Phase>('open');
  const [reference, setReference] = useState('');
  const [sealedAt, setSealedAt] = useState<Date | null>(null);

  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };
  const receiptRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const values = { name, email, message };
  const chosen = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (phase === 'sealed') receiptRef.current?.focus();
  }, [phase]);

  /** After the first attempt, re-check a field as soon as it changes. */
  const recheck = (field: Field, value: string) => {
    if (!attempted) return;
    const next = validate({ ...values, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    const found = validate(values);
    setErrors(found);
    const first = (['name', 'email', 'message'] as Field[]).find((f) => found[f]);
    if (first) {
      refs[first].current?.focus();
      return;
    }
    // The form has no server endpoint yet: sealing happens in the browser,
    // and the receipt hands the letter to the visitor's mail app.
    setPhase('sealing');
    timer.current = setTimeout(() => {
      setReference(makeReference());
      setSealedAt(new Date());
      setPhase('sealed');
    }, 600);
  };

  const reset = () => {
    setPhase('open');
    setMessage('');
    setErrors({});
    setAttempted(false);
    setReference('');
    requestAnimationFrame(() => refs.message.current?.focus());
  };

  const mailto = (() => {
    const subject = `[${reference}] ${chosen.label}`;
    const lines = [
      `Reference: ${reference}`,
      `Category: ${chosen.label}`,
      `Name: ${name.trim()}`,
      `Reply to: ${email.trim()}`,
      handle.trim() ? `Profile: ${handle.trim()}` : null,
      '',
      message.trim(),
    ].filter((l) => l !== null);
    return `mailto:${chosen.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  })();

  const errorCount = Object.values(errors).filter(Boolean).length;
  const busy = phase === 'sealing';

  return (
    <article className="envelope-page">
      {/* 01 · Address */}
      <section className="band page-grid envelope-head" aria-labelledby="contact-title">
        <Edge frame="01" label="Envelope" />
        <Crumbs trail={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
        <div className="cols envelope-head__grid">
          <div className="head envelope-head__title">
            <p className="head__kicker label">Contact · Prints and letters</p>
            <h1 id="contact-title">
              Write to the <span className="text-safe">darkroom</span>
            </h1>
          </div>
          <p className="head__lede envelope-head__lede">
            Questions about a report, a cached report you want taken down, API limits or a fault you found. Fill in
            the envelope and we’ll read every word. If the answer is in a report, the{' '}
            <Link href="/analyze">tray</Link> is faster.
          </p>
        </div>
      </section>

      {/* 02 · The envelope and the direct channels */}
      <section className="band band--tray page-grid envelope-desk" aria-labelledby="envelope-title">
        <Edge frame="02" label="Seal and post" />
        <div className="cols envelope-desk__grid">
          <div className="envelope" data-state={phase} data-room="light">
            <div className="envelope__flap" aria-hidden="true">
              <span className="envelope__seal">
                <Glyph name="check" size={22} />
              </span>
            </div>
            <div className="envelope__face">
              <div className="envelope__printed" aria-hidden="true">
                <span>Photographic prints</span>
                <span>Do not bend · Do not open in light</span>
              </div>
              <h2 id="envelope-title" className="envelope__title">
                {phase === 'sealed' ? 'Sealed' : 'Contents'}
              </h2>

              {phase !== 'sealed' ? (
                <form className="envelope-form" onSubmit={handleSubmit} noValidate aria-describedby={attempted && errorCount ? 'envelope-errors' : undefined}>
                  {attempted && errorCount > 0 ? (
                    <p id="envelope-errors" className="envelope-form__summary" role="alert">
                      <Glyph name="ghost" size={16} />
                      {errorCount === 1 ? 'One field needs attention.' : `${errorCount} fields need attention.`}
                    </p>
                  ) : null}

                  <fieldset className="envelope-form__kind" disabled={busy}>
                    <legend className="field__label">Kind of letter</legend>
                    <div className="envelope-kinds">
                      {CATEGORIES.map((c) => (
                        <label key={c.id} className="chip envelope-kind">
                          <input
                            type="radio"
                            name="category"
                            value={c.id}
                            checked={category === c.id}
                            onChange={() => setCategory(c.id)}
                            className="sr-only"
                          />
                          <span className="envelope-kind__code">{c.code}</span>
                          {c.label}
                        </label>
                      ))}
                    </div>
                    <p className="field__hint">
                      {chosen.hint} Goes to <span className="envelope-form__to">{chosen.to}</span>.
                    </p>
                  </fieldset>

                  <div className="envelope-form__row">
                    <div className="field">
                      <label className="field__label" htmlFor="c-name">
                        Your name <span className="req">Required</span>
                      </label>
                      <input
                        ref={refs.name}
                        id="c-name"
                        name="name"
                        type="text"
                        className="input"
                        autoComplete="name"
                        placeholder="Alex Morgan"
                        value={name}
                        disabled={busy}
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? 'c-name-error' : undefined}
                        onChange={(e) => {
                          setName(e.target.value);
                          recheck('name', e.target.value);
                        }}
                      />
                      {errors.name ? (
                        <p className="field__error" id="c-name-error">
                          <Glyph name="ghost" size={14} />
                          {errors.name}
                        </p>
                      ) : null}
                    </div>

                    <div className="field">
                      <label className="field__label" htmlFor="c-email">
                        Reply address <span className="req">Required</span>
                      </label>
                      <input
                        ref={refs.email}
                        id="c-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        className="input"
                        autoComplete="email"
                        placeholder="alex@studio.com"
                        value={email}
                        disabled={busy}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? 'c-email-error' : undefined}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          recheck('email', e.target.value);
                        }}
                      />
                      {errors.email ? (
                        <p className="field__error" id="c-email-error">
                          <Glyph name="ghost" size={14} />
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="c-handle">
                      Profile in question <span className="text-2">Optional</span>
                    </label>
                    <input
                      id="c-handle"
                      name="handle"
                      type="text"
                      className="input"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="@username or a profile link"
                      value={handle}
                      disabled={busy}
                      aria-describedby="c-handle-hint"
                      onChange={(e) => setHandle(e.target.value)}
                    />
                    <p className="field__hint" id="c-handle-hint">
                      Needed for removal requests, useful for everything else.
                    </p>
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="c-message">
                      The letter <span className="req">Required</span>
                    </label>
                    <textarea
                      ref={refs.message}
                      id="c-message"
                      name="message"
                      className="textarea envelope-form__letter"
                      rows={6}
                      placeholder="What happened, and what you’d like us to do."
                      value={message}
                      disabled={busy}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? 'c-message-error' : 'c-message-hint'}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        recheck('message', e.target.value);
                      }}
                    />
                    {errors.message ? (
                      <p className="field__error" id="c-message-error">
                        <Glyph name="ghost" size={14} />
                        {errors.message}
                      </p>
                    ) : (
                      <p className="field__hint" id="c-message-hint">
                        At least {MIN_MESSAGE} characters. Links are fine.
                      </p>
                    )}
                  </div>

                  <div className="envelope-form__actions">
                    <button type="submit" className="btn btn--safe" disabled={busy} aria-disabled={busy || undefined}>
                      {busy ? 'Sealing…' : 'Seal the envelope'}
                      {!busy ? <Glyph name="mail" size={16} /> : null}
                    </button>
                    <p className="envelope-form__fine">
                      Sealing happens in your browser. Nothing is sent until you post it from your mail app on the
                      next step.
                    </p>
                  </div>
                </form>
              ) : (
                <dl className="envelope__address">
                  <dt>To</dt>
                  <dd>{chosen.to}</dd>
                  <dt>From</dt>
                  <dd>
                    {name.trim()} · {email.trim()}
                  </dd>
                  <dt>Ref</dt>
                  <dd className="tabular">{reference}</dd>
                </dl>
              )}
            </div>
          </div>

          {phase === 'sealed' ? (
            <section className="envelope-receipt" aria-labelledby="receipt-title" data-room="light">
              <p className="envelope-receipt__code label">Receipt · keep this number</p>
              <h2 id="receipt-title" className="envelope-receipt__ref tabular" ref={receiptRef} tabIndex={-1}>
                {reference}
              </h2>
              <dl className="specs envelope-receipt__specs">
                <dt>Kind</dt>
                <dd>{chosen.label}</dd>
                <dt>Addressed to</dt>
                <dd>{chosen.to}</dd>
                <dt>Sealed</dt>
                <dd>
                  {sealedAt ? (
                    <time dateTime={sealedAt.toISOString()}>
                      {sealedAt.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </time>
                  ) : null}
                </dd>
                {handle.trim() ? (
                  <>
                    <dt>Profile</dt>
                    <dd className="envelope-receipt__mono">{handle.trim()}</dd>
                  </>
                ) : null}
              </dl>
              <div className="state state--notice envelope-receipt__notice">
                <div className="state__mark" aria-hidden="true">
                  <Glyph name="mail" size={24} />
                </div>
                <div className="state__body">
                  <p className="state__title">Sealed, not yet posted</p>
                  <p>
                    This page doesn’t transmit letters, so nothing has left your browser. Post it from your mail app
                    and the reference goes with it; we’ll quote it when we reply.
                  </p>
                  <div className="envelope-receipt__actions">
                    <a href={mailto} className="btn btn--safe">
                      Post it from your mail app
                      <Glyph name="arrow-up-right" size={16} />
                    </a>
                    <button type="button" className="btn btn--line btn--compact" onClick={reset}>
                      Write another
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <aside className="envelope-channels" aria-labelledby="channels-title">
            <h2 id="channels-title" className="envelope-channels__title label">
              Direct addresses
            </h2>
            <ul className="envelope-channels__list">
              {CHANNELS.map((c) => (
                <li key={c.address}>
                  <Glyph name={c.glyph} size={18} />
                  <span>
                    <span className="envelope-channels__name">{c.title}</span>
                    <a href={`mailto:${c.address}`} className="envelope-channels__addr">
                      {c.address}
                    </a>
                    <span className="envelope-channels__note">{c.note}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="envelope-channels__fine">
              Removal requests for cached reports are handled within 48 business hours, as set out in the{' '}
              <Link href="/privacy#pr-05">privacy policy</Link>.
            </p>
          </aside>
        </div>
      </section>
    </article>
  );
}
