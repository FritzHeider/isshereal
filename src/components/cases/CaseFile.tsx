import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SAMPLE_REPORTS, type SampleReport } from '@/data/content';
import { Edge } from '@/components/darkroom/Edge';
import { Glyph, type GlyphName } from '@/components/darkroom/Glyph';
import { DevelopTray } from '@/components/darkroom/DevelopTray';
import { GreaseNote } from '@/components/darkroom/Grease';
import { ThemeToggle } from '@/components/ThemeToggle';
import { greaseVerdict } from '@/lib/utils';
import { CaseIntake } from './CaseIntake';

/**
 * A use-case "case file". One shared structure for the four case pages:
 *
 *   01 Opening        headline-scale question, lede, crumbs, edge code
 *   02 Worked example a fictional report developing in the tray, annotated
 *   03 Red flags      a data sheet of flags and what to do, plus a memo
 *   -- Extra          optional page-specific island (calculator)
 *   04 Intake         film-label field routing to /analyze?handle=
 *   05 Limits         what a score can't tell you, short questions
 *   06 Other cases    a contact strip of the other three files
 *
 * Each page supplies its own copy and a `code` that drives a different
 * composition in src/styles/pages/cases.css (data-case="dt|mk|fl|iv").
 */

export type CaseCode = 'DT' | 'MK' | 'FL' | 'IV';

export interface CaseFlag {
  flag: React.ReactNode;
  action: React.ReactNode;
}

export interface CaseQuestion {
  q: string;
  a: React.ReactNode;
}

export interface CaseFileProps {
  code: CaseCode;
  slug: string;
  crumb: string;
  glyph: GlyphName;
  /** Gentle tone (dating, marketplace): larger body, Lights-on switch at the top. */
  gentle?: boolean;
  opening: {
    title: React.ReactNode;
    lede: React.ReactNode;
    aside?: React.ReactNode;
  };
  example: {
    reportId: string;
    kicker: string;
    title: React.ReactNode;
    body: React.ReactNode;
    alt: string;
    /** One plain-language note per verifiedSignal, in order. */
    developedNotes: React.ReactNode[];
    /** One plain-language note per riskSignal, in order. */
    ghostNotes: React.ReactNode[];
  };
  flags: {
    title: React.ReactNode;
    lede: React.ReactNode;
    items: CaseFlag[];
    memo: {
      re: string;
      title: string;
      steps: React.ReactNode[];
      sign: string;
    };
  };
  extra?: React.ReactNode;
  intake: {
    title: React.ReactNode;
    lede: React.ReactNode;
    label: string;
    placeholder: string;
    hint: React.ReactNode;
  };
  limits: {
    title: React.ReactNode;
    body: React.ReactNode;
    questions: CaseQuestion[];
  };
}

const CASE_INDEX: { code: CaseCode; slug: string; title: string; question: string; reportId: string }[] = [
  { code: 'DT', slug: 'dating-safety', title: 'Dating safety', question: 'Is your match real?', reportId: 'alex' },
  { code: 'MK', slug: 'marketplace-buyers', title: 'Marketplace buyers', question: 'Is the seller real?', reportId: 'quickdeals' },
  { code: 'FL', slug: 'hiring-freelancers', title: 'Hiring freelancers', question: 'Is the freelancer real?', reportId: 'pixelpro' },
  { code: 'IV', slug: 'influencer-vetting', title: 'Influencer vetting', question: 'Is the audience real?', reportId: 'lucamodels' },
];

