import type { Metadata } from 'next';
import Link from 'next/link';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph } from '@/components/darkroom/Glyph';
import { Crumbs } from '@/components/library/Crumbs';
import { Specimen } from '@/components/library/Specimen';

const DESCRIPTION =
  'Technical publication AD-1: the isshereal audit API. One endpoint, GET and POST, JSON responses, no keys, 60 requests a minute per IP address.';

export const metadata: Metadata = {
  title: 'API docs: technical publication AD-1',
  description: DESCRIPTION,
  alternates: { canonical: '/api-docs' },
  openGraph: {
    title: 'API docs: technical publication AD-1 · isshereal.com',
    description: DESCRIPTION,
    url: 'https://isshereal.com/api-docs',
    type: 'article',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'A technical data sheet for the isshereal audit API.' }],
  },
};

/* Specimens are real outputs of the scoring engine, captured for this
   publication. Only the timestamps are fixed. */

const GET_RESPONSE = {
  success: true,
  report: {
    id: 'instagram_nasa',
    name: 'NASA',
    handle: '@nasa',
    platform: 'Instagram',
    score: 96,
    followers: '97M followers',
    followersCount: 97000000,
    followingCount: 72,
    postsCount: 4500,
    verdict: 'Exceptional Authenticity',
    fakePct: 4,
    realPct: 96,
    avatarImage: 'https://ui-avatars.com/api/?name=NASA&background=0B3D91&color=ffffff&size=200&bold=true',
    engagementRate: '1.45%',
    suspiciousSpike: 'Decade-long sustained organic growth anchored in major mission broadcasts',
    riskSignals: ['No bot spikes or commercial follower manipulation signatures detected'],
    verifiedSignals: [
      'Official scientific institution verified by Meta public agency registry',
      'Over 4,500 historical educational media releases',
      'High genuine comment linguistic variance spanning global educational demographics',
    ],
    isLive: true,
    timestamp: '2026-10-30T09:02:29.924Z',
  },
};

const POST_BODY = {
  handle: '@example.shop',
  platform: 'instagram',
  followers: 48210,
  following: 6900,
  posts: 37,
  name: 'Example Shop',
};

const POST_RESPONSE = {
  success: true,
  report: {
    id: 'instagram_exampleshop',
    name: 'Example Shop',
    handle: '@example.shop',
    platform: 'Instagram',
    score: 72,
    followers: '48.2K followers',
    followersCount: 48210,
    followingCount: 6900,
    postsCount: 37,
    verdict: 'Likely authentic',
    fakePct: 33,
    realPct: 67,
    avatarImage: 'https://ui-avatars.com/api/?name=exampleshop&background=059669&color=ffffff&bold=true',
    engagementRate: '3.2%',
    suspiciousSpike: 'Minor follower inflow fluctuation detected',
    riskSignals: ['Zero active engagement pod or automated script signatures detected'],
    verifiedSignals: ['Public profile indexed and verifiable in standard registries'],
    isLive: true,
    timestamp: '2026-10-30T09:02:29.954Z',
  },
};

const NEEDS_INPUT_RESPONSE = {
  success: true,
  report: {
    id: 'instagram_someonenew',
    handle: '@someone.new',
    score: 72,
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    fakePct: 33,
    realPct: 67,
    needsVerification: true,
  },
  needsInput: true,
  handle: '@someone.new',
  platform: 'instagram',
};

const CONTENTS = [
  { id: 'ad-1-1', code: 'AD-1.1', title: 'Before you call' },
  { id: 'ad-1-2', code: 'AD-1.2', title: 'GET /api/audit' },
  { id: 'ad-1-3', code: 'AD-1.3', title: 'POST /api/audit' },
  { id: 'ad-1-4', code: 'AD-1.4', title: 'When nothing develops' },
  { id: 'ad-1-5', code: 'AD-1.5', title: 'The report object' },
  { id: 'ad-1-6', code: 'AD-1.6', title: 'Errors and limits' },
  { id: 'ad-1-7', code: 'AD-1.7', title: 'Keys and higher limits' },
];

