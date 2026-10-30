'use client';

import React, { useEffect, useState } from 'react';
import { Glyph } from '@/components/darkroom/Glyph';

/**
 * The examiner's note: a typed memo written from the report's own numbers.
 * Where the browser ships an on-device summarizer, the visitor can ask for
 * a one-line summary; nothing is sent anywhere.
 */
export function ExaminerNote({
  frame,
  handle,
  name,
  score,
  realPct,
  fakePct,
  followersLabel,
  riskSignals,
  verifiedSignals,
  examinedAt,
}: {
  frame: string;
  handle: string;
  name: string;
  score: number;
  realPct: number;
  fakePct: number;
  followersLabel: string;
  riskSignals: string[];
  verifiedSignals: string[];
  examinedAt: string;
}) {
  const [supported, setSupported] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSupported('ai' in globalThis && 'summarizer' in ((globalThis as any).ai || {}));
  }, []);

  const lead =
    score >= 75
      ? `Most of ${name}’s audience came through. ${realPct}% of the audience developed as genuine accounts; ${fakePct}% stayed as ghosts, which is ordinary for an account of this size.`
      : score >= 50
        ? `${name}’s print came up partly. ${realPct}% of the audience developed as genuine; ${fakePct}% stayed as ghosts. That is enough to look closer before relying on the numbers.`
        : `Most of ${name}’s audience never came up. Only ${realPct}% developed as genuine accounts; ${fakePct}% stayed as ghosts. The declared ${followersLabel} should not be taken at face value.`;

  const summarize = async () => {
    setBusy(true);
    try {
      const ai = (globalThis as any).ai;
      const s = await ai.summarizer.create({ type: 'tl;dr', length: 'short' });
      const text = [lead, ...riskSignals, ...verifiedSignals].join(' ');
      setSummary(await s.summarize(text));
    } catch {
      setSummary('The on-device summarizer didn’t respond. The note above says the same thing at more length.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="memo examiner" aria-labelledby="memo-title">
      <dl className="memo__head">
        <dt>Memo</dt>
        <dd id="memo-title">Examiner’s note · frame {frame}</dd>
        <dt>Subject</dt>
        <dd>{handle}</dd>
        <dt>Examined</dt>
        <dd><time dateTime={examinedAt}>{new Date(examinedAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></dd>
      </dl>
      <div className="memo__body">
        <p>{lead}</p>
        {riskSignals.length > 0 && (
          <p>
            What stayed a ghost: {riskSignals.map((s) => s.replace(/\.$/, '')).join('; ')}.
          </p>
        )}
        {verifiedSignals.length > 0 && (
          <p>
            What came through: {verifiedSignals.map((s) => s.replace(/\.$/, '')).join('; ')}.
          </p>
        )}
        <p>
          This print shows an audience, not a person. Ghosts can be bots, bought followers, or real people who simply went quiet.
        </p>
        {summary ? <p className="examiner__summary"><strong>Summary:</strong> {summary}</p> : null}
      </div>
      <div className="examiner__foot">
        <p className="memo__sign">Signed · isshereal darkroom</p>
        {supported && !summary ? (
          <button type="button" className="btn btn--line btn--compact examiner__ai" onClick={summarize} disabled={busy}>
            <Glyph name="file" size={16} />
            {busy ? 'Summarizing on this device' : 'Summarize on this device'}
          </button>
        ) : null}
      </div>
    </article>
  );
}
