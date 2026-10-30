import React from 'react';
import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumb set as a film-edge line. The last crumb is the current page
 * and is never a link.
 */
export function Crumbs({ trail, className }: { trail: Crumb[]; className?: string }) {
  return (
    <nav className={['crumbs', className].filter(Boolean).join(' ')} aria-label="Breadcrumb">
      <ol>
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`}>
              {last || !c.href ? (
                <span aria-current={last ? 'page' : undefined}>{c.label}</span>
              ) : (
                <Link href={c.href}>{c.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
