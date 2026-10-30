import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HomePageJsonLd } from '@/components/JsonLd';
import { HomeHero } from '@/components/home/HomeHero';
import { DryingLine } from '@/components/home/DryingLine';
import { Enlarger } from '@/components/home/Enlarger';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph, platformCode, type GlyphName } from '@/components/darkroom/Glyph';
import { GreaseNote } from '@/components/darkroom/Grease';
import { FAQS, SAMPLE_REPORTS } from '@/data/content';

const PROCESS = [
  {
    step: 'Develop',
    time: '0:00–0:03',
    measure: 'Public numbers',
    text: 'We read what the profile shows anyone: followers, following, posts, and engagement where the platform shares it. No logins.',
  },
  {
    step: 'Stop',
    time: '0:03',
    measure: 'Audience tier',
    text: 'The audience is placed in its size tier, because 2% engagement is healthy at a million followers and thin at ten thousand.',
  },
  {
    step: 'Fix',
    time: '0:03–0:04',
    measure: 'Ratios and spikes',
    text: 'Follow ratios, posting history and engagement are checked against that tier’s normal range. Bursts and mismatches are flagged.',
  },
  {
    step: 'Examine',
    time: '0:04',
    measure: 'Developed and ghost',
    text: 'The result is a print: the share of the audience that came through as genuine, the share that stayed a ghost, and why.',
  },
];

const EQUIPMENT: { glyph: GlyphName; name: string; measures: string; href: string; code: string }[] = [
  { glyph: 'contact', code: 'EQ-01', name: 'Contact sheet', measures: 'Paste a list of handles. Each develops in turn on one sheet, ready to export as CSV.', href: '/tools/bulk' },
  { glyph: 'lightbox', code: 'EQ-02', name: 'Light box', measures: 'Two profiles side by side, with the difference marked between them.', href: '/tools/compare' },
  { glyph: 'teststrip', code: 'EQ-03', name: 'Test strip', measures: 'Engagement rate against the normal bands for that platform and audience size.', href: '/tools/engagement-rate' },
  { glyph: 'sleeve', code: 'EQ-04', name: 'Negative sleeve', measures: 'A set of hashtags, each read for reach, saturation and spam.', href: '/tools/hashtags' },
];

/** Proof wall: example prints of mixed sizes. Fictional profiles with real arithmetic. */
const WALL_IDS = ['fittitan', 'cryptogainz', 'maya', 'quickdeals', 'mrbeast', 'pixelpro', 'alex'];

