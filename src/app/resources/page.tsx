import type { Metadata } from 'next';
import Link from 'next/link';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph, type GlyphName } from '@/components/darkroom/Glyph';
import { Crumbs } from '@/components/library/Crumbs';

const DESCRIPTION =
  'The darkroom shelf: short field guides on spotting fake followers, reading engagement rates, and recognising romance-scam profiles.';

export const metadata: Metadata = {
  title: 'Resources: the darkroom shelf',
  description: DESCRIPTION,
  alternates: { canonical: '/resources' },
  openGraph: {
    title: 'Resources: the darkroom shelf · isshereal.com',
    description: DESCRIPTION,
    url: 'https://isshereal.com/resources',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Labelled boxes of photo paper on a long shelf.' }],
  },
};

interface Guide {
  id: string;
  code: string;
  title: string;
  topic: string;
  grade: string;
  glyph: GlyphName;
  summary: string;
  body: string[];
  equipment: { href: string; label: string };
}

const GUIDES: Guide[] = [
  {
    id: 'spot-fake-followers',
    code: 'PB-01',
    title: 'How to spot fake followers in 2026',
    topic: 'Detection',
    grade: 'Grade 2 · Normal',
    glyph: 'loupe',
    summary: 'What bot accounts and inflated followings look like on the major platforms, and what to check first.',
    body: [
      'Fake accounts change as the platforms do, so a missing profile picture is no longer enough to go on. Look for comments that could sit under any post, follower-to-following ratios that lean heavily towards following, and sudden jumps in follower count with no viral post to explain them.',
      'AI-generated avatars are common now. They often give themselves away in the lighting and the background: a shadow falling the wrong way, an ear that doesn’t match, text in the scenery that isn’t quite text.',
      'An audience that is real responds to what is posted. When the comments, the timing and the numbers all point the same way, the audience is probably genuine. When they disagree, look closer.',
    ],
    equipment: { href: '/analyze', label: 'Develop a profile' },
  },
  {
    id: 'good-engagement-rate',
    code: 'PB-02',
    title: 'What is a good engagement rate?',
    topic: 'Metrics',
    grade: 'Grade 3 · Contrast',
    glyph: 'teststrip',
    summary: 'Which numbers matter, and how a healthy rate changes with the platform and the size of the audience.',
    body: [
      'Engagement rate is the number most worth checking after the follower count, because it is harder to fake in a believable way. What counts as good depends on the platform and the niche.',
      'As a rough guide, larger accounts usually land between 1% and 5%. Smaller creators often see 5% to 10% or more, because a small audience tends to know the person. Short video, such as Reels and TikToks, usually draws higher rates than still images.',
      'Don’t stop at likes. Comments, saves and shares take more effort, so they say more about whether people actually care. A huge like count with almost no comments deserves a second look.',
    ],
    equipment: { href: '/tools/engagement-rate', label: 'Run the engagement test strip' },
  },
  {
    id: 'romance-scam-red-flags',
    code: 'PB-03',
    title: 'Romance scam red flags: a complete guide',
    topic: 'Safety',
    grade: 'Grade 4 · Hard',
    glyph: 'dating',
    summary: 'The common signs of a romance scam and a fake dating profile, and how to protect yourself.',
    body: [
      'Romance scams often start with an unexpected message from someone who seems a little too perfect. Watch for declarations of love that arrive very fast, pressure to move the conversation off the original app, and, sooner or later, a request for money: an emergency, a travel cost, an investment that can’t wait.',
      'Reverse image search their photos. Be careful with anyone who always has a reason not to video call.',
      'Never send money to someone you haven’t met in person, however long you have been talking and however good the reason sounds.',
    ],
    equipment: { href: '/use-cases/dating-safety', label: 'Check a dating profile' },
  },
];

function readingTime(body: string[]) {
  const words = body.join(' ').split(/\s+/).filter(Boolean).length;
  return { words, minutes: Math.max(1, Math.round(words / 220)) };
}

export default function ResourcesPage() {
  return (
    <article className="shelf">
      {/* 01 · Shelf label */}
      <section className="band band--tray page-grid shelf-head" aria-labelledby="shelf-title">
        <Edge frame="01" label="Darkroom shelf" />
        <Crumbs trail={[{ label: 'Home', href: '/' }, { label: 'Resources' }]} />
        <div className="cols shelf-head__grid">
          <div className="head shelf-head__title">
            <p className="head__kicker label">Resources · {GUIDES.length} boxes on the shelf</p>
            <h1 id="shelf-title">
              The <span className="text-safe">shelf</span>
            </h1>
          </div>
          <p className="head__lede shelf-head__lede">
            Short field guides, boxed like photo paper and labelled by topic and length. Open a box to read it here;
            each one ends with the piece of equipment that does the check for you.
          </p>
        </div>
      </section>

      {/* 02 · The shelf itself */}
      <section className="band band--contact page-grid shelf-run" aria-labelledby="shelf-run-title">
        <Edge frame="02" label="Paper stock" />
        <h2 id="shelf-run-title" className="sr-only">
          Guides
        </h2>
        <ol className="shelf-rows" role="list">
          {GUIDES.map((g) => {
            const t = readingTime(g.body);
            return (
              <li key={g.id} id={g.id} className="shelf-box">
                <details className="shelf-box__details">
                  <summary className="shelf-box__label">
                    <span className="shelf-box__code">
                      <Glyph name={g.glyph} size={22} />
                      {g.code}
                    </span>
                    <h3 className="shelf-box__title">{g.title}</h3>
                    <span className="shelf-box__summary">{g.summary}</span>
                    <span className="shelf-box__specs">
                      <span>
                        <span className="label text-2">Topic</span>
                        <span className="shelf-box__value">{g.topic}</span>
                      </span>
                      <span>
                        <span className="label text-2">Length</span>
                        <span className="shelf-box__value tabular">
                          {t.minutes} min · {t.words} words
                        </span>
                      </span>
                      <span className="shelf-box__grade label">{g.grade}</span>
                    </span>
                    <span className="shelf-box__toggle" aria-hidden="true">
                      <Glyph name="plus" size={18} className="shelf-box__plus" />
                      <Glyph name="minus" size={18} className="shelf-box__minus" />
                    </span>
                  </summary>
                  <div className="shelf-box__sheet">
                    <div className="prose shelf-box__prose">
                      {g.body.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                    <p className="shelf-box__equipment">
                      <span className="label text-2">Equipment</span>
                      <Link href={g.equipment.href} className="btn btn--line btn--compact">
                        {g.equipment.label}
                        <Glyph name="arrow-right" size={16} />
                      </Link>
                    </p>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
        <div className="shelf-board" aria-hidden="true">
          <span className="label">Shelf A · Field guides</span>
          <span className="label">Store cool and dry</span>
        </div>
      </section>

      {/* 03 · Empty space on the shelf */}
      <section className="band band--rule page-grid shelf-more" aria-labelledby="shelf-more-title">
        <Edge frame="03" label="Restock" />
        <div className="cols">
          <h2 id="shelf-more-title" className="display-s shelf-more__title">
            Room on the shelf
          </h2>
          <div className="shelf-more__body">
            <p>
              We add a box when a question comes up often enough to deserve a proper answer. If there is a check you
              keep doing by hand, tell us and it may end up here.
            </p>
            <Link href="/contact" className="btn btn--quiet">
              Suggest a guide
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
