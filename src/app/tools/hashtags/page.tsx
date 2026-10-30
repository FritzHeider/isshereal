'use client';

import React, { useState } from 'react';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph, type GlyphName } from '@/components/darkroom/Glyph';
import { GreaseNote } from '@/components/darkroom/Grease';
import { Reading } from '@/components/darkroom/Reading';
import { ToolOpening } from '@/components/tools/ToolOpening';
import {
  INSTAGRAM_TAG_LIMIT,
  readSleeve,
  type SleeveReading,
  type TagClass,
  type TagReading,
} from '@/components/tools/hashtag-reader';

const CLASS_WORD: Record<TagClass, string> = {
  ghost: 'Ghost',
  broken: 'Won’t link',
  saturated: 'Saturated',
  specific: 'Developed',
};

const CLASS_GLYPH: Record<TagClass, GlyphName> = {
  ghost: 'ghost',
  broken: 'warning',
  saturated: 'minus',
  specific: 'developed',
};

const pad = (n: number) => String(n).padStart(2, '0');

export default function HashtagPage() {
  const [tags, setTags] = useState('#fitness #lifestyle #followforfollow #explorepage #instadaily');
  const [reading, setReading] = useState<SleeveReading | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const r = readSleeve(tags);
    if (r.total === 0) {
      setReading(null);
      setError('No hashtags found. Separate them with spaces or commas; the # is optional.');
      document.getElementById('sleeve-tags')?.focus();
      return;
    }
    setError('');
    setReading(r);
  };

  const over = reading ? reading.total - INSTAGRAM_TAG_LIMIT : 0;

  return (
    <>
      <ToolOpening
        id="sleeve-title"
        frame="H0"
        tool="Negative sleeve"
        glyph="sleeve"
        variant="sleeve"
        title={
          <>
            File the <span className="safe">tags</span>
          </>
        }
        lede={
          <>
            Each hashtag goes into the sleeve as its own strip, with its readings printed along the edge.
            Tags that trade follows for follows come up as <em>ghosts</em>.
          </>
        }
        specs={[
          ['Takes', 'Up to a caption’s worth of hashtags'],
          ['Reads', 'Spam patterns, breadth, linking'],
          ['Does not read', 'Live reach or restrictions'],
        ]}
      />

      <section className="band band--contact sleeve-bench page-grid" aria-labelledby="sleeve-bench-title">
        <Edge frame="H1" label="Loading the sleeve" />
        <div className="sleeve-bench__inner cols">
          <form className="sleeve-form" onSubmit={handleAnalyze} noValidate>
            <h2 id="sleeve-bench-title" className="sleeve-form__title">
              Tags to file
            </h2>
            <div className="field">
              <label className="field__label" htmlFor="sleeve-tags">
                <span>Hashtags, space or comma separated</span>
              </label>
              <textarea
                id="sleeve-tags"
                className="textarea sleeve-form__text"
                rows={5}
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                  if (error) setError('');
                }}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                required
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? 'sleeve-tags-error' : 'sleeve-tags-hint'}
              />
              {error ? (
                <p id="sleeve-tags-error" className="field__error">
                  <Glyph name="warning" size={16} />
                  {error}
                </p>
              ) : (
                <p id="sleeve-tags-hint" className="field__hint">
                  Paste a caption’s tag block as it is. Repeats are filed once.
                </p>
              )}
            </div>
            <button type="submit" className="btn btn--safe">
              <Glyph name="sleeve" size={18} />
              File in the sleeve
            </button>
          </form>

          <div className="sleeve-tally" aria-live="polite">
            {reading ? (
              <>
                <div className="sleeve-tally__readings">
                  <Reading value={reading.total} unit="" label="Filed" size="m" />
                  <Reading value={reading.counts.specific} unit="" label="Developed" tone="developed" size="m" />
                  <Reading value={reading.counts.ghost} unit="" label="Ghost" tone="ghost" size="m" />
                  <Reading value={reading.counts.saturated + reading.counts.broken} unit="" label="Weak" size="m" note="Saturated or won’t link" />
                </div>
                {over > 0 ? (
                  <p className="sleeve-tally__notice">
                    <Glyph name="warning" size={16} />
                    {reading.total} tags. Instagram stops at {INSTAGRAM_TAG_LIMIT} per post, so the caption won’t
                    post until {over} {over === 1 ? 'is' : 'are'} removed.
                  </p>
                ) : null}
                {reading.duplicates.length > 0 ? (
                  <p className="sleeve-tally__dupes">
                    <span className="label">Filed once</span> {reading.duplicates.join(' ')}
                  </p>
                ) : null}
              </>
            ) : (
              <div className="sleeve-tally__idle">
                <p className="label">Tally</p>
                <p>
                  Counts appear here once the strips are filed: how many developed, how many stayed ghost, and how
                  many are too broad to help.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="band band--tray sleeve-band page-grid" aria-labelledby="sleeve-box-title">
        <Edge frame="H2" label={reading ? `${pad(reading.total)} strips` : 'Empty sleeve'} />
        <div className="sleeve-band__inner">
          <h2 id="sleeve-box-title" className="sleeve-band__title">
            The <span className="safe">sleeve</span>
          </h2>
          <div className="sleeve" data-room="dark">
            <p className="sleeve__label label" aria-hidden="true">
              <span>Archival sleeve · polypropylene</span>
              <span>ISSHEREAL 5063</span>
            </p>
            {reading ? (
              <ol className="sleeve__pockets" role="list">
                {reading.tags.map((t) => (
                  <Strip key={t.tag} t={t} />
                ))}
              </ol>
            ) : (
              <div className="sleeve__empty">
                <ol className="sleeve__pockets sleeve__pockets--blank" role="list" aria-hidden="true">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className="sleeve-strip sleeve-strip--blank">
                      <span className="sleeve-strip__n label">{pad(n)}</span>
                    </li>
                  ))}
                </ol>
                <div className="state">
                  <span className="state__mark">
                    <Glyph name="sleeve" size={28} />
                  </span>
                  <div className="state__body">
                    <p className="state__title">The sleeve is empty</p>
                    <p>File the tags above. Each one takes a pocket, in the order it appears in the caption.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="band band--rule sleeve-notes page-grid" aria-labelledby="sleeve-notes-title">
        <Edge frame="H3" label="How a strip is read" />
        <div className="sleeve-notes__inner cols">
          <h2 id="sleeve-notes-title" className="sleeve-notes__title">
            How a strip <span className="safe">is read</span>
          </h2>
          <dl className="sleeve-notes__rules">
            <div>
              <dt>
                <Glyph name="ghost" size={18} className="text-cyan" />
                Ghost
              </dt>
              <dd>
                The tag matches a known engagement-bait tag or the x-for-x pattern behind them, like
                #like4like. These attract accounts that follow back and never look again.
              </dd>
            </div>
            <div>
              <dt>
                <Glyph name="warning" size={18} />
                Won’t link
              </dt>
              <dd>
                A hashtag stops at the first hyphen, apostrophe or other punctuation. #self-care links #self.
              </dd>
            </div>
            <div>
              <dt>
                <Glyph name="minus" size={18} />
                Saturated
              </dt>
              <dd>The tag is on a fixed list of the broadest tags in use, where a new post is buried within minutes.</dd>
            </div>
            <div>
              <dt>
                <Glyph name="developed" size={18} className="text-amber" />
                Developed
              </dt>
              <dd>None of the above. Specific tags are the ones people actually search.</dd>
            </div>
          </dl>
          <p className="sleeve-notes__caveat">
            The sleeve reads the text of each tag and nothing else. It does not ask any platform, so it cannot see
            how far a tag reaches today or whether one has been restricted. Reach is printed as “not measured” for
            that reason.
          </p>
        </div>
      </section>
    </>
  );
}

