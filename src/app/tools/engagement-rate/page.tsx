"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edge } from "@/components/darkroom/Edge";
import { Glyph } from "@/components/darkroom/Glyph";
import { GreaseNote } from "@/components/darkroom/Grease";
import { Reading } from "@/components/darkroom/Reading";
import { ToolOpening } from "@/components/tools/ToolOpening";

/**
 * Audience tiers and their expected engagement rate. These are the same
 * baselines the examination uses in calculateProfileScore (src/lib/audit-engine.ts),
 * along with its two cut-offs: under 0.25x the baseline is penalised as
 * "far below", over 3.5x as an unnatural spike. Keep the two in step.
 */
const TIERS: Array<{
  id: string;
  label: string;
  min: number;
  max: number;
  expected: number;
}> = [
  { id: "t1", label: "Up to 10K", min: 0, max: 10_000, expected: 2.5 },
  { id: "t2", label: "10K – 100K", min: 10_000, max: 100_000, expected: 3.2 },
  { id: "t3", label: "100K – 1M", min: 100_000, max: 1_000_000, expected: 2.0 },
  {
    id: "t4",
    label: "1M – 10M",
    min: 1_000_000,
    max: 10_000_000,
    expected: 1.4,
  },
  {
    id: "t5",
    label: "Over 10M",
    min: 10_000_000,
    max: Infinity,
    expected: 1.0,
  },
];
const LOW_CUT = 0.25;
const HIGH_CUT = 3.5;

function tierFor(followers: number) {
  if (followers > 10_000_000) return TIERS[4];
  if (followers > 1_000_000) return TIERS[3];
  if (followers > 100_000) return TIERS[2];
  if (followers > 10_000) return TIERS[1];
  return TIERS[0];
}

type BandId = "far" | "under" | "over" | "spike";

interface Band {
  id: BandId;
  name: string;
  from: number;
  to: number;
  verdict: string;
}

function bandsFor(expected: number): Band[] {
  return [
    {
      id: "far",
      name: "Far under",
      from: 0,
      to: expected * LOW_CUT,
      verdict:
        "More than three quarters below the baseline for this audience size. Audiences that never interact look like this: bought, automated, or long gone quiet.",
    },
    {
      id: "under",
      name: "Under baseline",
      from: expected * LOW_CUT,
      to: expected,
      verdict:
        "Below the baseline, but inside the range real audiences fall in. Nothing here on its own.",
    },
    {
      id: "over",
      name: "Over baseline",
      from: expected,
      to: expected * HIGH_CUT,
      verdict:
        "At or above the baseline and inside the range real audiences fall in.",
    },
    {
      id: "spike",
      name: "Spike",
      from: expected * HIGH_CUT,
      to: expected * HIGH_CUT * 2,
      verdict:
        "More than three and a half times the baseline. Engagement pods and bought likes tend to land here; so, now and then, does one post that travelled.",
    },
  ];
}

/** Position on the strip, 0–1. The four steps are equal width, like a real test strip. */
function positionOnStrip(
  rate: number,
  bands: Band[],
): { pos: number; index: number; off: boolean } {
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i];
    const last = i === bands.length - 1;
    if (rate < b.to || last) {
      const frac = Math.min(1, (rate - b.from) / (b.to - b.from));
      const off = last && rate > b.to;
      return {
        pos: (i + (off ? 0.97 : Math.max(0, frac))) / bands.length,
        index: i,
        off,
      };
    }
  }
  return { pos: 0, index: 0, off: false };
}

const fmtRate = (n: number) =>
  (n >= 10 ? n.toFixed(1) : n.toFixed(2)).replace(/\.?0+$/, "") || "0";
const parseFigure = (s: string) => parseFloat(s.replace(/[,\s_]/g, ""));

interface Result {
  rate: number;
  followers: number;
  likes: number;
  comments: number;
}