export function getReport(id: string): SampleReport {
  const report = SAMPLE_REPORTS.find((r) => r.id === id);
  if (!report) throw new Error(`Case file: no sample report with id "${id}"`);
  return report;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function CaseFile(props: CaseFileProps) {
  const { code, slug, crumb, glyph, gentle, opening, example, flags, extra, intake, limits } = props;
  const report = getReport(example.reportId);
  const ghostPct = report.fakePct;
  const developedPct = 100 - report.fakePct;
  const lc = code.toLowerCase();
  const others = CASE_INDEX.filter((c) => c.code !== code);
  const id = (part: string) => `${slug}-${part}`;

  return (
    <article className="case" data-case={lc} data-gentle={gentle ? 'true' : undefined} aria-labelledby={id('title')}>
      {/* 01 Opening -------------------------------------------------- */}
      <header className="case-open page-grid">
        <Edge frame={`${code} 01`} label={`Case file · ${crumb}`} />
        <div className="case-open__grid cols">
          <div className="case-open__meta">
            <nav className="crumbs" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/#cases">Cases</Link>
                </li>
                <li>
                  <span aria-current="page">{crumb}</span>
                </li>
              </ol>
            </nav>
            <div className="case-open__tools">
              <span className="case-code">
                <Glyph name={glyph} size={18} />
                <span>
                  Case <strong>{code}</strong>
                </span>
              </span>
              {gentle ? <ThemeToggle className="case-open__switch" /> : null}
            </div>
          </div>

          <h1 id={id('title')} className="case-open__title">
            {opening.title}
          </h1>

          <div className="case-open__lede case-body">
            {opening.lede}
            <p className="case-open__jump">
              <a className="btn btn--quiet" href={`#${id('intake')}`}>
                Skip to the check
                <Glyph name="arrow-down" size={16} />
              </a>
            </p>
          </div>

          {opening.aside ? <div className="case-open__aside">{opening.aside}</div> : null}
        </div>
      </header>

      {/* 02 Worked example ------------------------------------------ */}
      <section className="band band--tray page-grid" aria-labelledby={id('example')}>
        <Edge frame={`${code} 02`} label="Worked example" />
        <div className="case-example cols">
          <div className="case-example__head head">
            <p className="head__kicker label">{example.kicker}</p>
            <h2 id={id('example')} className="head__title">
              {example.title}
            </h2>
            <div className="case-body">{example.body}</div>
          </div>

          <div className="case-example__tray">
            <DevelopTray
              handle={report.handle.startsWith('@') ? report.handle : `@${report.handle}`}
              followersLabel={`${report.platform} · ${report.followers}`}
              realPct={developedPct}
              fakePct={ghostPct}
              avatar={report.avatarImage}
              alt={example.alt}
              frame={`${code}-${pad(report.score)}A`}
              seed={report.id}
              caption={
                <>
                  <span className="label text-cyan">Log</span> {report.suspiciousSpike}
                </>
              }
              verdict={
                <GreaseNote tone={report.score >= 50 ? 'amber' : 'cyan'} tilt={-3}>
                  {greaseVerdict(report.score)}
                </GreaseNote>
              }
            />
            <p className="case-example__fiction label text-2">
              Fictional example. Handle, photograph and numbers are for demonstration.
            </p>
          </div>

          <div className="case-example__notes">
            <div className="case-notes">
              <h3 className="case-notes__title">
                <Glyph name="ghost" size={18} />
                Stayed a ghost
                <span className="case-notes__pct tabular">{ghostPct}%</span>
              </h3>
              <ul className="signals signals--ghost" role="list">
                {report.riskSignals.map((log, i) => (
                  <li key={log}>
                    <Glyph name="ghost" size={18} />
                    <div className="case-note">
                      <p className="case-note__log">{log}</p>
                      {example.ghostNotes[i] ? <p className="case-note__text">{example.ghostNotes[i]}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="case-notes">
              <h3 className="case-notes__title case-notes__title--developed">
                <Glyph name="developed" size={18} />
                Came through
                <span className="case-notes__pct tabular">{developedPct}%</span>
              </h3>
              <ul className="signals signals--developed" role="list">
                {report.verifiedSignals.map((log, i) => (
                  <li key={log}>
                    <Glyph name="developed" size={18} />
                    <div className="case-note">
                      <p className="case-note__log">{log}</p>
                      {example.developedNotes[i] ? <p className="case-note__text">{example.developedNotes[i]}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 03 Red flags ---------------------------------------------- */}
      <section className="band band--rule page-grid" aria-labelledby={id('flags')}>
        <Edge frame={`${code} 03`} label="Red flags" />
        <div className="case-flags cols">
          <div className="case-flags__head head">
            <p className="head__kicker label">Data sheet {code}-RF · {flags.items.length} flags</p>
            <h2 id={id('flags')} className="head__title">
              {flags.title}
            </h2>
            <div className="case-body">{flags.lede}</div>
          </div>

          <div className="case-flags__sheet sheet">
            <div className="sheet__head">
              <span className="sheet__code">
                {code}-RF · Rev. 10/26
              </span>
              <p className="sheet__title">Flag · What to do</p>
            </div>
            <ul className="signals signals--ghost case-flaglist" role="list">
              {flags.items.map((item, i) => (
                <li key={i} className="case-flag">
                  <Glyph name="ghost" size={18} />
                  <div className="case-flag__row">
                    <p className="case-flag__what">
                      <span className="case-flag__no tabular">{pad(i + 1)}</span>
                      {item.flag}
                    </p>
                    <p className="case-flag__do">
                      <span className="case-flag__label label">Do</span>
                      {item.action}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="case-flags__memo" aria-labelledby={id('memo')}>
            <div className="memo">
              <dl className="memo__head">
                <dt>To</dt>
                <dd>You</dd>
                <dt>From</dt>
                <dd>The darkroom</dd>
                <dt>Re</dt>
                <dd>{flags.memo.re}</dd>
              </dl>
              <div className="memo__body">
                <h3 id={id('memo')} className="case-memo__title">
                  {flags.memo.title}
                </h3>
                <ol className="case-memo__steps" role="list">
                  {flags.memo.steps.map((step, i) => (
                    <li key={i}>
                      <span className="case-memo__no tabular" aria-hidden="true">
                        {pad(i + 1)}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <p className="memo__sign">{flags.memo.sign}</p>
            </div>
          </aside>
        </div>
      </section>

      {extra}

      {/* 04 Intake ------------------------------------------------- */}
      <section
        id={id('intake')}
        className="band band--tray band--rebate page-grid case-intake-band"
        data-room="dark"
        aria-labelledby={id('intake-title')}
      >
        <Edge frame={`${code} 04`} label="Intake" />
        <div className="case-intake cols">
          <div className="case-intake__head head">
            <p className="head__kicker label">Intake · {crumb}</p>
            <h2 id={id('intake-title')} className="head__title">
              {intake.title}
            </h2>
          </div>
          <div className="case-intake__body">
            <div className="case-body case-intake__lede">{intake.lede}</div>
            <CaseIntake code={code} glyph={glyph} label={intake.label} placeholder={intake.placeholder} hint={intake.hint} />
          </div>
        </div>
      </section>

      {/* 05 Limits ------------------------------------------------- */}
      <section className="band page-grid" aria-labelledby={id('limits')}>
        <Edge frame={`${code} 05`} label="Limits" />
        <div className="case-limits cols">
          <div className="case-limits__lead">
            <p className="head__kicker label">What a score can’t tell you</p>
            <h2 id={id('limits')} className="case-limits__title">
              {limits.title}
            </h2>
            <div className="case-body">{limits.body}</div>
          </div>
          <p className="case-limits__pull pull">
            A score is evidence about an audience, <span className="safe">not a verdict on a person.</span>
          </p>
          <div className="case-limits__qs">
            {limits.questions.map((item, i) => (
              <div key={item.q} className="case-q">
                <p className="case-q__no label tabular">Q.{pad(i + 1)}</p>
                <h3 className="case-q__title">{item.q}</h3>
                <div className="case-q__answer case-body">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 Other cases ------------------------------------------- */}
      <nav className="band band--contact band--rule page-grid" aria-labelledby={id('others')}>
        <Edge frame={`${code} 06`} label="Other case files" />
        <div className="case-others">
          <h2 id={id('others')} className="case-others__title label">
            Other case files
          </h2>
          <div className="contact" data-room="dark">
            <ul className="contact__frames case-others__frames" role="list">
              {others.map((c) => {
                const r = getReport(c.reportId);
                return (
                  <li key={c.code}>
                    <Link className="frame" href={`/use-cases/${c.slug}`}>
                      <span className="frame__img">
                        <Image src={r.avatarImage} alt="" width={240} height={240} sizes="(max-width: 56rem) 45vw, 16rem" loading="lazy" />
                      </span>
                      <span className="frame__code">
                        <span>Case {c.code}</span>
                        <span className="text-cyan">{r.fakePct}% ghost</span>
                      </span>
                      <span className="frame__title">{c.title}</span>
                      <span className="frame__sub">{c.question}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </article>
  );
}
