# Darkroom component kit

Reference for building pages. Read `design/CONCEPT.md` (the why) and
`design/tokens.css` (the values) first. Shared styles live in
`src/styles/components.css`; route-group composition lives in
`src/styles/pages/<group>.css`, always inside `@layer components { }`.

## Hard rules

- **No Tailwind.** Tailwind has been removed from the build; utility classes
  like `flex`, `pt-28`, `text-slate-500` do nothing. Write semantic class
  names and style them in the page group's CSS file.
- **No lucide-react.** Use `<Glyph name="..." />` from
  `src/components/darkroom/Glyph.tsx`. Add a glyph there only if none fits,
  in the same style (24px grid, 1.5px stroke, square caps, no fills).
- **Tokens only.** Every color, size, space, radius, shadow, easing and
  duration comes from a `var(--…)` in `design/tokens.css`. No hex, no px
  font sizes, no raw cubic-beziers. `color-mix()` on tokens is fine.
- **Semantic color.** Amber (`--c-amber`) = developed, genuine, positive.
  Cyan (`--c-cyan`) = ghost, fake, flagged, missing. Safelight red
  (`--c-safe`, `--c-safe-text` for small text) = the room, brand, primary
  action, focus. Red is never a result.
- **Honest copy.** Voice from CONCEPT.md section 10. Never claim accuracy
  percentages, "100% genuine", or "forensic AI" certainty. A score is
  evidence about an audience, not a verdict on a person. No "unlock",
  "seamless", "elevate", "empower", no exclamation marks.
- **Typography.** Headlines: `h1`/`h2`/`h3` are already Big Shoulders,
  uppercase. Body is Newsreader. Data, handles, numbers, labels: mono
  (`.label`, `.tabular`, `font-family: var(--font-mono)`). Use real
  quotes (’ “ ”) and en dashes in copy.
- **Accessibility.** One `h1` per page, logical heading order, a label on
  every control, `aria-pressed`/`aria-selected` on toggles and tabs, 44px
  touch targets, visible focus (already global).

## Page skeleton

```tsx
<section className="band band--tray page-grid" aria-labelledby="x-title">
  <Edge frame="14A" label="How a print comes up" />
  <div className="my-section cols">…</div>
</section>
```

- `.page-grid`: 12-column content track framed by film-edge columns
  (`edge-start`/`edge-end`) and bleed tracks. Direct children sit in
  `content`. Modifiers: `.bleed` (full width), `.to-bleed-end`
  (content start to right edge of the screen), `.from-bleed-start`,
  `.with-edges`.
- `.cols`: 12-column grid with `--col-gap`. Place children with
  `grid-column: 1 / span 7` etc. in the page CSS. Below about 56rem
  re-compose to a single column or a different order; do not just stack.
- `.band` vertical rhythm: `--tray` (largest, one object), `--contact`
  (tight, dense), default (data sheet). Vary them down a page. Add
  `.band--rule` for a top hairline, `.band--rebate` / `.band--tray-surface`
  for a different surface.
- `<Edge frame label />` puts a vertical film-edge marking in the edge
  column (sticky), and turns into a horizontal edge line on mobile. Give
  each section a different frame code (e.g. 02, 03A, 07…).
- Heading block: `.head` > `.head__kicker.label` + `h2.head__title`
  (wrap a word in `<span className="safe|ghost|amber">`) + `p.head__lede`.
- Display sizes outside headings: `.display-xl`, `.display-l`,
  `.display-m`, `.display-s`. `.lede` for large intro text.

## Components (src/components/darkroom/)

| Component | Use |
|---|---|
| `Glyph` | Icons. Also `platformGlyph(platform)` and `platformCode(platform)` ("IG", "TT", "YT", "DT", "MK", "FL"). |
| `Edge`, `Sprockets` | Film-edge marking; sprocket-hole row. |
| `Print` | A photo as a silver-gelatin print with white border, `tilt`, `frame`, grease `caption`. Uses next/image (srcset/sizes); pass real `width`/`height`. |
| `GreaseCircle`, `GreaseUnderline`, `GreaseCross`, `GreaseNote` | The single hand-drawn element. Use sparingly: one circle per contact sheet, verdict words on print borders. |
| `Reading` | Densitometer readout: thin numeral + label. `tone="developed" | "ghost" | "neutral"`, `size="s" | "m" | "l"`. |
| `DevelopTray` | The signature tray (report, home, use-case worked examples). Props: handle, followersLabel, realPct, fakePct, avatar, alt, frame. |