export default function EngagementRatePage() {
  const [followers, setFollowers] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<{
    followers?: string;
    likes?: string;
    comments?: string;
  }>({});

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const fRaw = parseFigure(followers);
    const lRaw = parseFigure(likes);
    const cRaw = parseFigure(comments);
    const next: typeof errors = {};
    if (!Number.isFinite(fRaw) || fRaw <= 0)
      next.followers = "Enter the follower count, a number above zero.";
    if (!Number.isFinite(lRaw) || lRaw < 0)
      next.likes = "Enter the average likes per post. Zero is allowed.";
    if (!Number.isFinite(cRaw) || cRaw < 0)
      next.comments = "Enter the average comments per post. Zero is allowed.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = next.followers
        ? "er-followers"
        : next.likes
          ? "er-likes"
          : "er-comments";
      document.getElementById(first)?.focus();
      return;
    }
    const f = fRaw || 1;
    const l = lRaw || 0;
    const c = cRaw || 0;
    const res = ((l + c) / f) * 100;
    setResult({
      rate: parseFloat(res.toFixed(2)),
      followers: f,
      likes: l,
      comments: c,
    });
  };

  const tier = result ? tierFor(result.followers) : null;
  const bands = tier ? bandsFor(tier.expected) : null;
  const placed = result && bands ? positionOnStrip(result.rate, bands) : null;
  const band = placed && bands ? bands[placed.index] : null;
  const inRange = band ? band.id === "under" || band.id === "over" : false;

  return (
    <>
      <ToolOpening
        id="strip-title"
        frame="E0"
        tool="Test strip"
        glyph="teststrip"
        variant="strip"
        title={
          <>
            Engagement <span className="safe">test strip</span>
          </>
        }
        lede={
          <>
            Three figures make one exposure. The strip is stepped into the bands
            an audience of that size usually falls in, and the profile’s own
            rate is marked where it lands.
          </>
        }
        specs={[
          ["Takes", "Followers, average likes, average comments"],
          ["Formula", "(likes + comments) ÷ followers × 100"],
          ["Benchmarks", "Five audience tiers"],
        ]}
      />

      <section
        className="band band--tray strip-bench page-grid"
        aria-labelledby="strip-bench-title"
      >
        <Edge frame="E1" label="Exposure" />
        <div className="strip-bench__inner cols">
          <form className="strip-form" onSubmit={calculate} noValidate>
            <h2 id="strip-bench-title" className="strip-form__title">
              Expose
            </h2>
            <p className="strip-form__intro">
              Use averages from the last ten to twelve posts. Pinned posts and
              one-off giveaways skew the figure.
            </p>

            <NumberField
              id="er-followers"
              label="Followers"
              value={followers}
              onChange={setFollowers}
              placeholder="48,210"
              error={errors.followers}
            />
            <div className="strip-form__pair">
              <NumberField
                id="er-likes"
                label="Average likes"
                value={likes}
                onChange={setLikes}
                placeholder="1,200"
                error={errors.likes}
              />
              <NumberField
                id="er-comments"
                label="Average comments"
                value={comments}
                onChange={setComments}
                placeholder="45"
                error={errors.comments}
              />
            </div>
            <button type="submit" className="btn btn--safe btn--wide">
              <Glyph name="teststrip" size={18} />
              Expose the strip
            </button>
          </form>

          <div className="strip-result" aria-live="polite">
            {result && tier && bands && placed && band ? (
              <>
                <div className="strip-result__readout">
                  <Reading
                    value={fmtRate(result.rate)}
                    label="Engagement rate"
                    tone={inRange ? "developed" : "ghost"}
                    size="l"
                  />
                  <div className="strip-result__verdict">
                    <p className="strip-result__band label">
                      Step {placed.index + 1} of 4 · {band.name}
                    </p>
                    <p>{band.verdict}</p>
                  </div>
                </div>

                <figure className="strip" aria-labelledby="strip-caption">
                  <div className="strip__plate">
                    <ol className="strip__steps" role="list">
                      {bands.map((b, i) => (
                        <li
                          key={b.id}
                          className="strip__step"
                          data-band={b.id}
                          aria-current={i === placed.index ? "true" : undefined}
                        >
                          <span className="strip__step-n label">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="strip__step-name">{b.name}</span>
                          <span className="strip__step-range label">
                            {i === bands.length - 1
                              ? `over ${fmtRate(b.from)}%`
                              : `${fmtRate(b.from)} – ${fmtRate(b.to)}%`}
                          </span>
                        </li>
                      ))}
                    </ol>
                    <div
                      className="strip__mark"
                      style={{ "--pos": placed.pos } as React.CSSProperties}
                      aria-hidden="true"
                    >
                      <span className="strip__mark-line" />
                      <GreaseNote
                        tone={inRange ? "amber" : "cyan"}
                        tilt={-6}
                        className="strip__mark-note"
                      >
                        {fmtRate(result.rate)}%{placed.off ? " ▸" : ""}
                      </GreaseNote>
                    </div>
                  </div>
                  <figcaption id="strip-caption" className="strip__caption">
                    <span className="label">
                      Tier {tier.label} · baseline {fmtRate(tier.expected)}%
                    </span>
                    <span>
                      {fmtRate(result.rate)}% lands on step {placed.index + 1},{" "}
                      {band.name.toLowerCase()}
                      {placed.off ? ", past the end of the strip" : ""}.
                    </span>
                  </figcaption>
                </figure>

                <p className="strip-result__working">
                  <span className="label">Working</span>
                  <code>
                    ({result.likes.toLocaleString("en-US")} +{" "}
                    {result.comments.toLocaleString("en-US")}) ÷{" "}
                    {result.followers.toLocaleString("en-US")} × 100 ={" "}
                    {result.rate}%
                  </code>
                </p>
              </>
            ) : (
              <div className="strip-result__empty">
                <div className="strip strip--blank" aria-hidden="true">
                  <ol className="strip__steps" role="list">
                    {["01", "02", "03", "04"].map((n) => (
                      <li key={n} className="strip__step">
                        <span className="strip__step-n label">{n}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="state">
                  <span className="state__mark">
                    <Glyph name="teststrip" size={28} />
                  </span>
                  <div className="state__body">
                    <p className="state__title">Nothing exposed yet</p>
                    <p>
                      Enter the three figures and expose. The strip comes up
                      here, stepped for that audience size.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        className="band band--rebate strip-tiers page-grid"
        aria-labelledby="strip-tiers-title"
      >
        <Edge frame="E2" label="Benchmarks" />
        <div className="strip-tiers__inner cols">
          <div className="strip-tiers__notes">
            <h2 id="strip-tiers-title" className="strip-tiers__title">
              Five <span className="safe">tiers</span>
            </h2>
            <p>
              Larger audiences interact less per head. That is ordinary, not
              suspicious, so the strip is stepped against the baseline for the
              profile’s size, not against one number for everyone.
            </p>
            <p>
              The same baselines feed every report. A rate under a quarter of
              the baseline or over three and a half times it counts against the
              score. Everything between counts as ordinary.
            </p>
            <p className="text-2">
              Want the whole picture, not just one ratio?{" "}
              <Link href="/analyze">Put the profile in the tray</Link>.
            </p>
          </div>
          <div className="sheet strip-tiers__sheet">
            <div className="sheet__head">
              <span className="sheet__code">
                Table E2 · expected rate by audience size
              </span>
              <span className="sheet__title">Baselines</span>
            </div>
            <div className="table-wrap">
              <table className="datatable">
                <caption className="sr-only">
                  Expected engagement rate and band edges for each audience tier
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Followers</th>
                    <th scope="col" className="num">
                      Baseline
                    </th>
                    <th scope="col" className="num">
                      Far under below
                    </th>
                    <th scope="col" className="num">
                      Spike above
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TIERS.map((t) => (
                    <tr
                      key={t.id}
                      aria-current={tier?.id === t.id ? "true" : undefined}
                      className="strip-tiers__row"
                    >
                      <th scope="row" className="mono">
                        {t.label}
                      </th>
                      <td className="num">{fmtRate(t.expected)}%</td>
                      <td className="num text-cyan">
                        {fmtRate(t.expected * LOW_CUT)}%
                      </td>
                      <td className="num text-cyan">
                        {fmtRate(t.expected * HIGH_CUT)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="field strip-field">
      <label className="field__label" htmlFor={id}>
        <span>{label}</span>
        <span className="req" aria-hidden="true">
          Required
        </span>
      </label>
      <input
        id={id}
        className="input strip-field__input"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className="field__error">
          <Glyph name="warning" size={16} />
          {error}
        </p>
      ) : null}
    </div>
  );
}
