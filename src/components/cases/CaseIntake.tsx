'use client';

import React, { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Glyph, type GlyphName } from '@/components/darkroom/Glyph';

/**
 * The case-file intake: a film-label field that hands a handle to the
 * analyzer at /analyze?handle=<value>. Same routing as the old pages:
 * trims, drops one leading "@", URL-encodes, pushes.
 */
export function CaseIntake({
  code,
  glyph,
  label,
  placeholder,
  hint,
}: {
  code: string;
  glyph: GlyphName;
  label: string;
  placeholder: string;
  hint: React.ReactNode;
}) {
  const router = useRouter();
  const id = useId();
  const inputId = `${id}-handle`;
  const hintId = `${id}-hint`;
  const statusId = `${id}-status`;
  const [handle, setHandle] = useState('');
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const clean = handle.trim().replace(/^@/, '').trim();
    if (!clean) {
      setError(true);
      return;
    }
    setError(false);
    setSending(true);
    router.push(`/analyze?handle=${encodeURIComponent(clean)}`);
  }

  return (
    <div className="case-intake__form">
      <form className="filmfield" onSubmit={onSubmit} noValidate>
        <div className="filmfield__code" aria-hidden="true">
          <Glyph name={glyph} size={20} />
          <span>{code}</span>
        </div>
        <div className="filmfield__body">
          <label className="filmfield__label" htmlFor={inputId}>
            {label}
          </label>
          <input
            id={inputId}
            className="filmfield__input"
            type="text"
            name="handle"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={placeholder}
            value={handle}
            onChange={(e) => {
              setHandle(e.target.value);
              if (error) setError(false);
            }}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${statusId} ${hintId}` : hintId}
          />
        </div>
        <button type="submit" className="btn btn--safe" disabled={sending}>
          {sending ? 'Loading the tray' : 'Develop'}
          <Glyph name="arrow-right" size={18} />
        </button>
        <p id={statusId} className="filmfield__status" data-tone="error" role="alert" hidden={!error}>
          Nothing in the tray yet. Paste a handle or link to start.
        </p>
      </form>
      <p id={hintId} className="case-intake__hint">
        {hint}
      </p>
    </div>
  );
}
