# isshereal.com: Concept and Art Direction

Stage 1 of 6. Direction B, "The Darkroom", chosen on 2026-10-30 from three
directions (A: Document Lab, B: Darkroom, C: Natural History of Fakes).
Approved decisions here govern every later stage. Later stages must read this
file first and must not invent a new direction on top of it.

---

## 1. Concept

**isshereal is a darkroom for the social internet. Every profile is a photo
being developed, and only what is real comes through.** You drop a profile
in the tray and the audience surfaces like an image in developer: genuine
followers come up as solid grain, while bought and automated ones never
develop and stay as ghostly gaps in the print.

The site takes its material world from analog photography and photo
forensics: safelight red, developer trays, film edge markings, contact
sheets marked in grease pencil, test strips, light boxes, negative sleeves,
and the enlarger. It sits in the tradition of the photograph as evidence,
from the press darkroom to the moment in *Blow-Up* when an enlargement
reveals what nobody saw.

---

## 2. References

1. **Michelangelo Antonioni, *Blow-Up* (1966)**: a photographer enlarges a
   print again and again until the grain shows what really happened. We take
   the enlargement as the way to drill into evidence: any part of a report
   can be "blown up" into finer grain.
2. ***Magnum Contact Sheets* (Kristen Lubben, Thames & Hudson, 2011)**:
   photographers' grease-pencil circles, crosses, and crop marks on strips
   of frames. We take the contact sheet as the layout for every list of
   profiles, and grease-pencil marks as the only hand-drawn element.
3. **Kodak technical data sheets and 35 mm film edge printing**: frame
   numbers, DX codes, emulsion numbers, and the dense, exact tables of
   1970s Kodak technical publications. We take the data typography, edge
   markings as section labels, and the tone of a technical sheet for docs
   and legal pages.
4. **Weegee's 1940s New York press photographs and the tabloid front pages
   they ran on**: hard flash, deep black, and tall condensed headlines set
   at shouting size. We take the condensed display type at extreme scale and
   the high-contrast, single-flash lighting on photographs.
5. **Errol Morris, *The Thin Blue Line* (1988)**: re-examining evidence
   slowly, with stylized close-ups and a patient, unsensational voice. We
   take the pacing of the reveal and the restraint of the copy.

---

## 3. Signature Moment

**The print develops.**

When a visitor submits a handle, the report does not load: it develops.
The profile's portrait sits face up in a developer tray under safelight.
The liquid moves gently across it. Over about three seconds the image comes
up out of blank paper, grain by grain:

- Each grain cell stands for a sampled follower. **Genuine followers develop
  fully** into warm, dense grain.
- **Bought and automated followers never develop.** They stay as pale
  ghosts in the print, so the portrait comes out visibly incomplete, with
  gaps exactly as large as the fake share of the audience.
- Two counters under the tray tick in tabular figures as it develops:
  "Developed 33%" in fixer amber, "Ghost 67%" in film cyan.
- When the image is done, the "fixer" step finishes: the tray's liquid stops
  moving, the print lifts out of the tray onto the page, and the report
  continues below it. The verdict is written on the print's white border in
  grease pencil.

**The enlarger (secondary).** Any ghost region of a print can be blown
up. Clicking or tapping it zooms into that area of grain, *Blow-Up* style,
and the individual cells resolve into the actual flagged accounts (creation
date, posts, follows, cluster). This is how a visitor goes from the overall
picture to the evidence.

**On the home page**, the hero runs the development once on an example
profile when it scrolls into view, with a "Develop again" control and three
example profiles on a contact strip that each develop on selection.

**Build notes.**

- The develop effect is a WebGL fragment shader (OGL, about 8 KB) that
  takes a per-cell mask texture generated from the real/fake split and
  sampled follower data, a portrait luminance texture, a development
  progress uniform, and a subtle animated liquid refraction. The cell layout
  is deterministic from the handle, so a given report always develops the
  same way and the proportions are honest.