const REPORT_FIELDS: [string, string, string][] = [
  ['id', 'string', 'Platform and handle joined, for example instagram_nasa. Use it to build a report link: /report/{id}.'],
  ['name', 'string', 'Display name as read from the profile or as you sent it.'],
  ['handle', 'string', 'Handle with a leading @.'],
  ['platform', 'string', 'Instagram, YouTube, TikTok, Reddit, X, Social, Dating, Marketplace or Freelance.'],
  ['score', 'number', 'Authenticity score out of 100; computed reports fall between 12 and 98. A heuristic over public numbers; see About for the method.'],
  ['followers', 'string', 'Follower count in short form, for display only.'],
  ['followersCount', 'number', 'Follower count as an integer.'],
  ['followingCount', 'number', 'Accounts the profile follows.'],
  ['postsCount', 'number', 'Public posts.'],
  ['verdict', 'string', 'Short written verdict. Wording varies for profiles on file.'],
  ['realPct', 'number', 'Developed share. Computed reports derive it from the score; it is not counted follower by follower. Profiles on file carry their filed value.'],
  ['fakePct', 'number', 'Ghost share. Always 100 minus realPct.'],
  ['avatarImage', 'string', 'Avatar URL. A generated initials image when none was available.'],
  ['engagementRate', 'string', 'Measured from likes and comments when you sent them; otherwise the expected rate for the audience tier.'],
  ['suspiciousSpike', 'string', 'One-line note on growth, chosen from the score band.'],
  ['riskSignals', 'string[]', 'Ghost signals: what counted against the profile.'],
  ['verifiedSignals', 'string[]', 'Developed signals: what counted for it.'],
  ['isLive', 'boolean', 'Currently always true. Do not use it to tell fresh reads from cached ones.'],
  ['needsVerification', 'boolean', 'Present and true when nothing could be read. The readings are placeholders.'],
  ['timestamp', 'string', 'ISO 8601 time the report was computed.'],
];

