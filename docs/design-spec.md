# Design specification: The Rail

Status: draft for review. No UI is implemented from this document until it is approved.

Direction: The Rail, approved as the portfolio concept. The page is a timetable. A year index sits on the left. One chapter sits on the right. The active year is marked by an orange stamp and a tinted row. That mark is visible with animation turned off.

Source files: `content/profile.json`, `content/experience.json`, `content/projects.json`, `content/skills.json`. There is no `content/preferences.json`. Every content record still has `approvalStatus: "pending"` and `publicDisplay: false`. This specification defines the editorial allowlist for version 1. Publishing the words still requires a separate content approval.

## 1. Art direction and design principles

The page is a record of years, read like a course timetable. It is not a campaign site and not a project gallery.

Principles:

1. The year index is the only navigation.
2. One chapter is open. The others are not summarized underneath it.
3. The selected year is recognizable while the page is still: an 8px `#E24B2A` stamp in a reserved gutter, and a `#DDD7C8` row fill.
4. Text is left-aligned. Nothing in the chapter is centered.
5. Corner radius is 0. Drop shadows are not used.
6. Orange is a position mark. It is not a text color.
7. A chapter shows only fields that exist for that entry. Interview notes, missing-proof sentences, location, German study, and Hacktoberfest are not chapters.
8. An empty project list does not create a showcase, an empty card, or a placeholder illustration.
9. Motion only changes which row is marked and the opacity of the incoming chapter. The geometry is the same before and after.

Version 1 chapters, top to bottom:

| Order | Content id | Rail primary | Rail secondary | Opens by default |
| --- | --- | --- | --- | --- |
| 1 | `college-computer-engineering` | 2017–2021 | College | No |
| 2 | `university-computer-engineering` | 2021–2024 | Bachelor | No |
| 3 | `valiwo` | 2023–2024 | Valiwo | No |
| 4 | `full-stack-open` | May 16 | Course | No |
| 5 | `now` | 2026 | Now | Yes |

`now` is built from `profile.json` (`identity`, `currentStatus`, `careerGoals`). It is not an experience entry.

Excluded from the rail:

- `german-study`
- `hacktoberfest-2026`
- `relocation`
- `location`
- `audience`

`location.showOnSite` is false. City and country are not rendered.

## 2. Color tokens

All colors are flat. No gradients, no translucency, no backdrop blur.

| Token | Hex | Use |
| --- | --- | --- |
| `--field` | `#E7E2D6` | Page background, folio, rail, chapter |
| `--ink` | `#121212` | Primary text, structural borders, focus ring |
| `--ink-secondary` | `#5C574E` | Meta, eyebrows, secondary folio text, unselected year labels |
| `--stamp` | `#E24B2A` | 8px position mark only |
| `--row` | `#DDD7C8` | Hover row and selected row fill |
| `--rule` | `#B7B1A4` | Dividers between year rows |

Contrast on `--field`:

- `--ink` on `--field`: 14.49:1
- `--ink-secondary` on `--field`: 5.55:1 (passes WCAG AA for normal text)
- `--ink` on `--row`: 13.05:1
- `--stamp` on `--field`: 3.08:1 (passes WCAG non-text contrast at the 3:1 threshold)

`--stamp` is forbidden on type, icons that contain words, and any text smaller than 24px. "Open to work" is `--ink`.

## 3. Typography