Shell pieces already exist: `Navbar` (exports `Wordmark`), `Footer`,
`ThemeToggle` (the "Lights on" switch), `Toast` (`toast(msg, type)`).

## CSS classes (src/styles/components.css)

- Buttons: `.btn` + `.btn--safe` (primary), `.btn--line` (secondary,
  supports `aria-pressed`), `.btn--quiet` (text). Sizes: `.btn--compact`,
  `.btn--wide`. All states (hover, active, focus, disabled) are styled.
- Fields: `.field` > `.field__label` (+ `.req`) + `.input` / `.select` /
  `.textarea` + `.field__hint` / `.field__error`. `aria-invalid="true"`
  styles the error state.
- Film label input (the primary "paste a handle" field): `.filmfield` >
  `.filmfield__code` (edge code + glyph) + `.filmfield__body` >
  (`label.filmfield__label` + `input.filmfield__input`) + `.btn.btn--safe`,
  optional `.filmfield__status[data-tone="error"]`.
- `.chips` > `button.chip[aria-pressed]`; `.tabs` > `button.tab[role=tab][aria-selected]`.
- Contact sheet: `.contact` > `.contact__frames` > `a.frame` / `button.frame`
  > `.frame__img` (img) + `.frame__code` + `.frame__title` + `.frame__sub`.
  `.contact` should usually carry `data-room="dark"` (film is dark in both themes).
- Data sheet: `.sheet` > `.sheet__head` (`.sheet__code` + `.sheet__title`).
  Tables: `.table-wrap` > `table.datatable` (`th.num`/`td.num` for figures,
  `.sort-btn[data-active]` with `sort-up`/`sort-down` glyphs). Specs:
  `dl.specs`. Signal lists: `ul.signals.signals--ghost|--developed` with a
  glyph per `li`.
- `.memo` (typed note on paper) with `dl.memo__head`, `.memo__body`, `.memo__sign`.
- States: `.state` (empty), `.state--fogged` (error), `.state--notice`;
  inner `.state__mark` (glyph box), `.state__body` > `.state__title` + `p` + actions.
  Loading skeletons: `.latent.latent--line` / `.latent--block`.
- `.crumbs` > `ol` (breadcrumb as edge line), `.prose` (editorial/legal),
  `.pull` (display pull quote), `.specimen` (code panel with
  `.specimen__head` and `pre`; token spans `.tok-key/.tok-str/.tok-num/.tok-com`).
- Small: `.tag` (`--developed`, `--ghost`, `--safe`), `.edgecode`,
  `.bar` > `.bar__fill` (amber developed share over a cyan ghost track),
  `.rule-micro`, `.dialog-sheet` (for `<dialog>`).
- Utilities: `.sr-only`, `.label`, `.tabular`, `.measure`, `.text-2`,
  `.text-safe`, `.text-amber`, `.text-cyan`.
- Scoped themes: `data-room="dark"` keeps a subtree in the darkroom
  palette; `data-room="light"` puts it in Lights-on (privacy/terms use this).

## Data

- `src/data/content.ts`: `SAMPLE_REPORTS` (fictional examples with avatars
  in `/images/avatars/`), `FAQS`, `CATEGORIES`, `PLATFORMS`.
- `src/data/verified-creators.ts`: `VERIFIED_CREATORS`, `getVerifiedCreator`.
- `src/lib/audit-engine.ts`: `calculateProfileScore`, `parseCount`,
  `formatCompactNumber`, type `AuditResult`.
- `src/lib/utils.ts`: `cn`, `formatNumber`, `scoreTone(score)`,
  `greaseVerdict(score)`.

Developed % = `realPct`; Ghost % = `fakePct`.

## Metadata

Client pages cannot export `metadata`. Add a sibling `layout.tsx` that
exports `metadata` (title uses the root template `%s · isshereal.com`,
plus description and openGraph) and renders `children`.