- **Fallback:** a Canvas 2D grid renderer (as in the Stage 1 sketch) when
  WebGL is unavailable, and a static pre-rendered still for no-JS.
- The shader pauses when off-screen (IntersectionObserver) and stops
  entirely once the print is fixed.
- The development runs while the audit request is actually in flight. If the
  data arrives in under three seconds, development finishes at its normal
  pace; if it takes longer, the print holds at a faint latent image with the
  liquid still moving and the log reporting progress, so the loading state
  is the signature itself and never a spinner.
- **Accessibility:** the print is a `<canvas role="img">` with a text
  alternative stating the real and ghost percentages; the counters live in
  an `aria-live="polite"` region updated at start and finish only; the
  enlarger is reachable as a list of ghost clusters with buttons.
- **Reduced motion:** no liquid and no grain animation. The print appears
  fully developed, with a static before and after (latent image beside the
  finished print) and the counters at their final values.

---

## 4. Type Direction

### Display: Big Shoulders Display (Patric King, Chicago Design Studio)

- **Source:** Google Fonts, variable, weights 100 to 900.
- **Why:** tall, narrow, and industrial, cut from the vernacular of
  Chicago's signage and the condensed headline faces of mid-century
  tabloids. Set in uppercase at 10 to 18vw, it shouts like a Weegee-era front
  page, and its narrow proportions fit very large words into short lines.
  It also matches the condensed lettering of film edge markings.
- **Use:** uppercase, weight 900 for headlines, 700 for section heads,
  leading 0.84 to 0.9, tracking -0.01em at display sizes, +0.02em at 32 px
  and below. A thin weight (300) is used once per page for large numerals.

### Text: Newsreader (Production Type)

- **Source:** Google Fonts, variable, optical sizes 6 to 72, weights 200 to
  800, with italics.
- **Why:** a text serif made for reading on screens in long-form
  journalism. It gives the reports the patient, credible voice of an
  investigative feature (the Errol Morris register) against the shouting
  headlines, and optical sizing keeps it crisp at small sizes on dark
  backgrounds. Body at 1.125 to 1.1875rem, leading 1.6, measure 64ch.
  Italic carries emphasis and the examiner's asides.

### Data and edge marks: IBM Plex Mono (Mike Abbink, Bold Monday for IBM)

- **Source:** Google Fonts, weights 300 to 700.
- **Why:** frame numbers, percentages, counters, handles, dates, API
  specimens, and every film-edge label. Its engineered, slightly
  typewriter-like construction matches Kodak data sheets, it is tabular by
  default, and its distinct `0` and `O`, `l` and `1` matter when reading
  handles that swap look-alike characters. Labels in uppercase at 11 to
  12 px with +0.14 to 0.18em tracking.

### Grease pencil

No fourth font. Grease-pencil annotations (verdicts on print borders,
circles on contact sheets) are hand-drawn SVG strokes with Big Shoulders
Display 700 for the handwritten words, rotated 3 to 8 degrees. If this reads
too typeset in Stage 4, the words become drawn SVG paths for the small fixed
set of verdicts.

Contrast logic: a condensed 20th-century headline grotesk, a contemporary
screen-reading serif, and an engineered monospace. One shouts, one
explains, one measures.

---

## 5. Color Direction

Source: **a working darkroom under safelight**. The red-brown dark of the
room, the safelight's glow on wet paper, the amber of fixer and old developer
bottles, and the cold cyan of film base seen on a light box.

| Role | Name | OKLCH (approx.) | Use |
|---|---|---|---|
| Dominant field | Darkroom | `oklch(0.17 0.02 30)` | Page background everywhere in the default theme |
| Raised surface | Tray | `oklch(0.23 0.03 28)` | Trays, panels, inputs, contact sheet base |
| Deep surface | Film Rebate | `oklch(0.12 0.015 30)` | Contact sheets, code panels, the footer |
| Primary text | Print White | `oklch(0.9 0.035 50)` | Headlines, body text (warm, never pure white) |
| Secondary text | Wet Print | `oklch(0.72 0.04 40)` | Secondary text, labels, captions (passes AA on Darkroom) |
| Accent 1, ambient | Safelight Red | `oklch(0.6 0.2 28)` | The atmosphere: glows, the brand mark, focus rings, primary controls, large headline words |
| Accent 2, signal | Fixer Amber | `oklch(0.8 0.14 75)` | Genuine, developed, positive results, grease pencil |
| Signal | Film Cyan | `oklch(0.78 0.09 210)` | Ghost, fake, flagged, missing data |