Two families, loaded from Google Fonts with `display=swap`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600&family=Literata:opsz,wght@7..72,400;7..72,600&display=swap" rel="stylesheet" />
```

| Token | Stack |
| --- | --- |
| `--font-index` | `"Barlow Condensed", "Arial Narrow", Impact, sans-serif` |
| `--font-chapter` | `Literata, Georgia, "Times New Roman", serif` |

Weights in use: Barlow Condensed 500 and 600. Literata 400 and 600. No other weights.

Sizes are fixed at each breakpoint. The rail numerals do not fluid-scale, so the index keeps a constant rhythm.

### Desktop, viewport width 1100px and above

| Role | Family | Weight | Size / line-height | Tracking | Color |
| --- | --- | --- | --- | --- | --- |
| Folio name | index | 600 | 22px / 24px | 0.08em | `--ink` |
| Folio title | index | 500 | 13px / 16px | 0.12em | `--ink-secondary` |
| Folio availability | index | 600 | 13px / 16px | 0.12em | `--ink` |
| Year primary | index | 500 | 40px / 36px | 0 | `--ink` |
| Year secondary | index | 500 | 13px / 16px | 0.12em | `--ink-secondary` |
| Chapter eyebrow | index | 500 | 12px / 16px | 0.14em | `--ink-secondary` |
| Chapter title | chapter | 600 | 40px / 48px | 0 | `--ink` |
| Chapter meta | chapter | 400 | 16px / 24px | 0 | `--ink-secondary` |
| Chapter body | chapter | 400 | 18px / 28px | 0 | `--ink` |
| Project name | chapter | 600 | 28px / 36px | 0 | `--ink` |
| Skill names | chapter | 400 | 18px / 28px | 0 | `--ink` |

### Tablet, 700px–1099px

| Role | Change from desktop |
| --- | --- |
| Folio name | 18px / 20px |
| Year primary | 28px / 28px |
| Year row height | 64px |
| Chapter title | 32px / 40px |
| Chapter body | 17px / 26px |
| Project name | 24px / 32px |

All other roles stay at desktop values.

### Mobile, 699px and below

| Role | Size / line-height |
| --- | --- |
| Folio name | 20px / 22px, weight 600, tracking 0.06em |
| Folio title and availability | 13px / 16px |
| Year primary | 28px / 28px |
| Year secondary | 13px / 16px |
| Chapter title | 32px / 40px |
| Chapter body and skill names | 17px / 26px |
| Project name | 24px / 32px |

Folio, eyebrow, and year-secondary strings are uppercase. Chapter titles, body, organization names, and skill names use the source casing.

`font-synthesis: none`. Buttons inherit the index font only inside the rail and folio. Chapter text does not inherit the condensed face.

## 4. Spacing scale

| Token | Value |
| --- | --- |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |

No spacing value outside this scale, except the structural sizes in the grid section (rail width, folio height, stamp thickness, year-row height).

## 5. Grid and content widths

The shell is a viewport grid. It does not scroll as a document. The rail and the chapter scroll on their own.

### Desktop, 1100px and above

```text
grid-template-rows: 72px minmax(0, 1fr);
grid-template-columns: 320px minmax(0, 1fr);
height: 100dvh;
```

| Region | Position | Width | Padding |
| --- | --- | --- | --- |
| Folio | row 1, both columns | 100% | 0 24px |
| Rail | row 2, column 1 | 320px | 0 |
| Chapter | row 2, column 2 | remaining | 48px 64px 96px |

Chapter text block: `max-width: 640px`, `margin: 0`. It starts 64px to the right of the rail. Extra viewport width stays empty `--field` to the right of the 640px block. The block is not centered.

Distance from the folio's bottom border to the first chapter eyebrow: 48px.

Distance from the rail's right border to the chapter text: 64px.

### Tablet, 700px–1099px

```text
grid-template-columns: 220px minmax(0, 1fr);
grid-template-rows: 64px minmax(0, 1fr);
```

Folio height 64px, folio padding `0 16px`. Chapter padding `32px 32px 64px`. Text `max-width: 640px`, which means the column itself is the limit (about 480px at 700px viewport).

### Mobile, 699px and below

```text
grid-template-columns: minmax(0, 1fr);
grid-template-rows: auto 88px minmax(0, 1fr);
```

| Region | Row | Padding |
| --- | --- | --- |
| Folio | 1 | 12px 16px |
| Rail | 2 | 0 |
| Chapter | 3 | 24px 16px 48px |

Chapter text uses the full content width inside that padding. `max-width: 640px` still applies and does not change the mobile layout.

## 6. Border, radius, and shadow

| Edge | Rule |
| --- | --- |
| Folio bottom | 1px solid `--ink` |
| Rail right, desktop and tablet | 1px solid `--ink` |
| Rail bottom, mobile only | 1px solid `--ink` |
| Year row bottom | 1px solid `--rule` |
| Project image, when one exists | 1px solid `--ink` |

Radius: `0` on the page, buttons, links, images, and focus rings.

Drop shadow: none.

Focus ring, used because a left-edge outline would be clipped:

```css
box-shadow: inset 0 0 0 2px var(--ink);
```

The stamp is not a shadow and not a border-radius. It is an 8px column (desktop and tablet) or an 8px row (mobile) painted `--stamp`.

## 7. Desktop, tablet, and mobile layouts

### Shared vertical order inside a chapter

1. Eyebrow, 12px index face.
2. 8px.
3. Title, chapter face.
4. 16px.
5. Meta line. Parts are joined with ` · ` (space, middle dot, space).
6. 32px.
7. Body paragraphs. Adjacent paragraphs are 16px apart.
8. Skills block, Now chapter only, 48px below the body.
9. Projects that name this chapter, 48px below the previous block.

### Desktop and tablet

The folio is one row, vertically centered (`align-items: center`), `gap: 32px`.

```text
| 24px | OLEKSANDR DMYTRUK | 32px | JUNIOR FULLSTACK DEVELOPER ........ OPEN TO WORK | 24px |
```

The availability label is `margin-left: auto`, so it sits on the right edge padding. The name and title stay on the left and do not stretch.

The rail is a column of rows. Each row is 88px tall on desktop and 64px tall on tablet. Rows are flush. There is no heading inside the rail.

```text
| 8px stamp | 20px | 2017–2021          |
|           |      | COLLEGE            |
```

The stamp column is 8px wide on every row, including unselected rows, so labels do not jump when the selection changes. Unselected stamp cells are `--field`. Selected stamp cells are `--stamp`.

### Mobile

The folio wraps.

```text
OLEKSANDR DMYTRUK
JUNIOR FULLSTACK DEVELOPER          OPEN TO WORK
```

The name is `flex: 1 0 100%`. The second line is a row with `justify-content: space-between` and `width: 100%`. Row gap inside the folio is 4px.

The rail is a horizontal scroller, 88px tall:

```css
display: flex;
overflow-x: auto;
scroll-snap-type: x mandatory;
```

Each year button is `flex: 0 0 auto`, `min-width: 148px`, `height: 88px`, `scroll-snap-align: start`, with a 1px `--rule` border on the right. The stamp is the top 8px of every button (`grid-template-rows: 8px 1fr`). Unselected stamp cells stay `--field`.

The chapter fills the remaining viewport height and scrolls vertically.

## 8. Navigation behavior

The rail is a tab list. The chapter is the tab panel. There is no second menu and no router.

- Element: `nav` with `aria-label="Record"`.
- The list: `role="tablist"`. `aria-orientation` is `vertical` at 700px and above, and `horizontal` below 700px.
- Each control is a `button type="button"` with `role="tab"`, `aria-selected`, and `aria-controls="chapter"`.
- The open chapter has `role="tabpanel"`, `id="chapter"`, `aria-labelledby` set to the selected tab, and `tabindex="0"` because the panel may contain no links.
- `aria-live="polite"` is not on the panel. The tab pattern already exposes the selected name. A live region would repeat it.

Keyboard, when focus is on a year button:

| Key | Vertical rail | Horizontal rail |
| --- | --- | --- |
| Arrow Up, Arrow Left | Previous year | Previous year |
| Arrow Down, Arrow Right | Next year | Next year |
| Home | First year | First year |
| End | Last year | Last year |

Those keys call `preventDefault` so the page underneath does not scroll. Focus does not wrap. On the first year, Previous does nothing. On the last year, Next does nothing.

Arrow keys move focus and change the open chapter in the same step. Tab moves into the rail, through the chapter panel, then out. Only the selected tab has `tabindex="0"`. The others have `tabindex="-1"`.

Changing the year runs `history.replaceState` to `#<id>`. On load, a hash that matches a rail id opens that chapter. Any other hash, including an empty one, opens `now`. This does not add a routing library.