export default function Home() {
  const wall = WALL_IDS.map((id) => SAMPLE_REPORTS.find((r) => r.id === id)!).filter(Boolean);

  return (
    <>
      <HomePageJsonLd />
      <HomeHero />

      {/* 03 · How a print comes up */}
      <section className="process band band--rule page-grid" aria-labelledby="process-title">
        <Edge frame="03" label="Processing chart" />
        <div className="process__inner cols">
          <div className="process__head head">
            <p className="head__kicker label">Processing chart · four steps, about four seconds</p>
            <h2 id="process-title" className="head__title">How a print <span className="safe">comes up</span></h2>
          </div>
          <div className="process__sheet sheet">
            <div className="sheet__head">
              <span className="sheet__code">Publication DR-1 · Examination process</span>
              <span className="label text-2">Times are typical, not promised</span>
            </div>
            <div className="table-wrap">
              <table className="datatable process__table">
                <caption className="sr-only">The four steps of an examination, with timing and what each step measures</caption>
                <thead>
                  <tr>
                    <th scope="col">Step</th>
                    <th scope="col" className="num">Time</th>
                    <th scope="col">Measures</th>
                    <th scope="col">What happens</th>
                  </tr>
                </thead>
                <tbody>
                  {PROCESS.map((p, i) => (
                    <tr key={p.step}>
                      <th scope="row">
                        <span className="process__no label text-safe">{String(i + 1).padStart(2, '0')}</span>
                        <span className="process__step">{p.step}</span>
                      </th>
                      <td className="num">{p.time}</td>
                      <td className="process__measure">{p.measure}</td>
                      <td>{p.text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 04 · The enlarger */}
      <section className="enlarger band band--tray page-grid" aria-labelledby="enlarger-title" data-room="dark">
        <Edge frame="04" label="Enlargement ×40" />
        <div className="enlarger__head">
          <h2 id="enlarger-title" className="enlarger__title display-l">
            Enlarge <span className="ghost">any gap.</span>
          </h2>
          <p className="enlarger__lede">
            Every pale patch in a print has a cause. Blow it up and you see what kind of accounts sit there: made in the same
            week, never posted, following thousands. <span className="enlarger__note-ill">Illustration, fictional accounts.</span>
          </p>
        </div>
        <div className="enlarger__stage bleed">
          <Enlarger />
        </div>
      </section>

      {/* 05 · Equipment */}
      <section id="equipment" className="equipment band band--contact page-grid" aria-labelledby="equipment-title">
        <Edge frame="05" label="Darkroom equipment" />
        <div className="equipment__inner">
          <h2 id="equipment-title" className="equipment__title display-m">Equipment</h2>
          <ol className="equipment__row" role="list">
            {EQUIPMENT.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="equipment__item">
                  <span className="equipment__code label">{e.code}</span>
                  <Glyph name={e.glyph} size={36} strokeWidth={1.25} />
                  <span className="equipment__name">{e.name}</span>
                  <span className="equipment__measures">{e.measures}</span>
                  <span className="equipment__go label">Open <Glyph name="arrow-right" size={14} /></span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 06 · Who uses the darkroom */}
      <section id="cases" className="cases band band--tray page-grid" aria-labelledby="cases-title">
        <Edge frame="06" label="Case files" />
        <div className="cases__head head">
          <p className="head__kicker label">Four reasons people check</p>
          <h2 id="cases-title" className="head__title">Who uses <span className="safe">the darkroom</span></h2>
        </div>
        <div className="cases__line">
          <DryingLine />
        </div>
      </section>

      {/* 07 · Proof wall */}
      <section className="wall band band--rule page-grid" aria-labelledby="wall-title">
        <Edge frame="07" label="Proof wall" />
        <div className="wall__inner">
          <div className="wall__head">
            <h2 id="wall-title" className="display-m">Proof wall</h2>
            <p className="text-2">
              Example examinations, pinned up wet. The profiles are fictional; the arithmetic is the same one your print gets.
            </p>
            <Link href="/top-creators" className="btn btn--line btn--compact">
              See the full register <Glyph name="arrow-right" size={16} />
            </Link>
          </div>
          <ul className="wall__prints" role="list">
            {wall.map((r, i) => {
              const ghost = r.fakePct;
              return (
                <li key={r.id} className={`wall__item wall__item--${i}`}>
                  <Link href={`/report/${r.id}`} className="wall__link">
                    <figure className="print print--s wall__print" style={{ '--tilt': `${[-2, 1.5, -1, 2.5, -2.5, 1, -1.5][i]}deg` } as React.CSSProperties}>
                      <div className="print__emulsion">
                        <Image src={r.avatarImage} alt="" width={512} height={512} sizes="(max-width: 48rem) 45vw, 22vw" loading="lazy" className="print__img" />
                      </div>
                      <figcaption className="print__border">
                        <span className="print__frame">{String(30 + i)} ▸ {platformCode(r.platform)}</span>
                        <GreaseNote tone={ghost > 50 ? 'cyan' : 'amber'} tilt={-3}>{ghost}% ghost</GreaseNote>
                      </figcaption>
                    </figure>
                    <span className="wall__caption">
                      <span className="wall__handle">{r.handle}</span>
                      <span className="text-2">{r.verdict}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 08 · Questions */}
      <section className="faq band band--tray-surface page-grid" aria-labelledby="faq-title">
        <Edge frame="08" label="Technical questions" />
        <div className="faq__inner cols">
          <div className="faq__head head">
            <p className="head__kicker label">Publication DR-2</p>
            <h2 id="faq-title" className="head__title">Questions</h2>
            <p className="text-2">Asked often enough to print.</p>
          </div>
          <ol className="faq__list" role="list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="faq__item">
                <span className="faq__no label text-safe">Q{String(i + 1).padStart(2, '0')}</span>
                <h3 className="faq__q">{f.q}</h3>
                <p className="faq__a">{f.a}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