- **Semantic rule:** amber means developed and real, cyan means ghost and
  fake, and red is the room itself and never a result. A fake result is
  shown as cold and absent, not as an alarm, which keeps the tone calm for
  people checking someone they care about.
- Safelight Red text is used only at 24 px and above, or at a lighter step
  of about `oklch(0.7 0.17 28)` for smaller text and focus rings, to meet AA.
- Neutrals all carry hue 28 to 50 so the dark reads as a red-lit room, not as
  a gray dashboard. No pure black or white anywhere.
- P3 overrides so the safelight and fixer genuinely glow on capable
  screens: Safelight to around `oklch(0.62 0.24 28)`, Amber to around
  `oklch(0.82 0.17 75)`.
- Platform brand colors are removed from the UI; platforms are identified by
  custom glyphs printed like film edge codes.
- The current emerald palette is retired.

---

## 6. Theme

**Dark is the default, because the subject is a darkroom.** Development
only happens in the dark, and the safelight atmosphere is the brand. It also
separates isshereal from every pale trust-and-safety tool in the category.

**Light mode is reinterpreted as "Lights on."** The existing theme toggle
becomes a darkroom light switch. Turning it on shows the finished prints in
daylight: warm fiber-based print paper `oklch(0.95 0.015 80)`, near-black
silver-gelatin ink `oklch(0.2 0.015 40)`, amber deepened to
`oklch(0.55 0.13 70)` and cyan deepened to `oklch(0.5 0.09 215)` for
contrast, and safelight red reduced to a thin rule and the brand mark. This
mode respects `prefers-color-scheme: light` and serves people who find
dark pages hard to read. Prints keep their grain and grease pencil in both
modes; only the room changes. The footer stays dark in both modes, as the
darkroom door.

**Tone check for sensitive use cases.** Because dark can feel ominous, the
dating-safety and marketplace pages lean on Newsreader body copy at generous
size, warm Print White text, and plain reassuring language, and the
"Lights on" toggle is visible in the header on those pages.

---

## 7. Layout Intent

### The grid

A **12-column grid with a film rebate**: 12 content columns framed by a
narrow edge column on each side (`edge-start`, `content-start`,
`content-end`, `edge-end`, plus `bleed-start` and `bleed-end`). The edge
columns carry film-edge markings (frame numbers, section codes, a running
"ISSHEREAL 5063" emulsion code) the way a film strip does, which doubles as
section navigation on desktop. Prints sit slightly rotated, overlap their
neighbors, and bleed off the page edge.

Section rhythm alternates between three registers: **Tray** (one large
image, slow, full attention), **Contact sheet** (dense rows of small frames
and data), and **Data sheet** (technical tables and long reading on the Film
Rebate surface). Headlines regularly run across 10 or more columns at
display scale, and long-form passages narrow to 6 columns.

### What is removed

The centered hero with two buttons, the three and six-card feature grids,
the FAL 3D illustration tiles, pill badges with sparkle icons, the FAQ
accordion, logo walls, and Lucide icons.

### Page by page

**Home `/`**
1. *Hero (Tray).* Left 5 columns: "WHAT'S REAL COMES THROUGH." in Big
   Shoulders at up to 14vw, with "COMES THROUGH." in Safelight Red, one
   Newsreader line, and the handle input styled as a film label with the
   button "Develop". Right 7 columns bleeding off the edge: the developer
   tray running the signature on an example profile, counters underneath,
   edge markings in the rebate.