Pointer: click or tap selects the year. On mobile, horizontal swipe scrolls the rail. Swipe on the chapter does not change the year. The chapter must remain a vertical reading pane.

The selected button calls `scrollIntoView({ block: "nearest", inline: "nearest" })` so a mobile selection at the edge of the scroller becomes visible. `prefers-reduced-motion: reduce` uses `behavior: "auto"`.

## 9. Folio, in the hero position

There is no hero band, no portrait, and no centered headline. The folio is the top 72px (desktop), 64px (tablet), or the two-line block (mobile). It is the only introduction.

Exact strings:

| Slot | String |
| --- | --- |
| Name | OLEKSANDR DMYTRUK |
| Title | JUNIOR FULLSTACK DEVELOPER |
| Availability | OPEN TO WORK |

The document `<title>` is `Oleksandr Dmytruk`.

Contact, when a public link exists later, is a text link 24px to the left of `OPEN TO WORK`, same baseline, index face 13px / 16px, weight 500, `--ink`, underline offset 3px. Version 1 has no contact value, so that slot is not rendered and `OPEN TO WORK` keeps the right edge.

## 10. Project showcase and case study

`projects.json` has an empty `projects` array. Version 1 renders no project heading and no empty state.

When a project object is later added, it must include `chapterId` equal to a rail id. Projects without a matching chapter are not shown. Projects render inside that chapter, 48px below the body or skills block. They stack in array order with 48px between them. They are not cards and not a grid.

