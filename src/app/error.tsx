'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph } from '@/components/darkroom/Glyph';

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="nf band band--tray page-grid" aria-labelledby="err-title">
      <Edge frame="500" label="Fogged" />
      <div className="nf__solo">
        <div className="state state--fogged">
          <span className="state__mark"><Glyph name="fogged" size={32} /></span>
          <div className="state__body">
            <h1 id="err-title" className="state__title">Fogged</h1>
            <p>
              Light got into this page and it didn’t develop. Nothing you entered was lost; try again, and if it keeps happening,
              tell us what you were doing.
            </p>
            {error.digest ? <p className="label text-2">Reference {error.digest}</p> : null}
            <div className="nf__actions">
              <button type="button" className="btn btn--safe" onClick={reset}>
                <Glyph name="refresh" size={18} /> Try again
              </button>
              <Link href="/contact" className="btn btn--line">Report it</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