2. *Contact strip (Contact sheet).* Three example profiles as frames
   on a strip: an obvious fake, a mixed case, a genuine creator. Selecting
   one develops it in the hero tray. Grease-pencil circle on the fake.
3. *How a print comes up (Data sheet).* The examination as a four-step
   development process laid out like a processing chart on a data sheet:
   Develop, Stop, Fix, Examine, each with its real timing and what is
   measured. Replaces How It Works.
4. *The enlarger (Tray, full bleed).* One huge enlargement of a ghost
   region filling the screen, the grain resolving into flagged accounts as
   the visitor scrolls, with one sentence at display scale: "ENLARGE ANY
   GAP." Demonstrates the secondary signature.
5. *Darkroom equipment (Contact sheet).* The four tools (bulk, compare,
   engagement rate, hashtags) as one dense row of equipment frames, each
   with a printed glyph, what it measures, and an edge-coded link. Replaces
   Features and Tools grids.
6. *Who uses the darkroom (asymmetric).* Four use cases as four prints
   pinned on a drying line across the page, slightly overlapping, each
   captioned in grease pencil; selecting one brings it forward with its
   case summary.
7. *Proof wall.* Verified audits as a wall of developed prints of mixed
   sizes with their ghost percentages, replacing the Verified Audits Grid
   and Sample Reports.
8. *Questions (Data sheet).* FAQ as a technical Q&A sheet: numbered
   questions in Big Shoulders 700, answers in Newsreader, all open.
9. *Footer (Film Rebate).* A full-width film strip of the most recent
   public examinations, sitemap set as an edge-coded index, and the legal
   line in Plex Mono.

**Analyze `/analyze`**
The loading bench. One wide film-label input at top with automatic
platform detection shown as an edge code, optional purpose fields (dating,
hiring, buying, brand deal) as labeled chips, and an empty tray waiting
below with "Nothing in the tray yet." Submitting starts development in place
and continues into the report without a page change, via the View
Transitions API.

**Report `/report/[id]`** (the most important product page)
1. *The print.* The developed portrait, large, lifted out of the tray onto
   the page, with the verdict written in grease pencil on its white border
   and the frame number and date in the edge column.
2. *Readings.* Developed and Ghost percentages as huge thin numerals, plus
   the authenticity score as a densitometer reading.
3. *Enlargements.* The ghost clusters as a row of blow-ups, each opening
   the enlarger with the flagged accounts listed.
4. *Data sheet.* Fraud flags, audience estimate, engagement, growth history
   as a technical sheet; growth as a characteristic curve (the classic film
   density-over-exposure graph) drawn in amber with fake spikes in cyan; the
   radar chart becomes a set of test-strip bars.
5. *Examiner's note.* The AI summary set in Newsreader as a memo with a
   typed header.
6. *Related prints.* A contact strip.
7. *Share.* The share image is the developed print with its grease-pencil
   verdict, generated per report for the OG image.
Loading state: the latent image holding in the tray. Error state: a fogged
print (uniform gray-red veil) with "Fogged. The platform didn't answer, so
nothing was developed and nothing was guessed."

**Tools: Bulk `/tools/bulk`**: a contact sheet printer. Paste a list of
handles; each becomes a frame on a growing contact sheet and develops in
turn, with grease-pencil marks on the ones that come up mostly ghost.
Export as CSV.

**Tools: Compare `/tools/compare`**: a light box. Two negatives side by
side on a backlit cyan-white surface with a loupe that can be dragged across
both at once; a shared column of readings between them with the difference
marked in grease pencil.

**Tools: Engagement rate `/tools/engagement-rate`**: a test strip. Inputs
on the left as film labels; the result as a classic darkroom test strip of
stepped exposures, where each band is a platform benchmark tier and the
profile's own rate is marked on the strip.

**Tools: Hashtags `/tools/hashtags`**: a negative sleeve. Each hashtag
is a strip in an archival sleeve with its reach, saturation, and spam
readings printed along its edge; spammy tags come up as ghosts.