Each project block:

| Piece | Distance above it | Type |
| --- | --- | --- |
| Eyebrow `Project` | 48px from the previous block | 12px index, tracking 0.14em |
| Name | 8px | 28px / 36px Literata 600, desktop |
| Contribution paragraph | 16px | 18px / 28px |
| Stack | 16px | 16px / 24px Literata 400, `--ink-secondary`, names separated by `, ` |
| Links | 16px | Inline, 24px gap |

Link labels are the words `Repository` and `Demo`, used only when `repositoryUrl` or `demoUrl` is a non-empty `http` or `https` URL. The link is `--ink`, `text-underline-offset: 3px`, `text-decoration-thickness: 1px`.

A case study is the same project block plus up to three more sections, 32px below the links, 24px apart: `Problem`, `What I did`, `Result`. A section is omitted when its string is missing or blank. Each section is an eyebrow plus 8px plus an 18px / 28px paragraph.

One optional image sits 24px below the last section: displayed width 100% of the text column up to 640px, aspect-ratio 4 / 3, `object-fit: cover`, 1px solid `--ink`, radius 0. No image caption row. The `alt` attribute is required. If `alt` is missing, the image is not rendered.

## 11. About, experience, and contact

These are not routes.

| Conventional section | Where it lives |
| --- | --- |
| About | The folio plus the `now` chapter |
| Experience | The four record chapters: College, Bachelor, Valiwo, Course |
| Contact | The folio's right cluster, omitted until a public href exists |
| Skills | Inside `now` only, under the body |

### Chapter copy

Interview sentences in `details` are not rendered. The body copy below is the version 1 text.

**College**

- Eyebrow: College
- Title: Computer Engineering
- Meta: `2017–2021 · Finished`
- Body: Khmelnytskyi Polytechnic Professional College by Lviv Polytechnic National University.

**Bachelor**

- Eyebrow: Bachelor
- Title: Computer Engineering
- Meta: `2021–2024 · Finished`
- Body: Khmelnytskyi National University.

**Valiwo**

- Eyebrow: Valiwo
- Title: Frontend developer
- Meta: `2023–2024`
- Body: Small company. Joomla, JavaScript, and themes for websites.

**Course**

- Eyebrow: Course
- Title: Full Stack Open
- Meta: `May 16 – September 2026 · University of Helsinki`
- Body: Full Stack Open at the University of Helsinki.

The course body does not mention a certificate, completed parts, or a course project. Those were not in the record.

**Now**

- Eyebrow: Now
- Title: Searching
- Meta: Junior Fullstack Developer
- Body: Searching for a full-time role and internships.

Skills follow 48px later. The eyebrow is `Tools`. Each group from `skills.json` keeps its label and order: Languages & web, Frontend, Backend & APIs, Data, Testing & tools. Group label is the chapter eyebrow style. 8px below it, skill names are one wrapping sentence separated by `, `. Groups are 24px apart. Tailwind CSS is rendered as `Tailwind CSS (low experience)`. No other skill gets a note. Skills are not pills, icons, or a rating bar.

## 12. Hover, focus, active, and loading

### Year button

| State | Stamp cell | Text cell | Ring |
| --- | --- | --- | --- |
| Default | `--field` | transparent | none |
| Hover | `--field` | `--row` | none |
| Selected | `--stamp` | `--row` | none |
| Selected + hover | `--stamp` | `--row` | none |
| Focus-visible | unchanged from selection | unchanged | inset 2px `--ink` |