export default function ApiDocsPage() {
  return (
    <article className="manual">
      {/* 01 · Cover sheet */}
      <section className="band band--tray page-grid manual-cover" aria-labelledby="manual-title">
        <Edge frame="01" label="Publication AD-1" />
        <Crumbs trail={[{ label: 'Home', href: '/' }, { label: 'API docs' }]} />
        <div className="cols manual-cover__grid">
          <div className="head manual-cover__title">
            <p className="head__kicker label">Technical publication AD-1 · Revised October 2026</p>
            <h1 id="manual-title">
              The audit <span className="text-safe">API</span>
            </h1>
            <p className="head__lede">
              One endpoint that examines a public profile and returns the same report you see on the site, as JSON.
              It reads public numbers only. It never logs in to anything.
            </p>
          </div>

          <aside className="manual-plate" aria-label="Publication data">
            <p className="manual-plate__code label">Data · AD-1.0</p>
            <dl className="specs">
              <dt>Base URL</dt>
              <dd>
                <code>https://isshereal.com</code>
              </dd>
              <dt>Endpoint</dt>
              <dd>
                <code>/api/audit</code>, GET and POST
              </dd>
              <dt>Format</dt>
              <dd>JSON, UTF-8</dd>
              <dt>Keys</dt>
              <dd>None. Every call is anonymous.</dd>
              <dt>Rate</dt>
              <dd>
                <span className="tabular">60</span> requests a minute per IP address
              </dd>
              <dt>Status</dt>
              <dd>Beta. Fields may be added; none will be renamed without notice here.</dd>
            </dl>
          </aside>

          <nav className="manual-contents" aria-label="Contents">
            <p className="label text-2">Contents</p>
            <ol>
              {CONTENTS.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>
                    <span className="manual-contents__code">{c.code}</span>
                    <span>{c.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* AD-1.1 · Before you call */}
      <section id="ad-1-1" className="band band--rule page-grid manual-entry" aria-labelledby="ad-1-1-title">
        <Edge frame="02" label="AD-1.1" />
        <div className="cols">
          <div className="manual-entry__text prose">
            <p className="manual-code">AD-1.1</p>
            <h2 id="ad-1-1-title">Before you call</h2>
            <p>
              Call the API from a server, not from a browser on another site. Requests from other origins don’t get
              a cross-origin allowance, so a browser will refuse to hand you the response. A server, a script or a
              terminal works.
            </p>
            <p>
              There are no keys and no accounts. Requests are counted against the IP address they arrive from, at
              60 a minute. The count is kept in server memory, so treat 60 as a ceiling rather than a promise.
            </p>
            <p>
              Successful responses are cacheable for a day (<code>s-maxage=86400</code>). Two calls for the same
              handle within that window can return the same report, timestamp included.
            </p>
            <p>
              <em>
                A score is evidence about an audience, not a verdict on a person.
              </em>{' '}
              If you show these numbers to anyone, show them that sentence too.
            </p>
          </div>
          <div className="manual-entry__specimens">
            <Specimen code="Fig. 1.1" title="Response headers, 200">
              <span className="tok-key">Content-Type</span>: application/json{'\n'}
              <span className="tok-key">Cache-Control</span>: public, s-maxage=<span className="tok-num">86400</span>,
              {'\n  '}stale-while-revalidate=<span className="tok-num">43200</span>
            </Specimen>
          </div>
        </div>
      </section>

      {/* AD-1.2 · GET */}
      <section id="ad-1-2" className="band band--rule page-grid manual-entry" aria-labelledby="ad-1-2-title">
        <Edge frame="03" label="AD-1.2" />
        <div className="cols">
          <div className="manual-entry__text prose">
            <p className="manual-code">AD-1.2</p>
            <h2 id="ad-1-2-title">
              <span className="manual-method">GET</span> /api/audit
            </h2>
            <p>Examine a profile by handle. The server works through these sources in order and stops at the first that answers:</p>
            <ol>
              <li>A report computed recently on the same server.</li>
              <li>The profiles on file (the register on the Top creators page).</li>
              <li>A live read of the public profile. Readers exist for Instagram, YouTube and TikTok; any other platform value is read as Instagram.</li>
              <li>If nothing answers, a response flagged <code>needsInput</code>. See AD-1.4.</li>
            </ol>
            <h3>Query parameters</h3>
            <div className="table-wrap">
              <table className="datatable manual-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Required</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="mono">handle</td>
                    <td className="mono">string</td>
                    <td>Yes</td>
                    <td>
                      Handle or profile URL. A leading @ and instagram.com, tiktok.com or youtube.com prefixes are
                      stripped, then anything except letters, digits, <code>_</code> and <code>.</code>. Lowercased,
                      at most 64 characters. <code>id</code> is accepted as an alias.
                    </td>
                  </tr>
                  <tr>
                    <td className="mono">platform</td>
                    <td className="mono">string</td>
                    <td>No</td>
                    <td>
                      One of <code>instagram</code>, <code>youtube</code>, <code>tiktok</code>, <code>x</code>,{' '}
                      <code>reddit</code>, <code>dating</code>, <code>marketplace</code>, <code>freelance</code>.
                      Anything else, or nothing, means <code>instagram</code>.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="manual-entry__specimens">
            <Specimen code="Fig. 1.2a" method="GET" title="Request">
              curl <span className="tok-str">&quot;https://isshereal.com/api/audit?handle=nasa&amp;platform=instagram&quot;</span>
              {'\n'}
              <span className="tok-com"># A profile on file: answers without a live read</span>
            </Specimen>
            <Specimen code="Fig. 1.2b" title="Response, 200" json={GET_RESPONSE} />
          </div>
        </div>
      </section>

      {/* AD-1.3 · POST */}
      <section id="ad-1-3" className="band band--rule page-grid manual-entry manual-entry--flip" aria-labelledby="ad-1-3-title">
        <Edge frame="04" label="AD-1.3" />
        <div className="cols">
          <div className="manual-entry__text prose">
            <p className="manual-code">AD-1.3</p>
            <h2 id="ad-1-3-title">
              <span className="manual-method">POST</span> /api/audit
            </h2>
            <p>
              Examine a profile from numbers you already have. When <code>followers</code> is above zero the server
              scores your figures directly and reads nothing from the platform. Without it, POST behaves like GET:
              profiles on file first, then a live read.
            </p>
            <p>
              One exception: if the handle is on file and you send a follower count that matches the filed one, or
              none at all, you get the filed report.
            </p>
            <h3>Body fields</h3>
            <div className="table-wrap">
              <table className="datatable manual-table">
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col">Type</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="mono">handle</td>
                    <td className="mono">string</td>
                    <td>Required. Cleaned as in AD-1.2.</td>
                  </tr>
                  <tr>
                    <td className="mono">platform</td>
                    <td className="mono">string</td>
                    <td>Optional. Same list and fallback as AD-1.2.</td>
                  </tr>
                  <tr>
                    <td className="mono">followers</td>
                    <td className="mono">number</td>
                    <td>Above zero switches to scoring your numbers.</td>
                  </tr>
                  <tr>
                    <td className="mono">following, posts</td>
                    <td className="mono">number</td>
                    <td>Optional. Missing values count as 0.</td>
                  </tr>
                  <tr>
                    <td className="mono">likes, comments</td>
                    <td className="mono">number</td>
                    <td>Optional, totals for recent posts. With likes present, engagement is measured against the tier baseline.</td>
                  </tr>
                  <tr>
                    <td className="mono">name</td>
                    <td className="mono">string</td>
                    <td>Optional. Cut to 100 characters; &lt; &gt; &quot; &apos; &amp; removed.</td>
                  </tr>
                  <tr>
                    <td className="mono">avatarUrl</td>
                    <td className="mono">string</td>
                    <td>Optional. Used only if it starts with https://, at most 500 characters.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="manual-note">
              Numbers are clamped to 0 through 100,000,000,000; anything that isn’t a number counts as 0. A body with
              more than ten top-level fields is refused.
            </p>
          </div>
          <div className="manual-entry__specimens">
            <Specimen code="Fig. 1.3a" method="POST" title="Request">
              curl -X POST <span className="tok-str">&quot;https://isshereal.com/api/audit&quot;</span> \{'\n'}
              {'  '}-H <span className="tok-str">&quot;Content-Type: application/json&quot;</span> \{'\n'}
              {'  '}-d <span className="tok-str">&apos;{JSON.stringify(POST_BODY)}&apos;</span>
            </Specimen>
            <Specimen code="Fig. 1.3b" title="Response, 200" json={POST_RESPONSE} />
          </div>
        </div>
      </section>

      {/* AD-1.4 · Needs input */}
      <section id="ad-1-4" className="band band--rule page-grid manual-entry" aria-labelledby="ad-1-4-title">
        <Edge frame="05" label="AD-1.4" />
        <div className="cols">
          <div className="manual-entry__text prose">
            <p className="manual-code">AD-1.4</p>
            <h2 id="ad-1-4-title">When nothing develops</h2>
            <p>
              Platforms often refuse automated reads. When no source answers, the API still returns{' '}
              <code>200</code> with <code>success: true</code>, but adds <code>needsInput: true</code> and marks the
              report <code>needsVerification: true</code>.
            </p>
            <p>
              <strong>Check for those flags before you read anything else.</strong> The report in this response is
              computed from zero counts, so its score, verdict and percentages are placeholders, not findings. Show
              your user a request for the real numbers and send them with POST.
            </p>
            <p>POST responses in this state also carry a plain-language <code>message</code> you can show as is.</p>
          </div>
          <div className="manual-entry__specimens">
            <Specimen code="Fig. 1.4" title="Response, 200, shortened" json={NEEDS_INPUT_RESPONSE} />
          </div>
        </div>
      </section>

      {/* AD-1.5 · The report object: a full-width data sheet */}
      <section id="ad-1-5" className="band band--rebate page-grid manual-fields" aria-labelledby="ad-1-5-title">
        <Edge frame="06" label="AD-1.5" />
        <div className="sheet manual-fields__sheet">
          <div className="sheet__head">
            <h2 id="ad-1-5-title" className="sheet__title">The report object</h2>
            <span className="sheet__code">AD-1.5 · {REPORT_FIELDS.length} fields</span>
          </div>
          <p className="manual-fields__lede">
            Every successful response carries <code>report</code>. The scoring method behind <code>score</code>,{' '}
            <code>realPct</code> and <code>fakePct</code> is set out in full on the{' '}
            <Link href="/about#what-a-score-shows">About</Link> page.
          </p>
          <div className="table-wrap">
            <table className="datatable manual-table manual-table--fields">
              <thead>
                <tr>
                  <th scope="col">Field</th>
                  <th scope="col">Type</th>
                  <th scope="col">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {REPORT_FIELDS.map(([field, type, meaning]) => (
                  <tr key={field}>
                    <td className="mono">{field}</td>
                    <td className="mono text-2">{type}</td>
                    <td>{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* AD-1.6 · Errors */}
      <section id="ad-1-6" className="band page-grid manual-entry" aria-labelledby="ad-1-6-title">
        <Edge frame="07" label="AD-1.6" />
        <div className="cols">
          <div className="manual-entry__text prose">
            <p className="manual-code">AD-1.6</p>
            <h2 id="ad-1-6-title">Errors and limits</h2>
            <p>Errors come back as JSON with a single <code>error</code> string. Internal details are never included.</p>
            <div className="table-wrap">
              <table className="datatable manual-table">
                <thead>
                  <tr>
                    <th scope="col" className="num">Status</th>
                    <th scope="col">When</th>
                    <th scope="col">error</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="num">400</td>
                    <td>No handle given</td>
                    <td className="mono">Handle or ID is required (GET), Profile handle is required (POST)</td>
                  </tr>
                  <tr>
                    <td className="num">400</td>
                    <td>Handle empty after cleaning</td>
                    <td className="mono">Invalid handle format</td>
                  </tr>
                  <tr>
                    <td className="num">400</td>
                    <td>POST body over ten fields</td>
                    <td className="mono">Invalid request body</td>
                  </tr>
                  <tr>
                    <td className="num">414</td>
                    <td>Full URL longer than 2,048 characters</td>
                    <td className="mono">Request URI too long</td>
                  </tr>
                  <tr>
                    <td className="num">429</td>
                    <td>Over 60 requests in a minute from one IP</td>
                    <td className="mono">Too many requests. Please try again later.</td>
                  </tr>
                  <tr>
                    <td className="num">500</td>
                    <td>Unreadable POST body or a server fault</td>
                    <td className="mono">An internal error occurred. Please try again.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              After a <code>429</code>, wait for the number of seconds in <code>Retry-After</code> (always 60) before
              calling again. The limit covers every <code>/api/</code> path, not only this one.
            </p>
          </div>
          <div className="manual-entry__specimens">
            <Specimen code="Fig. 1.6" title="Response, 429">
              <span className="tok-key">Retry-After</span>: <span className="tok-num">60</span>
              {'\n\n'}
              {'{'}
              {'\n  '}
              <span className="tok-key">&quot;error&quot;</span>:{' '}
              <span className="tok-str">&quot;Too many requests. Please try again later.&quot;</span>
              {'\n}'}
            </Specimen>
          </div>
        </div>
      </section>

      {/* AD-1.7 · Keys */}
      <section id="ad-1-7" className="band band--contact band--rule page-grid manual-close" aria-labelledby="ad-1-7-title">
        <Edge frame="08" label="AD-1.7" />
        <div className="cols">
          <p className="manual-close__code manual-code">AD-1.7</p>
          <h2 id="ad-1-7-title" className="manual-close__title display-m">
            No keys yet. <span className="text-2">No paid tier.</span>
          </h2>
          <div className="manual-close__body">
            <p>
              There is no key system and nothing to buy today. If 60 requests a minute is not enough for what you
              are building, tell us what it is and roughly how many profiles a day you need.
            </p>
            <Link href="/contact" className="btn btn--safe">
              Write to the darkroom
              <Glyph name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
