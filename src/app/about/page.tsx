import type { Metadata } from 'next';
import Link from 'next/link';
import { Edge } from '@/components/darkroom/Edge';
import { Print } from '@/components/darkroom/Print';
import { GreaseNote } from '@/components/darkroom/Grease';
import { Glyph } from '@/components/darkroom/Glyph';
import { Crumbs } from '@/components/library/Crumbs';

const DESCRIPTION =
  'Why isshereal exists, how a print comes up from public numbers, and an exact account of what a score can and cannot show.';

export const metadata: Metadata = {
  title: 'About: a darkroom for the social internet',
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About: a darkroom for the social internet · isshereal.com',
    description: DESCRIPTION,
    url: 'https://isshereal.com/about',
    type: 'article',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'A print developing under safelight.' }],
  },
};

const TIERS: [string, string][] = [
  ['Over 10,000,000', '1.0%'],
  ['1,000,001 to 10,000,000', '1.4%'],
  ['100,001 to 1,000,000', '2.0%'],
  ['10,001 to 100,000', '3.2%'],
  ['10,000 or fewer', '2.5%'],
];

export default function AboutPage() {
  return (
    <article className="about">
      {/* 01 · Masthead */}
      <section className="band band--tray page-grid about-mast" aria-labelledby="about-title">
        <Edge frame="01" label="About" />
        <Crumbs trail={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
        <div className="cols about-mast__grid">
          <p className="head__kicker label about-mast__kicker">About isshereal · A note from the darkroom</p>
          <h1 id="about-title" className="about-mast__title">
            A darkroom for the <span className="text-safe">social internet</span>
          </h1>
          <p className="lede about-mast__lede">
            Follower counts are cheap to buy and easy to believe. We take a public profile, put its numbers in the
            tray, and show you how much of the audience <em>comes through</em>.
          </p>
        </div>
      </section>

      {/* 02 · The essay, with the one large print */}
      <section className="band page-grid about-essay" aria-labelledby="about-why">
        <Edge frame="02" label="Why it exists" />
        <div className="cols about-essay__grid">
          <div className="prose about-essay__text">
            <h2 id="about-why" className="display-s">Why it exists</h2>
            <p>
              People decide whom to trust by looking at a number. A seller with forty thousand followers seems
              safer than one with forty. A freelancer with a big audience seems established. A match with a busy
              profile seems like a real person. The number does a lot of work, and it can be bought for a few
              dollars per thousand.
            </p>
            <p>
              isshereal reads the parts of a profile anyone can see: followers, accounts followed, posts, and, when
              you have them, likes and comments. It compares those numbers with what genuine accounts of the same
              size usually look like. Where they agree, the print develops. Where they don’t, it stays pale.
            </p>
            <p>
              We never ask you to log in, connect an account or type a password, and we never touch private
              messages. Every examination works from what a stranger’s browser could already see.
            </p>
          </div>

          <div className="about-essay__print">
            <Print
              src="/images/avatars/luca.jpg"
              alt="A young man in an olive jacket, lit hard from behind on a residential street."
              width={512}
              height={512}
              size="l"
              tilt={-2}
              sizes="(max-width: 56rem) 92vw, 40vw"
              frame="Example · @lucamodels"
              caption={<GreaseNote tilt={-6}>Mostly ghost</GreaseNote>}
            />
            <p className="about-essay__caption">
              <span className="label text-2">Plate 1</span> A fictional example profile from our sample reports.
              Score <span className="tabular">31</span>; developed <span className="tabular text-amber">33%</span>,
              ghost <span className="tabular text-cyan">67%</span>. The person in a picture like this may be real
              even when most of the audience is not.
            </p>
          </div>
        </div>
      </section>

      {/* Pull quote breaking across the grid */}
      <section className="band band--flush page-grid about-pull-band" aria-label="Pull quote">
        <blockquote className="pull about-pull about-pull--1">
          <p>
            A score is evidence about an audience, <span className="safe">not a verdict on a person.</span>
          </p>
        </blockquote>
      </section>

      {/* 03 · How a print comes up */}
      <section className="band page-grid about-process" aria-labelledby="about-how">
        <Edge frame="03" label="How a print comes up" />
        <div className="cols about-process__grid">
          <div className="prose about-process__text">
            <h2 id="about-how" className="display-s">Where the numbers come from</h2>
            <p>A report starts from one of three places, and the report says which.</p>
          </div>
          <ol className="about-sources" role="list">
            <li>
              <span className="about-sources__code">A</span>
              <div>
                <h3 className="about-sources__title">Profiles on file</h3>
                <p>
                  A register of public accounts whose counts we recorded when they were filed. Their notes were
                  written at the same time. These reports load instantly and are not recalculated live, so they can lag the
                  real profile.
                </p>
              </div>
            </li>
            <li>
              <span className="about-sources__code">B</span>
              <div>
                <h3 className="about-sources__title">A live read</h3>
                <p>
                  For Instagram, YouTube and TikTok we try to read the public profile as it is now. Platforms often
                  refuse automated reads. When that happens we say so and ask you for the numbers. We never fill the
                  gap with a guess.
                </p>
              </div>
            </li>
            <li>
              <span className="about-sources__code">C</span>
              <div>
                <h3 className="about-sources__title">Numbers you give us</h3>
                <p>
                  You can type in the counts you see on the profile, including likes and comments on recent posts.
                  The score is then computed from exactly those figures.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 04 · What a score can and cannot show */}
      <section id="what-a-score-shows" className="band band--rebate page-grid about-limits" aria-labelledby="about-limits-title">
        <Edge frame="04" label="Limits of the print" />
        <div className="cols about-limits__grid">
          <div className="head about-limits__head">
            <p className="head__kicker label">The honest part</p>
            <h2 id="about-limits-title" className="head__title">
              What a score can <span className="amber">show</span>, and what it <span className="ghost">can’t</span>
            </h2>
            <p className="head__lede">
              The score is a heuristic over public numbers. It is not a model trained on labelled fakes, and it does
              not inspect individual followers. Here is the whole method.
            </p>
          </div>

          <div className="about-ledger about-ledger--can">
            <h3 className="about-ledger__title">
              <Glyph name="developed" size={18} /> It can show
            </h3>
            <ul className="signals signals--developed">
              <li>
                <Glyph name="developed" size={16} />
                <span>Whether an account follows far more people than follow it back, a common sign of follow-for-follow scripts.</span>
              </li>
              <li>
                <Glyph name="developed" size={16} />
                <span>A large audience on an account with almost no posts, which is how bought or recycled accounts often look.</span>
              </li>
              <li>
                <Glyph name="developed" size={16} />
                <span>Engagement far below, or suspiciously far above, what genuine accounts of the same size usually get, when likes are known.</span>
              </li>
              <li>
                <Glyph name="developed" size={16} />
                <span>A steady posting history, which genuine creators tend to have.</span>
              </li>
            </ul>
          </div>

          <div className="about-ledger about-ledger--cannot">
            <h3 className="about-ledger__title">
              <Glyph name="ghost" size={18} /> It can’t show
            </h3>
            <ul className="signals signals--ghost">
              <li>
                <Glyph name="ghost" size={16} />
                <span>Whether the person behind the account is who they say they are. A real person can have a bought audience, and a fake persona can have a clean one.</span>
              </li>
              <li>
                <Glyph name="ghost" size={16} />
                <span>Which particular followers are fake. The ghost share is derived from the score; it is not a head count.</span>
              </li>
              <li>
                <Glyph name="ghost" size={16} />
                <span>Intent. Ghosts can be bots, bought followers, or accounts that simply went quiet.</span>
              </li>
              <li>
                <Glyph name="ghost" size={16} />
                <span>Anything private: messages, close-friends stories, payment history, or what happens off the platform.</span>
              </li>
            </ul>
          </div>

          <div className="sheet about-method">
            <div className="sheet__head">
              <h3 className="sheet__title">The method, step by step</h3>
              <span className="sheet__code">Computed reports · sources B and C</span>
            </div>
            <ol className="about-method__steps">
              <li>
                <span className="about-method__no">01</span>
                <p>Every profile starts at <strong className="tabular">72</strong>.</p>
              </li>
              <li>
                <span className="about-method__no">02</span>
                <p>
                  <strong>Follower to following ratio.</strong> More than 50,000 followers while following more than
                  5,000: <span className="tabular text-cyan">−24</span>. Otherwise, followers under a fifth of
                  following, with more than 500 followed: <span className="tabular text-cyan">−30</span>. Otherwise,
                  more than ten followers per account followed, with under 1,000 followed:{' '}
                  <span className="tabular text-amber">+12</span>.
                </p>
              </li>
              <li>
                <span className="about-method__no">03</span>
                <p>
                  <strong>Post volume.</strong> Fewer than six posts with more than 20,000 followers:{' '}
                  <span className="tabular text-cyan">−28</span>. More than 60 posts:{' '}
                  <span className="tabular text-amber">+8</span>.
                </p>
              </li>
              <li>
                <span className="about-method__no">04</span>
                <div>
                  <p>
                    <strong>Engagement against the tier baseline</strong>, only when likes are known. Below a quarter
                    of the baseline: <span className="tabular text-cyan">−25</span>. Above three and a half times it:{' '}
                    <span className="tabular text-cyan">−15</span>. In between:{' '}
                    <span className="tabular text-amber">+10</span>.
                  </p>
                  <div className="table-wrap">
                    <table className="datatable about-tiers">
                      <caption>Expected engagement by audience size</caption>
                      <thead>
                        <tr>
                          <th scope="col">Followers</th>
                          <th scope="col" className="num">Baseline</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TIERS.map(([tier, rate]) => (
                          <tr key={tier}>
                            <td className="mono">{tier}</td>
                            <td className="num">{rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>
              <li>
                <span className="about-method__no">05</span>
                <p>
                  The score is held between <span className="tabular">12</span> and{' '}
                  <span className="tabular">98</span>. Nothing is ever scored 0 or 100, because public numbers can’t
                  prove either.
                </p>
              </li>
              <li>
                <span className="about-method__no">06</span>
                <p>
                  <strong>Ghost</strong> = 100 − score + 5, held between 4% and 88%.{' '}
                  <strong>Developed</strong> = 100 − ghost.
                </p>
              </li>
            </ol>
            <p className="about-method__foot">
              Profiles on file (source A) carry the score and percentages recorded when they were filed.
            </p>
          </div>
        </div>
      </section>

      {/* Second pull quote, offset the other way */}
      <section className="band band--flush page-grid about-pull-band" aria-label="Pull quote">
        <blockquote className="pull about-pull about-pull--2">
          <p>
            Nobody can pay to <span className="safe">develop better.</span>
          </p>
        </blockquote>
      </section>

      {/* 05 · House rules */}
      <section className="band page-grid about-rules" aria-labelledby="about-rules-title">
        <Edge frame="05" label="House rules" />
        <div className="cols about-rules__grid">
          <h2 id="about-rules-title" className="display-s about-rules__title">House rules</h2>
          <dl className="about-rules__list">
            <div className="about-rules__row">
              <dt>
                <span className="about-rules__no">R1</span> No passwords, ever
              </dt>
              <dd>
                We never ask you to connect an account, grant access, or enter credentials. Every examination uses
                public information only.
              </dd>
            </div>
            <div className="about-rules__row">
              <dt>
                <span className="about-rules__no">R2</span> No paid scores
              </dt>
              <dd>
                Creators and agencies can’t pay to raise a score or hide a report. The same arithmetic runs for
                everyone.
              </dd>
            </div>
            <div className="about-rules__row">
              <dt>
                <span className="about-rules__no">R3</span> Free to use
              </dt>
              <dd>
                Checking whether an audience is real shouldn’t need an enterprise contract. The examination is free.
              </dd>
            </div>
            <div className="about-rules__row">
              <dt>
                <span className="about-rules__no">R4</span> Your history stays with you
              </dt>
              <dd>
                The list of profiles you have examined is kept in your own browser, not on our servers. You can
                empty it from the <Link href="/history">History</Link> page at any time.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 06 · Close */}
      <section className="band band--contact band--rule page-grid about-close" aria-labelledby="about-close-title">
        <Edge frame="06" label="Into the tray" />
        <div className="cols about-close__grid">
          <h2 id="about-close-title" className="display-m about-close__title">
            See what <span className="text-amber">comes through</span>
          </h2>
          <div className="about-close__body">
            <p>Paste a handle or a profile link. Instagram, TikTok, YouTube, X, Reddit, dating, marketplace and freelance profiles all go in the same tray.</p>
            <Link href="/analyze" className="btn btn--safe">
              Develop a profile
              <Glyph name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
