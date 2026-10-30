'use client';

import React, { useState } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react';
import { DUR, EASE } from '@/lib/motion-tokens';
import Link from 'next/link';
import { SAMPLE_REPORTS } from '@/data/content';
import { Print } from '@/components/darkroom/Print';
import { GreaseNote } from '@/components/darkroom/Grease';
import { Glyph } from '@/components/darkroom/Glyph';

const CASES = [
  {
    id: 'dating',
    code: 'DT',
    title: 'Dating safety',
    question: 'Is the person you’re meeting on Friday real?',
    body: 'Check a match before you share your number, your address or your evening. We look for the patterns romance scams leave: brand-new profiles, catalogue photos, a hurry to move off the app.',
    href: '/use-cases/dating-safety',
    sample: 'alex',
    tilt: -3,
  },
  {
    id: 'marketplace',
    code: 'MK',
    title: 'Marketplace buyers',
    question: 'Will the seller still be there after you pay?',
    body: 'A three-day-old shop with twenty luxury listings and a request for Zelle is a print that never develops. Check before you send money.',
    href: '/use-cases/marketplace-buyers',
    sample: 'quickdeals',
    tilt: 2,
  },
  {
    id: 'freelance',
    code: 'FL',
    title: 'Hiring freelancers',
    question: 'Are those five-star reviews from real clients?',
    body: 'Twelve reviews in one afternoon is a cluster, not a reputation. See how a freelancer’s history actually came in before you hand over the deposit.',
    href: '/use-cases/hiring-freelancers',
    sample: 'pixelpro',
    tilt: -1.5,
  },
  {
    id: 'influencer',
    code: 'IV',
    title: 'Influencer vetting',
    question: 'How much of that audience will see your product?',
    body: 'Brands pay for reach. We show how much of a creator’s audience develops as real people, and how much stays a ghost, before the contract.',
    href: '/use-cases/influencer-vetting',
    sample: 'lucamodels',
    tilt: 3.5,
  },
] as const;

export function DryingLine() {
  const [active, setActive] = useState(0);
  const current = CASES[active];

  return (
    <div className="line">
      <div className="line__wire" aria-hidden="true" />
      <div className="line__prints" role="tablist" aria-label="Who uses the darkroom">
        {CASES.map((c, i) => {
          const r = SAMPLE_REPORTS.find((s) => s.id === c.sample)!;
          return (
            <button
              key={c.id}
              id={`case-tab-${c.id}`}
              type="button"
              role="tab"
              className="line__peg"
              aria-selected={active === i}
              aria-controls="case-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  e.preventDefault();
                  const next = (i + (e.key === 'ArrowRight' ? 1 : CASES.length - 1)) % CASES.length;
                  setActive(next);
                  document.getElementById(`case-tab-${CASES[next].id}`)?.focus();
                }
              }}
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className="line__clip" aria-hidden="true" />
              <Print
                src={r.avatarImage}
                alt=""
                width={512}
                height={512}
                sizes="(max-width: 48rem) 42vw, 16rem"
                tilt={c.tilt}
                size="s"
                frame={c.code}
                caption={<GreaseNote tilt={-3}>{c.title}</GreaseNote>}
              />
            </button>
          );
        })}
      </div>

      <div id="case-panel" className="line__panel" role="tabpanel" aria-labelledby={`case-tab-${current.id}`}>
        <MotionConfig reducedMotion="user">
          <LazyMotion features={domAnimation} strict>
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={current.id}
                className="line__panel-body"
                initial={{ opacity: 0, y: 12, clipPath: 'inset(0 0 100% 0)' }}
                animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', transition: { duration: DUR.enter, ease: EASE.enter } }}
                exit={{ opacity: 0, y: -8, transition: { duration: DUR.fast, ease: EASE.exit } }}
              >
                <p className="label text-safe">Case {current.code}</p>
                <h3 className="line__question">{current.question}</h3>
                <p className="line__body">{current.body}</p>
                <Link href={current.href} className="btn btn--line">
                  Open the {current.title.toLowerCase()} case file <Glyph name="arrow-right" size={18} />
                </Link>
              </m.div>
            </AnimatePresence>
          </LazyMotion>
        </MotionConfig>
      </div>
    </div>
  );
}