**Use cases** (`/use-cases/dating-safety`, `/hiring-freelancers`,
`/influencer-vetting`, `/marketplace-buyers`): each opens with a
headline-scale question in Big Shoulders ("IS THE PERSON YOU'RE MEETING ON
FRIDAY REAL?"), then one worked example developing in a tray, a red-flag
checklist printed as a data sheet, and an input. Each page has its own
edge code and a different example portrait, using the same palette.
Dating-safety and marketplace pages follow the tone check in Section 6.

**Top creators `/top-creators`**: an exhibition. The top three as large
framed prints at the top, then a dense ranked register in Plex Mono (rank,
handle, platform edge code, developed percentage, score) with sortable
columns and designed sort indicators.

**History `/history`**: the negative archive. Past examinations as
negative sleeves in a binder, one row per examination, with dates, frame
numbers, and a small thumbnail of each print. Empty state: an empty sleeve
page, "No negatives filed yet. Your first examination is filed here
automatically."

**API docs `/api-docs`**: a Kodak-style technical publication. Prose in
Newsreader on the left, request and response specimens in Plex Mono on
Film Rebate panels on the right, endpoints labeled with publication codes.

**About `/about`**: a long-form editorial in Newsreader at reading size,
with Big Shoulders pull quotes spanning the grid, one large Weegee-lit
photograph treatment, and an honest section on what a score can and cannot
show.

**Resources `/resources`**: a darkroom shelf. Guides listed as labeled
boxes of photo paper on a single long shelf of rows: title, length, and
topic as box labels.

**Contact `/contact`**: an envelope for prints. The form is a print
envelope with labeled fields; on success, the envelope flap closes and a
receipt with a reference number slides out.

**Privacy `/privacy` and Terms `/terms`**: technical data sheets with
numbered clauses, a sticky clause index in the edge column, and Plex Mono
section codes. Fully readable typography in the Lights on palette by
default on these two pages.

**404**: "Frame not exposed." A blank frame on a contact strip, with the
missing URL printed in the edge marking.

### Mobile

Recomposed rather than stacked. The edge columns become a single horizontal
film edge across the top of each section. On the home page, the tray comes
first at full width with the headline under it at 18vw, and the contact
strip scrolls horizontally with scroll snapping. The enlarger opens as a
full-screen sheet with pinch-to-zoom on the grain. Contact sheets become two
columns of frames, and registers become stacked record cards with the frame
number as the heading. Tap targets at least 44 px.

---

## 8. Imagery and Texture

**Photographs (avatars, creator portraits).** Every photo is treated as a
silver-gelatin print: converted to warm monochrome, pushed contrast as if
shot with a single hard flash, visible grain, and a white print border with
a slightly uneven edge. Under the default theme the print sits on the dark
with a faint safelight cast; in Lights on mode it is a plain warm print. No
full-color photography anywhere, which also hides inconsistent quality in
scraped avatars. Small avatars in lists become contact sheet frames with
frame numbers.

**Illustration and icons.** A custom SVG glyph set drawn like darkroom
equipment labels and film edge codes: 1.5 px strokes at 24 px, square
terminals, no fills. Platform glyphs (Instagram, TikTok, YouTube, dating,
marketplace, freelance) are printed as edge codes. Tool glyphs: tray,
enlarger, loupe, light box, test strip, sleeve, canister, timer. Status
glyphs: developed, ghost, fogged. Lucide and the FAL 3D images are retired.

**Grease pencil.** The single hand-drawn element: circles, crosses, arrows,
and short verdict words in Fixer Amber, drawn as SVG with a waxy texture
filter and stroke-dashoffset drawing. Used sparingly: verdicts, one circle
per contact sheet, a few annotations on the home page.

**Atmosphere.**
- The Darkroom field carries a soft safelight glow from one source at the
  top right of every page (a large radial gradient of Safelight Red at low
  opacity) and a weaker bounce at the bottom left. One light source across
  the whole site; all shadows fall down and to the left of it.
- Fine film grain over the whole page (SVG `feTurbulence`, animated only by
  a slow two-frame offset, disabled under reduced motion).
- Trays have a wet, slightly reflective surface: an inner highlight along
  the top edge and a sheen that moves only during development.
- Contact sheets and code panels use sprocket-hole edges and the darker Film
  Rebate surface.
- In Lights on mode, the glow disappears and pages carry fiber paper texture
  instead.

Contrast checks required in Stage 4: Wet Print text over grain and glow,
Safelight Red at every text size, Cyan and Amber labels on Tray and Film
Rebate surfaces, and grease pencil words over photographs.

---

## 9. Motion Personality

**Slow, chemical, exact.** Images come up the way they do in developer:
nothing, then a faint latent image, then everything at once. Controls
behave like darkroom equipment: switches click, timers tick, and nothing
bounces.

| Token | Meaning | Curve | Duration |
|---|---|---|---|
| `--ease-develop` | The print coming up, grain filling in, readings rising | `cubic-bezier(0.7, 0, 0.3, 1)` (slow start, fast middle, gentle finish) | 2400 to 3200 ms |
| `--ease-enter` | Staged entrances, headline line reveals, prints settling | `cubic-bezier(0.16, 1, 0.3, 1)` | 600 to 900 ms, 70 to 100 ms stagger |
| `--ease-switch` | State changes: tabs, toggles, sort, Lights on | `cubic-bezier(0.2, 0, 0, 1)` | 160 to 220 ms |
| `--ease-lift` | A print lifting out of the tray, enlarger zoom | `cubic-bezier(0.33, 0, 0.15, 1)` | 700 to 1000 ms |
| `--ease-grease` | Grease pencil strokes drawing on | `cubic-bezier(0.45, 0, 0.2, 1)` | 400 to 650 ms |
| Liquid | Tray slosh, only during development | `cubic-bezier(0.65, 0, 0.35, 1)`, alternating | 4500 ms per cycle |

Rules: the only ambient motion is the tray liquid during development and
the film grain, and both stop when the print is fixed. Counters tick in
steps like a darkroom timer rather than smooth tweens. Headlines reveal
line by line from behind a mask from the top, like an image coming up from
the bottom of the tray. Page transitions use the View Transitions API with
the print as the shared element from analyze to report. Reduced motion
keeps all information (prints fully developed, grease pencil drawn, before
and after shown statically) and removes travel, liquid, and grain movement.

---

## 10. Voice

The voice of a darkroom technician who also does forensic work: patient,
plain, dry, exact with numbers, and kind about the people in the pictures.
Short sentences. It describes what came through and what did not, and leaves
the judgment to the reader. No hype, no "unlock", no "seamless", no
"elevate", and no darkroom puns beyond the fixed vocabulary below.

Example lines:

1. Hero support line: "Drop a profile in the tray. Real followers develop
   into solid grain. Bought ones never come up."
2. Development log: "48,210 followers declared. 2,184 sampled. 1,140 came
   in during the same nine days. Holding for fixer."
3. Report caveat: "This print shows an audience, not a person. Ghosts can
   be bots, bought followers, or accounts that simply went quiet."

Fixed strings to carry forward:
- Submit button: "Develop"
- Replay: "Develop again"
- Readings: "Developed" and "Ghost"
- Theme toggle: "Lights on" / "Lights off"
- Empty tray: "Nothing in the tray yet. Paste a handle or link to start."
- Empty history: "No negatives filed yet. Your first examination is filed
  here automatically."
- Error: "Fogged. The platform didn't answer, so nothing was developed and
  nothing was guessed."
- 404: "Frame not exposed. Nothing was ever printed at this address."
- Score caveat: "A score is evidence about an audience, not a verdict on a
  person."

---

## Critique · 2026-10-30

Stage 6 review, run as an Awwwards juror against the built site. Checks were
**measured** in headless Chrome against `next build` + `next start`
(390×844, DPR 2, 4× CPU throttle, 1.6 Mbps / 150 ms network) and at
1440×900, in dark, light and reduced-motion modes. Not measured: real
devices, Safari/Firefox, Lighthouse scores, field INP.

### Scores

| | Before fixes | After fixes | Evidence |
|---|---|---|---|
| Design | 8.0 | 8.5 | Big Shoulders at 11–13vw over Newsreader and Plex Mono; one light source; consistent silver-print treatment across prints, frames, filmstrip and tray (`src/styles/atmosphere.css`). Before: cream slab under the hero from a `.strip` class collision with the tools page; headline at 16vw pushed the intake below the fold. |
| Usability | 6.5 | 8.5 | Before: `/analyze` CLS 0.58 (Suspense fallback swap), `/report` LCP 2.8 s / CLS 0.14 (client-only data), every page overflowed by 522 px on phones (sr-only labels escaping the footer filmstrip), light switch visible in the phone header, sticky tray covering the analyze form, self-targeting container queries that never fired, breadcrumbs showing list numbers. After: LCP 0.86–1.6 s and CLS ≤ 0.06 on every measured route; no horizontal overflow; keyboard focus visible on every stop. |
| Creativity | 8.5 | 8.5 | The develop engine (`src/components/darkroom/develop-engine.ts`): a WebGL print that comes up from blank paper with ghosts that never develop, seeded per handle, holding a latent image during requests. Grease-pencil verdicts, test strip, light box and negative sleeve all come from the subject. |
| Content | 7.5 | 8.5 | Before: copy implied each grain cell was a sampled follower, the report could show the API's placeholder numbers as a result, example data used the old voice and em dashes, and the privacy policy was vague about server caching. After: estimates are called estimates, placeholder results route to "type in the public numbers", the enlarger is labelled as an illustration, the example data has been rewritten, and the privacy clause states the 500-entry memory cache and the 24-hour edge cache. |

### Checklist (after fixes)

- Logo swap test: passes. Darkroom vocabulary, edge codes, developed/ghost readings and the print are specific to this product.
- Signature moment: finished. WebGL with Canvas 2D fallback, CSS still for no-JS and LCP, paused off-screen, DPR capped at 2, reduced motion draws the fixed print at once.
- Type: passes on desktop and phone; handle headlines scale with `clamp()` and wrap anywhere for very long handles.
- Palette: Darkroom dominant; safelight is the room, amber means developed, cyan means ghost; tokens only (`grep` finds no raw hex, rgb or oklch literal in any stylesheet).
- Layout: no centred hero, card trio or bento; the edge-column grid is broken deliberately on every page.
- Motion: every animation uses token easing and duration (`src/styles/motion.css`, `src/lib/motion-tokens.ts`); scroll scenes are CSS `view()`/`scroll()` behind `@supports`; no scroll-jacking.
- States: empty, latent (loading), fogged (error), 404, route error and phone layouts are designed.
- Accessibility: AA contrast computed for every token pair and every text-on-texture pair; muted text, paper labels and test-strip bands fixed; reduced motion verified.
- Performance: fonts self-hosted (latin subset) with three preloads and measured fallbacks; images go through next/image; known reports are server-rendered.
- Finish: `::selection`, SVG favicon, generated apple icon, `/api/og` share image (master at `design/og.svg`), `theme-color` for both schemes, and per-route metadata.

### Still open

1. **Theme default.** Per section 6, light-OS visitors land in "Lights on", so most of them never see the darkroom unless they flip the switch. Consider making the darkroom the default for everyone and keeping Lights on as the choice.
2. **API placeholder.** `/api/audit` returns `needsInput: true` with placeholder numbers (score 72, 67% developed). The front end no longer shows them, but the route should return null readings.
3. **Enlarger promise.** The concept's enlarger would resolve real flagged accounts. The data has no account-level samples, so report enlargements show causes instead, and the home enlarger is labelled as an illustration.
4. **Client navigations.** These have no view transition yet; full loads cross-fade (`@view-transition`), and state changes (Lights on, hero print swap) use the View Transitions API.
5. **Contact form.** It has no endpoint, so it hands off to email and says so.
6. **Testing.** Real-device and Safari testing are still to do; WebGL was only verified in headless Chrome.