The selected row and the hover row share the same fill. The stamp is what shows selection. Disabled is unused. There is no pressed offset.

Buttons use `appearance: none`, `border-radius: 0`, `text-align: left`, `cursor: pointer`, `width: 100%`, and `color: inherit`.

### Links

| State | Decoration |
| --- | --- |
| Default | 1px underline, `--ink`, offset 3px |
| Hover | underline color `--stamp`, text stays `--ink` |
| Focus-visible | inset 2px `--ink` ring, plus the underline |
| Active | underline thickness 2px |

### Loading

Chapter content is imported JSON. There is no request and no spinner. A failed import renders one body sentence in the chapter column: `The record could not be loaded.` The folio and the rail border remain.

## 13. Animation timing and easing

Allowed transitions, only when the user has not requested reduced motion:

| Property | Duration | Easing |
| --- | --- | --- |
| Stamp cell `background-color` | 200ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Year text cell `background-color` | 200ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Chapter `opacity` | 200ms | `cubic-bezier(0.2, 0, 0, 1)` |

The chapter transition runs on opacity only. The old chapter is replaced in the same box. Opacity may start at 0 and end at 1. Position, width, and height do not animate.

No transform, no spring, no stagger, no scroll-driven animation, no animated underline on the folio.

## 14. Accessibility and reduced motion

- `html` `lang="en"`.
- Minimum text contrast for content is WCAG AA. Secondary text at 13px meets 5.55:1.
- The stamp is non-text and meets 3.08:1. It is never the foreground of a word.
- Focus is visible on every button and link, including the selected year. `:focus-visible` only, so pointer clicks do not leave a ring.
- Target size for each year button is at least 88px by 148px on mobile and 88px by 320px on desktop.
- Chapter title is an `h1`. There is one `h1`. It updates with the chapter. Group labels and project labels are `h2`. Case-study labels are `h3`.
- The rail's accessible name is `Record`. A visual heading is not added.
- Color is not the only selected state: the selected tab has `aria-selected="true"` and the stamp.
- Keyboard order: folio contact link if it exists, then the selected year tab, then the chapter panel and its links. Arrow keys move between tabs as specified in section 8.
- `prefers-reduced-motion: reduce` sets every transition and animation duration to `0.01ms` and `scroll-behavior: auto`. The selected stamp and row fill are still painted.

## 15. Image and asset requirements

Version 1 uses no photographs, no illustrations, and no project screenshots.

Existing `public/favicon.svg` stays until a later asset task. A replacement, if made, is a square SVG: `--field` ground with an 8px `--stamp` bar on the left. It is not required to ship the layout.

A future project image:

| Rule | Value |
| --- | --- |
| Formats | WebP or JPEG |
| Source width | at least 1280px |
| Display | max 640px wide, aspect-ratio 4 / 3, `object-fit: cover` |
| Border | 1px solid `--ink` |
| Alt | required, or the image is omitted |
| Loading | `loading="lazy"` and explicit `width` and `height` matching 4:3 |

Fonts are the only remote asset. No analytics script and no third-party widget.

## 16. Responsive behavior by region

| Region | ≥1100px | 700–1099px | ≤699px |
| --- | --- | --- | --- |
| Shell | 72px header, 320px rail, fluid chapter, `100dvh`, no document scroll | 64px header, 220px rail | Auto header, 88px rail, fluid chapter |
| Folio | Single row, 22px name, availability on the right | Single row, 18px name | Name on its own line, title and availability on the next line |
| Rail | Vertical, 88px rows, 40px numerals, right border `--ink` | Vertical, 64px rows, 28px numerals | Horizontal snap scroller, stamp on the top edge, bottom border `--ink` |
| Chapter | Padding 48px 64px 96px, title 40px, body 18px, column 640px | Padding 32px 32px 64px, title 32px, body 17px | Padding 24px 16px 48px, title 32px, body 17px |
| Skills | Inside Now, comma-separated lines, 640px measure | Same, narrower measure | Same, padding of the chapter |
| Projects | In the owning chapter, one column | Same | Same, image scales to the column |
| Contact | Right side of the folio, only with an href | Same | Second folio line, 24px left of availability, wraps under the title if the line exceeds the viewport |

At every width the selected year keeps the stamp and the `--row` fill. The chapter heading remains the left edge of the text column.
