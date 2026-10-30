import React from 'react';

/**
 * A request or response specimen on a Film Rebate panel, labelled like a
 * figure in a technical publication. Pass `json` to print a value with
 * token colouring, or children for hand-marked text (curl, headers).
 */
export function Specimen({
  code,
  title,
  method,
  json,
  children,
  className,
}: {
  code: string;
  title: string;
  method?: string;
  json?: unknown;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={['specimen', 'manual-specimen', className].filter(Boolean).join(' ')}>
      <figcaption className="specimen__head">
        <span>
          {method ? <span className="method">{method} </span> : null}
          {title}
        </span>
        <span>{code}</span>
      </figcaption>
      <pre tabIndex={0}>
        <code>{json !== undefined ? tokenizeJson(JSON.stringify(json, null, 2)) : children}</code>
      </pre>
    </figure>
  );
}

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)|\b(true|false|null)\b/g;

/** Split pretty-printed JSON into keys, strings, numbers and literals. */
export function tokenizeJson(src: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of src.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(src.slice(last, at));
    if (m[1] && m[2]) {
      out.push(
        <span key={i++} className="tok-key">
          {m[1]}
        </span>,
        m[2],
      );
    } else if (m[1]) {
      out.push(
        <span key={i++} className="tok-str">
          {m[1]}
        </span>,
      );
    } else {
      out.push(
        <span key={i++} className="tok-num">
          {m[3] ?? m[4]}
        </span>,
      );
    }
    last = at + m[0].length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}
