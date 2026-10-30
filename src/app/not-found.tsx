import type { Metadata } from 'next';
import Link from 'next/link';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph } from '@/components/darkroom/Glyph';
import { GreaseCross } from '@/components/darkroom/Grease';

export const metadata: Metadata = {
  title: 'Frame not exposed',
  description: 'Nothing was ever printed at this address.',
};

export default function NotFound() {
  return (
    <section className="nf band band--tray page-grid" aria-labelledby="nf-title">
      <Edge frame="404" label="Frame not exposed" />
      <div className="nf__inner">
        <div className="nf__strip contact" data-room="dark" aria-hidden="true">
          <div className="nf__frames">
            <span className="nf__frame nf__frame--dim"><span className="label">402</span></span>
            <span className="nf__frame nf__frame--dim"><span className="label">403</span></span>
            <span className="nf__frame nf__frame--blank">
              <GreaseCross />
              <span className="label">404</span>
            </span>
            <span className="nf__frame nf__frame--dim"><span className="label">405</span></span>
          </div>
        </div>
        <div className="nf__copy">
          <p className="label text-safe">Error 404</p>
          <h1 id="nf-title" className="display-l">Frame not <span className="ghost">exposed.</span></h1>
          <p className="lede">Nothing was ever printed at this address. The link may be old, or a letter may have slipped.</p>
          <div className="nf__actions">
            <Link href="/analyze" className="btn btn--safe">Develop a profile <Glyph name="arrow-right" size={18} /></Link>
            <Link href="/" className="btn btn--line">Back to the darkroom</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