function Strip({ t }: { t: TagReading }) {
  const word = CLASS_WORD[t.cls];
  return (
    <li className="sleeve-strip" data-class={t.cls}>
      <span className="sleeve-strip__n label" aria-hidden="true">
        {pad(t.n)}
        {t.cls === 'ghost' ? 'G' : 'A'}
      </span>
      <p className="sleeve-strip__tag">
        <span className="sr-only">Tag {t.n}: </span>
        <span className="sleeve-strip__hash" aria-hidden="true">#</span>
        {t.cls === 'broken' && t.links ? (
          <>
            <span>{t.links}</span>
            <span className="sleeve-strip__dead">{t.tag.slice(t.links.length)}</span>
          </>
        ) : (
          t.tag
        )}
        {t.cls === 'ghost' ? (
          <GreaseNote tone="cyan" tilt={-6} className="sleeve-strip__mark">
            Ghost
          </GreaseNote>
        ) : null}
      </p>
      <dl className="sleeve-strip__edge">
        <div>
          <dt>Class</dt>
          <dd className="sleeve-strip__class">
            <Glyph name={CLASS_GLYPH[t.cls]} size={14} />
            {word}
          </dd>
        </div>
        <div>
          <dt>Spam</dt>
          <dd className="tabular">{t.spamSignals.length ? `${t.spamSignals.length} signal${t.spamSignals.length > 1 ? 's' : ''}` : 'none'}</dd>
        </div>
        <div>
          <dt>Breadth</dt>
          <dd>{t.saturated ? 'broad list' : 'not listed'}</dd>
        </div>
        <div>
          <dt>Length</dt>
          <dd className="tabular">{t.length} ch</dd>
        </div>
        <div>
          <dt>Reach</dt>
          <dd>not measured</dd>
        </div>
      </dl>
      <p className="sleeve-strip__note">
        {t.note}
        {t.spamSignals.length ? <span className="sleeve-strip__signals"> Signals: {t.spamSignals.join('; ')}.</span> : null}
      </p>
    </li>
  );
}
